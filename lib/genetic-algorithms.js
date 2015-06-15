/*eslint-disable */
// http://burakkanber.com/blog/machine-learning-genetic-algorithms-part-1-javascript/
/*eslint-enable */

"use strict";

import "babel/register";
import "babel/polyfill";
import fs from "fs";
import jsdom from "jsdom";
import DOMTreeGenerator from "./dom-tree-generator";

const jquery = fs.readFileSync(
    `${__dirname}/../bower_components/jquery/dist/jquery.js`,
    "utf-8"
);

let generator = new DOMTreeGenerator();

/**
 *  decorator to promisify instance methods
 *
 *  @param {Object} target
 *  @param {String} name
 *  @param {Object} descriptor
 *  @return {Object}
 */
function promisified(target, name, descriptor) {
    let original = descriptor.value;

    descriptor.value = function (...args) {
        return new Promise((resolve, reject) => {
            let then = (err, res) => {
                if (err) {
                    return reject(err);
                }

                resolve(res);
            };

            original.apply(this, args.concat(then));
        });
    };

    return descriptor;
}

/**
 *  sleep
 *
 *  @param {Number} duration
 *  @returns {Promise}
 */
async function sleep(duration) {
    return new Promise(done => setTimeout(() => done(), duration));
}

/**
 *  Gene
 *
 *  @class Gene
 */
class Gene {
    /**
     *  constructor
     *
     *  @param {String} tree
     */
    constructor(tree = "") {
        this.tree = tree;
        this.score = -1;
    }

    /**
     *  set random chromosomes
     *
     *  @param {Number} length
     *  @param {Function} done
     */
    @promisified
    random(length, done) {
        generator.generate((err, tree) => {
            if (err) {
                return done(err);
            }

            console.log(tree);

            this.code = tree;

            done();
        });
    }

    /**
     *  calculate the optimality of a chromosome
     *
     *  @param {String} compareTo
     *  @param {Function} done
     */
    @promisified
    calcScore(compareTo, done) {
        // とりあえず木の高さに比例して評価を高くしよう
        jsdom.env({
            html: this.tree,

            src: [jquery],

            done: (err, window) => {
                if (err) {
                    return done(err);
                }

                let $ = window.$;
                let max = 0;

                $("*").each(function () {
                    let parent;
                    let depth = 0;

                    do {
                        parent = $(this).parent();
                        depth++;
                    } while (parent.length);

                    max = (max < depth) ? depth : max;
                });

                this.score = max;

                done();
            }
        });
    }

    /**
     *  generate new gene by mating
     *
     *  @param {Gene} gene
     *  @param {Function} done
     */
    @promisified
    mate(gene, done) {
        let pivot = Math.round(this.code.length / 2) - 1;
        let child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
        let child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);

        done(null, [new Gene(child1), new Gene(child2)]);
    }

    /**
     *  make one of its letters randomly change
     *
     *  @param {Number} chance
     *  @param {Function} done
     */
    @promisified
    mutate(chance, done) {
        if (Math.random() > chance) {
            return done();
        }

        let idx = Math.floor(Math.random() * this.code.length);
        let upOrDown = Math.random() <= 0.5 ? -1 : 1;
        let newChar = String.fromCharCode(
            this.code.charCodeAt(idx) + upOrDown
        );
        let newStr = "";

        for (let i = 0; i < this.code.length; i++) {
            if (i === idx) {
                newStr += newChar;
            } else {
                newStr += this.code[i];
            }
        }

        this.code = newStr;

        done();
    }
}

/**
 *  Population
 *
 *  @class Population
 */
class Population {
    /**
     *  constructor
     *
     *  @param {String} goal
     *  @param {Number} size
     */
    constructor(goal, size) {
        this.members = [];
        this.goal = goal;
        this.size = size;
        this.generationNumber = 0;
    }

    /**
     *  initialize genes
     */
    async initGenes() {
        while (this.size--) {
            let gene = new Gene();

            await gene.random(this.goal.length);
            this.members.push(gene);
        }
    }

    /**
     *  sort members
     */
    sort() {
        this.members.sort((a, b) => a.cost - b.cost);
    }

    /**
     *  return false if found the optimum solution
     *
     *  @returns {Boolean}
     */
    async generation() {
        let members = this.members;

        for (let i = 0; i < members.length; i++) {
            await members[i].calcCost(this.goal);
        }

        this.sort();
        this.display();

        let children = await members[0].mate(members[1]);

        members.splice(members.length - 2, 2, children[0], children[1]);

        for (let i = 0; i < members.length; i++) {
            await members[i].mutate(0.5);
            await members[i].calcCost(this.goal);

            // finish
            if (members[i].code === this.goal) {
                this.sort();
                this.display();

                return false;
            }
        }

        this.generationNumber++;

        return true;
    }

    /**
     *  display logs
     */
    display() {
        console.log(`\nGeneration ${this.generationNumber}:`);

        for (let i = 0; i < this.members.length; i++) {
            console.log(`${this.members[i].code} (${this.members[i].cost})`);
        }
    }
}

/**
 *  main
 */
(async () => {
    let population = new Population("Hello, world!", 20);

    await population.initGenes();

    while (await population.generation()) {
        await sleep(20);
    }
})();

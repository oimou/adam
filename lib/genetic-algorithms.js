/*eslint-disable */
// http://burakkanber.com/blog/machine-learning-genetic-algorithms-part-1-javascript/
/*eslint-enable */

"use strict";

import "babel/polyfill";

class Gene {
    constructor(code = "") {
        this.code = code;
        this.cost = 9999;
    }

    random(length) {
        return new Promise(done => {
            while (length--) {
                this.code += String.fromCharCode(
                    Math.floor(Math.random() * 255)
                );
            }

            done();
        });
    }

    calcCost(compareTo) {
        return new Promise(done => {
            let total = 0;
            let code = this.code;

            for (let i = 0; i < code.length; i++) {
                total += Math.pow(
                    code.charCodeAt(i) - compareTo.charCodeAt(i), 2
                );
            }

            this.cost = total;

            done();
        });
    }

    mate(gene) {
        return new Promise(done => {
            let pivot = Math.round(this.code.length / 2) - 1;
            let child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
            let child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);

            done([new Gene(child1), new Gene(child2)]);
        });
    }

    mutate(chance) {
        return new Promise(done => {
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
        });
    }
}

class Population {
    constructor(goal, size) {
        this.members = [];
        this.goal = goal;
        this.size = size;
        this.generationNumber = 0;
    }

    async initGenes() {
        while (this.size--) {
            let gene = new Gene();

            await gene.random(this.goal.length);
            this.members.push(gene);
        }
    }

    sort() {
        this.members.sort((a, b) => a.cost - b.cost);
    }

    /**
     *  最適解を見つけたらfalseを返す
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

    display() {
        console.log(`\nGeneration ${this.generationNumber}:`);

        for (let i = 0; i < this.members.length; i++) {
            console.log(`${this.members[i].code} (${this.members[i].cost})`);
        }
    }
}

/**
 *  sleep
 */
async function sleep(duration) {
    return new Promise(done => setTimeout(() => done(), duration));
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

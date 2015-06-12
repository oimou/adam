/*eslint-disable */
// http://burakkanber.com/blog/machine-learning-genetic-algorithms-part-1-javascript/
/*eslint-enable */

"use strict";

class Gene {
    constructor(code) {
        this.code = "";

        if (code) {
            this.code = code;
        }

        this.cost = 9999;
    }

    random(length) {
        while (length--) {
            this.code += String.fromCharCode(Math.floor(Math.random() * 255));
        }
    }

    calcCost(compareTo) {
        let total = 0;
        let code = this.code;

        for (let i = 0; i < code.length; i++) {
            total += Math.pow(code.charCodeAt(i) - compareTo.charCodeAt(i), 2);
        }

        this.cost = total;
    }

    mate(gene) {
        let pivot = Math.round(this.code.length / 2) - 1;
        let child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
        let child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);

        return [new Gene(child1), new Gene(child2)];
    }

    mutate(chance) {
        if (Math.random() > chance) {
            return;
        }

        let idx = Math.floor(Math.random() * this.code.length);
        let upOrDown = Math.random() <= 0.5 ? -1 : 1;
        let newChar = String.fromCharCode(this.code.charCodeAt(idx) + upOrDown);
        let newStr = "";

        for (let i = 0; i < this.code.length; i++) {
            if (i === idx) {
                newStr += newChar;
            } else {
                newStr += this.code[i];
            }
        }

        this.code = newStr;
    }
}

class Population {
    constructor(goal, size) {
        this.members = [];
        this.goal = goal;
        this.generationNumber = 0;

        while (size--) {
            let gene = new Gene();

            gene.random(this.goal.length);
            this.members.push(gene);
        }
    }

    sort() {
        this.members.sort((a, b) => a.cost - b.cost);
    }

    generation() {
        let members = this.members;

        for (let i = 0; i < members.length; i++) {
            members[i].calcCost(this.goal);
        }

        this.sort();
        this.display();

        let children = members[0].mate(members[1]);

        members.splice(members.length - 2, 2, children[0], children[1]);

        for (let i = 0; i < members.length; i++) {
            members[i].mutate(0.5);
            members[i].calcCost(this.goal);

            // finish
            if (members[i].code === this.goal) {
                this.sort();
                this.display();

                return true;
            }
        }

        this.generationNumber++;

        setTimeout(() => this.generation(), 20);
    }

    display() {
        console.log(`\nGeneration ${this.generationNumber}:`);

        for (let i = 0; i < this.members.length; i++) {
            console.log(`${this.members[i].code} (${this.members[i].cost})`);
        }
    }
}

let population = new Population("Hello, world!", 20);
population.generation();

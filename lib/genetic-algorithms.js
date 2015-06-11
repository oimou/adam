// http://burakkanber.com/blog/machine-learning-genetic-algorithms-part-1-javascript/

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

        for (let i = 0; i < this.code.length; i++) {
            total += (this.code.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
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

        let index = Math.floor(Math.random() * this.code.length);
        let upOrDown = Math.random() <= 0.5 ? -1 : 1;
        let newChar = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);
        let newStr = "";

        for (let i = 0; i < this.code.length; i++) {
            if (i == index) {
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
        for (let i = 0; i < this.members.length; i++) {
            this.members[i].calcCost(this.goal);
        }

        this.sort();
        this.display();

        let children = this.members[0].mate(this.members[1]);

        this.members.splice(this.members.length - 2, 2, children[0], children[1]);

        for (let i = 0; i < this.members.length; i++) {
            this.members[i].mutate(0.5);
            this.members[i].calcCost(this.goal);

            if (this.members[i].code == this.goal) {
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

import {expect} from "chai";
import {DOMTreeGenerator} from "../lib/dom-tree-generator";

describe("DOMTreeGenerator", () => {
    var generator = new DOMTreeGenerator();

    describe("generate", () => {
        it("should return html string asynchronousy", (done) => {
            generator.generate((err, html) => {
                if (err) return done(err);

                expect(html).to.be.a("string");
                done();
            });
        });
    });
});

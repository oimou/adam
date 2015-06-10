var expect = require("chai").expect;
var DOMTreeGenerator = require("../lib/DOMTreeGenerator");

describe("DOMTreeGenerator", function () {
    var generator = new DOMTreeGenerator();

    describe("generate", function () {
        it("should return html string asynchronousy", function (done) {
            generator.generate(function (err, html) {
                if (err) return done(err);

                expect(html).to.be.a("string");
                done();
            });
        });
    });
});

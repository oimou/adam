var DOMTreeGenerator = require("./lib/dom-tree-generator");
var generator = new DOMTreeGenerator();

generator.generate(function (err, html) {
    console.log(html);
});

var DOMTreeGenerator = require("./lib/DOMTreeGenerator");
var generator = new DOMTreeGenerator();

generator.generate(function (err, html) {
    console.log(html);
});

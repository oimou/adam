"use strict";

let DOMTreeGenerator = require("./lib/dom-tree-generator");
let generator = new DOMTreeGenerator();

generator.generate((err, html) => console.log(html)); // eslint-disable-line

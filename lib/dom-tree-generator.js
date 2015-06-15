"use strict";

import _ from "underscore";
import jsdom from "jsdom";
import fs from "fs";

const N_NODE = 100;
const jquery = fs.readFileSync(
    `${__dirname}/../bower_components/jquery/dist/jquery.js`,
    "utf-8"
);

export default class DOMTreeGenerator {
    generate(callback) {

        jsdom.env({
            html: "<body></body>",

            src: [
                jquery
            ],

            done: function(err, window) {
                if (err) {
                    throw err;
                }

                let $ = window.$;
                let X = _.range(N_NODE).map(createNode);
                let Y = [X[0]];
                let E = [];

                while (Y.length !== X.length) {
                    let x1 = _.sample(Y);
                    let x2 = _.chain(X).difference(Y).sample().value();

                    E.push(createEdge(x1, x2));

                    Y.push(x2);
                }

                for (let i = 0, len = E.length; i < len; i++) {
                    let edge = E[i];

                    edge.source.$element.append(edge.target.$element);
                }

                X[0].$element.appendTo("body");

                callback(null, $("body").html());

                function createNode() {
                    let id = _.uniqueId("n");

                    return {
                        id: id,
                        x: Math.random(),
                        y: Math.random(),
                        size: 2,
                        $element: createElement()
                    };
                }

                function createEdge(source, target) {
                    return {
                        id: _.uniqueId("e"),
                        source: source,
                        target: target
                    };
                }

                function createElement() {
                    let tags = [
                        "<div class='div'></div>",
                        "<span></span>",
                        "<p></p>",
                        "<a></a>"
                    ];
                    let tag = _.sample(tags);
                    let $element = $(tag);

                    $element.text(Math.random());

                    return $element;
                }

            }
        });

    }
}

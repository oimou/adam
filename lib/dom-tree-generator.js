import _ from "underscore";
import jsdom from "jsdom";

const N_NODE = 100;

export class DOMTreeGenerator {
    generate(callback) {

        jsdom.env(
            "<body></body>",
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                var $ = window.$;
                var X = _.range(N_NODE).map(createNode);
                var Y = [X[0]];
                var E = [];

                while (Y.length !== X.length) {
                    var x1 = _.sample(Y);
                    var x2 = _.chain(X).difference(Y).sample().value();

                    E.push(createEdge(x1, x2));

                    Y.push(x2);
                }

                for (var i = 0, len = E.length; i < len; i++) {
                    var edge = E[i];

                    edge.source.$element.append(edge.target.$element);
                }

                X[0].$element.appendTo("body");

                callback(null, $("body").html());

                function createNode() {
                    var id = _.uniqueId("n");

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
                    var tags = ["<div class='div'></div>", "<span></span>", "<p></p>", "<a></a>"];
                    var tag = _.sample(tags);
                    var $element = $(tag);

                    $element.text(Math.random());

                    return $element;
                }

            }
        );

    }
}

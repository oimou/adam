"use strict";

import "babel/polyfill";
import co from "co";
import thunkify from "thunkify";

let sleep = thunkify(function (duration, callback) {
    setTimeout(function () {
        callback(null, new Date());
    }, duration);
});

class CoClass {
    *hello() {
        console.log(1, yield sleep(2000));
        console.log(2, yield sleep(2000));
    }
}

let coClass = new CoClass();

co(coClass.hello);

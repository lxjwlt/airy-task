(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.aTask = factory());
}(this, (function () { 'use strict';

function airyTask (list, func) {
    let queue = [].slice.apply(list);

    return new Promise((resolve, reject) => {

        main(queue, func, () => {
            queue = null;
            resolve();
        }, reject);

    })
}

function main (queue, func, resolve, reject, index) {

    index = index || 0;

    nextTick(() => {
        let lastTime = Date.now();
        let len = queue.length;

        while (index < len && Date.now() - lastTime <= 16) {
            let result = func({
                value: queue[index],
                index: index
            });

            index += 1;

            if (isPromise(result)) {
                result.then(() => {
                    main(queue, func, resolve, reject, index);
                });
                return
            }

            if (result === false) {
                reject();
                return
            }
        }

        if (index < len) {
            main(queue, func, resolve, reject, index);
        } else {
            resolve();
        }
    });

}

function nextTick (func) {

    if (typeof process !== 'undefined') {
        return process.nextTick(func)
    }

    if (typeof requestAnimationFrame !== 'undefined') {
        return requestAnimationFrame(func)
    }

    return setTimeout(func, 0)
}

function isPromise (value) {
    return Object.prototype.toString.call(value) === '[object Promise]'
}

var src = airyTask;

return src;

})));

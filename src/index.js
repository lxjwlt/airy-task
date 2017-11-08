function airyTask (list, func) {
    let queue = [].slice.apply(list)

    return new Promise((resolve, reject) => {

        main(queue, func, () => {
            queue = null
            resolve()
        }, () => {
            queue = null
            reject()
        })

    })
}

function main (queue, func, resolve, reject, index) {

    index = index || 0;

    nextTick(() => {
        let lastTime = Date.now()
        let len = queue.length;

        while (index < len && Date.now() - lastTime <= 16) {
            let result = func({
                value: queue[index],
                index: index
            })

            index += 1;

            if (isPromise(result)) {
                result.then(() => {
                    main(queue, func, resolve, reject, index);
                })
                return
            }

            if (result === false) {
                reject()
                return
            }
        }

        if (index < len) {
            main(queue, func, resolve, reject, index)
        } else {
            resolve();
        }
    })

}

function nextTick (func) {

    if (typeof requestAnimationFrame !== 'undefined') {
        return requestAnimationFrame(func)
    }

    return setTimeout(func, 0)
}

function isPromise (value) {
    return value && typeof value.then === 'function'
}

module.exports = airyTask

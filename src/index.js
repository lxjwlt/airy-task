function airyTask (list, func) {
    let queue = [].slice.apply(list)

    return new Promise((resolve, reject) => {

        main(queue, func, () => {
            queue = null
            resolve()
        }, reject)

    })
}

function main (queue, func, resolve, reject) {

    nextTick(() => {
        let lastTime = Date.now()

        while (queue.length && Date.now() - lastTime <= 16) {
            let result = func({
                value: queue.shift(),
                remain: queue.length
            })

            if (isPromise(result)) {
                result.then(() => {
                    main.apply(null, arguments)
                })
                return
            }

            if (result === false) {
                reject()
                return
            }
        }

        if (queue.length) {
            main.apply(null, arguments)
        } else {
            resolve();
        }
    })

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

module.exports = airyTask

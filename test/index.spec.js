'use strict'

const assert = require('assert')
const aTask = require('..')

describe('airy-task', function () {
    it('normal', function (done) {
        let arr = [1, 2, 3, 4, 5]
        let orderList = []

        aTask(arr, ({value}) => {
            orderList.push(value)
        }).then(() => {
            assert.deepEqual(arr, orderList)
            done()
        })
    })
    it('nest invoke airy-task', function (done) {
        let arr = [1, 2, 3]
        let orderList = []

        aTask(arr, ({value}) => {
            orderList.push(value)
            if (value === 2) {
                return aTask(arr, ({value}) => {
                    orderList.push(value)
                })
            }
        }).then(() => {
            assert.deepEqual(arr, [1, 2, 3])
            assert.deepEqual(orderList, [1, 2, 1, 2, 3, 3])
            done()
        })
    })
    it('support return promise', function (done) {
        let arr = [1, 2, 3]
        let orderList = []

        aTask(arr, ({value}) => {
            if (value === 1) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        orderList.push(100);
                        resolve()
                    }, 20)
                });
            }
            orderList.push(value)
        }).then(() => {
            assert.deepEqual(arr, [1, 2, 3])
            assert.deepEqual(orderList, [100, 2, 3])
            done()
        })
    })
    it('task can be cancel', function (done) {
        let orderList = [];

        aTask([1, 2, 3], ({value}) => {
            if (value === 1) {
                return false;
            }
            orderList.push(value);
        }).then(() => {
            throw(new Error('not cancelable'))
        }).catch(() => {
            assert.deepEqual(orderList, []);
            done();
        })
    })
})

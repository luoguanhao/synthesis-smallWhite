/* 手写Promise */

export class MyPromise {
  constructor(executor) {
    // 初始状态
    this.status = 'pending';
    // 成功的value
    this.value = null;
    // 失败的reason
    this.reason = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    // 成功的函数
    let resolve = value => {
      if (this.status === 'pending') {
        this.value = value;
        this.status = 'fulfilled';
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach(fn => fn(this.value));
      }
    };
    // 失败的函数
    let reject = reason => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach(fn => fn(this.reason));
      }
    };
    // 立即执行
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  /**
   * then方法
   * @param {Function} onFulfilled 成功时执行的函数
   * @param {Function} onRejected 失败时执行的函数
   */
  then(onFulfilled, onRejected) {
    let self = this;
    // 如果onfulfilled不是函数 那么就用默认的函数替代 以便达到值穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    // 如果onrejected不是函数 那么就用默认的函数替代 以便达到值穿透
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : err => {
            throw err;
          };

    let promise2 = new Promise((resolve, reject) => {
      // 加入setTimeout 模拟异步
      // 如果调用then的时候promise 的状态已经变成了fulfilled 那么就调用成功回调 并且传递参数为 成功的value
      // 状态为fulfilled，执行onFulfilled，传入成功的值
      if (self.status === 'fulfilled') {
        setTimeout(() => {
          // 如果执行回调发生了异常 那么就用这个异常作为promise2的失败原因
          try {
            // x 是执行成功回调的结果
            let x = onFulfilled(self.value);
            // 调用resolvePromise函数 根据x的值 来决定promise2的状态
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      // 状态为rejected，执行onRejected，传入失败的原因
      if (self.status === 'rejected') {
        setTimeout(() => {
          // 如果执行回调发生了异常 那么就用这个异常作为promise2的失败原因
          try {
            // x 是执行成功回调的结果
            let x = onRejected(self.reason);
            // 调用resolvePromise函数 根据x的值 来决定promise2的状态
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      // 当状态status为pending时，采用发布订阅模式，将可执行的方法推入对应数组内部；
      // 解决当executor为异步时，无法执行对应的回调
      if (self.status === 'pending') {
        //如果调用then的时候promise的状态还是pending，说明promsie执行器内部的resolve或者reject是异步执行的，那么就需要先把then方法中的成功回调和失败回调存储袭来，等待promise的状态改成fulfilled或者rejected时候再按顺序执行相关回调
        self.onResolvedCallbacks.push(() => {
          //setTimeout模拟异步
          setTimeout(function() {
            // 如果执行回调发生了异常 那么就用这个异常作为promise2的失败原因
            try {
              // x 是执行成功回调的结果
              let x = onFulfilled(self.value);
              // 调用resolvePromise函数 根据x的值 来决定promise2的状态
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        self.onRejectedCallbacks.push(() => {
          //setTimeout模拟异步
          setTimeout(function() {
            // 如果执行回调发生了异常 那么就用这个异常作为promise2的失败原因
            try {
              // x 是执行失败回调的结果
              let x = onRejected(self.reason);
              // 调用resolvePromise函数 根据x的值 来决定promise2的状态
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
}

/* 
链式调用规范：
1、每个then方法都返回一个新的Promise对象（原理的核心）
2、如果then方法中显示地返回了一个Promise对象就以此对象为准，返回它的结果
3、如果then方法中返回的是一个普通值（如Number、String等）就使用此值包装成一个新的Promise对象返回。
4、如果then方法中没有return语句，就视为返回一个用Undefined包装的Promise对象
5、若then方法中出现异常，则调用失败态方法（reject）跳转到下一个then的onRejected
6、如果then方法没有传入任何回调，则继续向下传递（值的传递特性）。
*/

/**
 * 解析then返回值与新Promise对象
 * @param {Object} promise2 promise2 新的Promise对象
 * @param {*} x 上一个then的返回值
 * @param {Function} resolve2 promise2的resolve
 * @param {Function} reject2 promise2的reject
 */
function resolvePromise(promise2, x, resolve2, reject2) {
  if (promise2 === x) {
    reject2(new TypeError('Promise发生了循环引用'));
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        //then是function，那么执行Promise
        then.call(
          x,
          y => {
            // resolve(y);
            //递归调用，传入y若是Promise对象，继续循环
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            reject(r);
          }
        );
      } else {
        resolve2(x);
      }
    } catch (error) {
      reject2(error);
    }
  } else {
    //否则是个普通值
    resolve2(x);
  }
}

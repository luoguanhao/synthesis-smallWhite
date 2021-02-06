import { MyPromise } from './promise';

function console_my_promise(param) {
  console.log('MyPromise, then的onFulFilled:', param);
}

function console_promise(param) {
  console.log('原生promise, then的onFulFilled:', param);
}

/* 自己的promise */
new MyPromise(function(resolve, reject) {
  setTimeout(() => {
    resolve(1);
  });
})
  .then(
    value => {
      console_my_promise(value);
      return value;
    },
    reason => {
      console_my_promise(reason);
    }
  )
  .then()
  .then(
    value => {
      console_my_promise(value + 1);
      return value + 1;
    },
    reason => {
      console_my_promise(reason);
    }
  )
  .then(
    value => {
      console_my_promise(value + 1);
    },
    reason => {
      console_my_promise(reason);
    }
  );

setTimeout(() => {
  console.log(2222222222222);
});

/* 原生promise */
new Promise((resolve, reject) => {
  resolve(2);
}).then(
  value => {
    console_promise(value);
  },
  reason => {
    console_promise(reason);
  }
);
new Promise((resolve, reject) => {
  resolve(3);
}).then(
  value => {
    console_promise(value);
  },
  reason => {
    console_promise(reason);
  }
);

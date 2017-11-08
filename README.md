# airy-task

## Installation

```
npm install airy-task -S
```

## Usage

```javascript
const aTask = require('airy-task');

let longList = [/* ... */];

aTask(longList, ({value, index}) => {
    // do task
}).then(() => {
    // done
});
```

/**/
setTimeout(() => {
var start = Date.now();
var arr = {};
for (i = 0; i < 1000000; i++) {
    arr[i + ''] = Math.random();
}
var end = Date.now();
console.log(end - start);

setTimeout(() => {
    console.log(arr[Math.random()*1000 | 0]);
}, 200000000);
}, 100);

/*
setTimeout(() => {
var start = Date.now();
var arr = new Map();
for (i = 0; i < 1000000; i++) {
    arr.set(i + '', Math.random());
}
var end = Date.now();
console.log(end - start);
setTimeout(() => {
    emitTTDLog(__dirname + '/../snapshot');
    process.exit();
}, 2000);
setTimeout(() => {
    console.log(arr[Math.random()*1000 | 0]);
}, 200000000);
}, 100);
*/

/*
setTimeout(() => {
var start = Date.now();
var arr = [], arr2 = [];
for (i = 0; i < 1000000; i++) {
    arr.push(i + '');
    arr2.push(Math.random());
}
var end = Date.now();
console.log(end - start);
setTimeout(() => {
    console.log(arr[Math.random()*1000 | 0]);
}, 200000000);
}, 100);
*/

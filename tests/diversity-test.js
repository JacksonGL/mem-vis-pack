ttdLogURI = __dirname + '/../snapshot';

setTimeout(() => {}, 0);
setTimeout(function() {
    function body() {
        console.log('body');
        console.log(regex1);
        console.log(regex2);
        console.log(boundFunc);
        console.log(date1);
        console.log(date2);
        console.log(typedArr1);
        console.log(typedArr2);
        console.log(typedArr3);
        console.log(typedArr4);
        console.log(typedArr5);
        console.log(typedArr6);
        console.log(typedArr7);
        console.log(typedArr8);
        console.log(typedArr9);
        console.log(map);
        console.log(set);
        console.log(proxy);

        promise
            .then(succMsg => {
                console.log('Yay! ' + succMsg);
            })
            .catch(reason => {
                console.log('Oops! ' + reason);
            });
    }

    // regex info
    var regex1 = /[test][test]/;
    var regex2 = /<\s*(\S+)(\s[^>]*)?>[\s\S]*<\s*\/\1\s*>/;

    // bound function info
    var func = function(test) {
        console.log(this);
    };
    var boundFunc = func.bind(regex1, 'test args');

    // date info
    var date1 = new Date();
    var date2 = Date.now();

    // typed array info
    var typedArr1 = new Int8Array(100);
    var typedArr2 = new Uint8Array(100);
    var typedArr3 = new Uint8ClampedArray(100);
    var typedArr4 = new Int16Array(100);
    var typedArr5 = new Uint16Array(100);
    var typedArr6 = new Int32Array(100);
    var typedArr7 = new Uint32Array(100);
    var typedArr8 = new Float32Array(100);
    var typedArr9 = new Float64Array(100);

    // map info
    var map = new Map();
    map.set(typedArr1, typedArr2);
    map.set('key1', date2);

    // set info
    var set = new Set();
    set.add('test');
    set.add(typedArr9);
    set.add(boundFunc);

    // proxy info
    // example code from MDN
    var handler = {
        get: function(target, name) {
            return name in target ? target[name] : 37;
        },
    };

    var proxy = new Proxy({}, handler);
    proxy.a = 1;
    proxy.b = undefined;

    // promise
    let promise = new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve('Success!'); // Yay! Everything went well!
        }, 1000);
    });

    // TODO: external function info
    // TBD...

    // TODO: boxed info
    // TBD...

    // TODO: heapArguments info
    // TBD...

    // TODO: revokerFunc info
    // TBD...

    // TODO: promiseResRej info
    // TBD...

    // TODO: promiseReactTaskFunc info
    // TBD...

    // TODO: promiseAllResElemFunc info
    // TBD...

    // TODO: ES5Array Info
    // TBD...

    // TODO: set info
    // TBD...

    var timer = setInterval(function timeoutCB_() {
        body();
    }, 200);

    if (global.emitTTDLog) {
        setTimeout(function timeoutCB_() {
            emitTTDLog(ttdLogURI);
            clearInterval(timer);
        }, 500);
    }

}, 100);

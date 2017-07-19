global.asyncFunc = async function add(x) {
    var a = resolveAfter2Seconds(20);
    var b = resolveAfter2Seconds(30);
    return x + (await a) + (await b);
};

function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}

setTimeout(() => {}, 0);
setTimeout(function() {
    function resolveAfter2Seconds(x) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, 2000);
        });
    }

    async function add1(x) {
        var a = resolveAfter2Seconds(20);
        var b = resolveAfter2Seconds(30);
        return x + (await a) + (await b);
    }

    add1(10).then(v => {
        console.log(v); // prints 60 after 2 seconds.
    });

    async function add2(x) {
        var a = await resolveAfter2Seconds(20);
        var b = await resolveAfter2Seconds(30);
        return x + a + b;
    }

    add2(10).then(v => {
        console.log(v); // prints 60 after 4 seconds.
    });

    var ttdLogURI = __dirname + '/../snapshot';

    if (global.emitTTDLog) {
        setTimeout(function() {
            console.log(add2);
            emitTTDLog(ttdLogURI);
        }, 500);
    }
}, 100);

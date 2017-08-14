ttdLogURI = __dirname + '/../snapshot';

global.arr = [];

setTimeout(() => {}, 0);
setTimeout(function () {

    require(__dirname + '/leak-example2.js');

    if (global.emitTTDLog) {
        setTimeout(function timeoutCB_() {
            emitTTDLog(ttdLogURI);
        }, 10);
    }

}, 100);
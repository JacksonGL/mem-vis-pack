ttdLogURI = __dirname + '/../snapshot';

global.arr = [];

require(__dirname + '/leak-example2.js');

if (global.emitTTDLog) {
    setTimeout(function timeoutCB_() {
        emitTTDLog(ttdLogURI);
    }, 10);
}
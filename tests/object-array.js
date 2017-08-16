ttdLogURI = __dirname + '/../snapshot';
var i;
global.arr = {};
global.arr2 = {};
(function () {
    setTimeout(function() {}, 0);
    setTimeout(function() {
        for (i = 0; i < 100000; i++) {
            arr[i] = Math.random()
        }
        for (i = 0; i < 100000; i++) {
            arr2[i + '1'] = Math.random();
        }
    }, 100);
    setTimeout(function() {
        emitTTDLog(ttdLogURI);
    }, 500);
})();


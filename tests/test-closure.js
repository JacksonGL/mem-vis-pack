function getCal() {
    var arr = new Array(100000);
    var result = arr.slice(1,1);
    /*
    function unused() {
        return arr.length + result;
    }
    */
    return function ret(val) {
        return val * result;
    };
}


global.cal = getCal();


if (global.emitTTDLog) {
    console.log(cal);
    var ttdLogURI = __dirname + '/../snapshot';
    emitTTDLog(ttdLogURI);
}

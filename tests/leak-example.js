function outter() {
    var v1 = new Int32Array(1000000);
    var v2 = v1.slice(1, 1);

    function unused() {
        return v1.length + ': ' + v2;
    }
    return function inner(v) {
        return v * v2;
    };
}

ref = outter();

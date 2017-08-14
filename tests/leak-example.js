ttdLogURI = __dirname + '/../snapshot';

setTimeout(() => {}, 0);
setTimeout(function () {

    var theThing = null;
    var replaceThing = function () {
        var originalThing = theThing;
        var unused = function () {
            if (originalThing)
                console.log("hi");
        };
        theThing = {
            longStr: new Array(10000).join('*'),
            someMethod: function () {
                console.log(someMessage);
            }
        };
    };
    var ref = setInterval(replaceThing, 100);

    if (global.emitTTDLog) {
        setTimeout(function timeoutCB_() {
            emitTTDLog(ttdLogURI);
            clearInterval(ref);
        }, 5000);
    }

}, 100);
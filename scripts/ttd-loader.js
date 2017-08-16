/**
 * trigger the event loop so that TTD can start working
 */
(function () {
    let path = require('path');
    let argv = process.argv.slice(1);
    function endsWith(str, substr) {
        return str.length === str.indexOf(substr) + (substr).length;
    }
    var idx = 1;
    while(argv[0] && (
        argv[0] === '--record' || 
        argv[0] === '--alloc-trace' ||
        endsWith(argv[0], 'ttd-loader.js') ||
        argv[0].indexOf('--replay') === 0)) {
        argv.shift(); idx++;
    }
    let mainFile = path.resolve(argv[0]);
    // console.log('[i]: main file is: ' + mainFile);
    process.argv.splice(idx-1, 1);
    // console.log(process.argv);
    process.argc--;

    setTimeout(() => {}, 0); // trigger event loop
    setTimeout(() => {       // trigger event loop
        // content of main file
        require(mainFile);
    }, 10);
})();
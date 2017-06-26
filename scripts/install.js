(function () {
    var spawn = require('child_process').spawn;
    var child = spawn('npm', [
        'install', '-g', 'serve']);

    child.stdout.pipe(process.stdout);
})();
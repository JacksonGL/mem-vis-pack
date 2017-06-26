(function () {
    let verbose = true;

    let fs = require('fs');
    let path = require('path');
    let spawn = require('child_process').spawn;
    let Promise = require('bluebird');
    const serve = require('serve');

    let argv = process.argv.slice(2);
    let replayDir = path.resolve(__dirname, 'snapshot');
    let memVisDir = path.resolve(__dirname, 'mem-vis');
    let binPath = path.resolve(__dirname, 'bin', 'node');
    let dataDir = path.resolve(memVisDir, 'data');
    let recordArgs = `--record ${argv.join(' ')}`;
    let replayArgs = `--replay=${replayDir} --alloc-trace ${argv.join(' ')}`;
    let handler = (err) => {
        if (!err) return;
        console.log('[!]: something wrong. Let me know (gongliang13@berkeley.edu). Thanks :-)');
        console.log(err);
    };
    let _consoleLog = console.log;
    let _console = console;
    let _slice = Array.prototype.slice;
    let log = function () {
        if (!verbose) return;
        _consoleLog.apply(_console, _slice.call(arguments, 0));
    };
    
    // record
    cleanDir(replayDir)
    .then(cleanDir.bind(null, dataDir), handler)
    .then(executeAndPromisify.bind(null, binPath, recordArgs.split(' '), '[i]: recording...'), handler)
    .then(executeAndPromisify.bind(null, binPath, replayArgs.split(' '), '[i]: replaying...'), handler)
    .then(copySnapshots.bind(null, replayDir, dataDir), handler)
    .then(openVisualization.bind(null), handler)
    .then(handler, handler);

    function openVisualization() {
        serve(memVisDir, {
            port: 5000
        });
    }

    function copySnapshots(sourceDir, destDir) {
        console.log('[i]: getting snapshot...');
        var sourceFile, destFile, completeCnt = 0, resolver;
        var files = ['snap_1.json', 'prop.json', 'allocTracing_0.json'];
        let promise = new Promise((resolve, reject) => {
            if (completeCnt >= files.length) {
                process.nextTick(resolve);
            } else {
                resolver = resolve;
            }
        });
        for (let file of files) {
            sourceFile = path.resolve(sourceDir, file);
            destFile = path.resolve(destDir, file);
            log(`\tcopying ${file}...`);
            // copy files
            fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destFile))
                .on('finish', () => {
                    if (++completeCnt >= files.length && resolver) {
                        process.nextTick(resolver);
                    }
                });
            
        }
        return promise;
    }

    function cleanDir(dir) {
        let promise = new Promise((resolve, reject) => {
            process.nextTick(resolve);
        });
        fs.readdir(dir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlinkSync(path.join(dir, file));
            }
            
        });
        return promise;
    }

    /**
     * execute a promisified shell command in a child process
     * @param {*} cmd 
     * @param {*} args 
     * @param {*} msg 
     */
    function executeAndPromisify(cmd, args, msg) {
        console.log(msg);
        let child = spawn(cmd, args);
        log('     ' + cmd + ' ' + args.join(' '));
        child.stdout.on('data', function (data) {
            log(data.toString());
        });

        child.stderr.on('data', function (data) {
            log(data.toString());
        });
        let promise = new Promise((resolve, reject) => {
            child.addListener('error', reject);
            child.addListener('exit', resolve);
        });
        return promise;
    }
})();
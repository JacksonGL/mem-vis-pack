(function () {
    'use strict';
    let verbose = false;

    let fs = require('fs');
    let path = require('path');
    let spawn = require('child_process').spawn;
    let Promise = require('bluebird');
    const serve = require('serve');
    const cp = require('child_process');
    let binPath = 'node'; // assume that the node binary the default node
    try {
        cp.execSync('node --alloc-trace -e "var test;"',  
            { stdio: ['ignore', 'ignore', 'pipe'] }
        );
    } catch (ex) {
        let err = ex + '';
        if (err.indexOf('bad option') >= 0) {
            // the mem-analysis host binary is not the default node
            // decide node binary location
            let osType = process.platform;
            let supportOs = fs.readdirSync(path.resolve(__dirname, 'bin'));
            if (supportOs.indexOf(osType) < 0) {
                console.log(`[!]: current os type (${osType}) is not supported`);
                return ;
            }
            console.log('[i]: using local node binary');
            binPath = path.resolve(__dirname, 'bin', osType, 'node');
        } else {
            console.log('[i]: Using node installed via nvs.');
        }
    }

    let argv = process.argv.slice(2);
    let replayDir = path.resolve(__dirname, 'snapshot');
    let memVisDir = path.resolve(__dirname, 'mem-vis');
    let dataDir = path.resolve(memVisDir, 'data');
    let recordArgs = `--record --alloc-trace ${__dirname + '/scripts/ttd-loader.js'} ${argv.join(' ')}`;
    let replayArgs = `--replay=${replayDir} --alloc-trace ${__dirname + '/scripts/ttd-loader.js'} ${argv.join(' ')}`;
    let handler = (err) => {
        if (!err) return;
        console.log('[!]: Something is wrong. Let me know (gongliang13@berkeley.edu). Thanks :)');
        console.log(err);
    };
    let _consoleLog = console.log;
    let _console = console;
    let _slice = Array.prototype.slice;
    let log = function () {
        if (!verbose) return;
        try {
            _consoleLog.apply(_console, _slice.call(arguments, 0));
        } catch(ex) {
            console.log(ex);
        }
    };

    // record
    cleanDir(replayDir)
    .then(cleanDir.bind(null, dataDir), handler)
    .then(executeAndPromisify.bind(null, binPath, recordArgs.split(' '), '[i]: recording...'), handler)
    // .then(executeAndPromisify.bind(null, binPath, replayArgs.split(' '), '[i]: replaying...'), handler)
    .then(copySnapshots.bind(null, replayDir, dataDir), handler)
    .then(openVisualization.bind(null), handler)
    .then(handler, handler);

    function openVisualization() {
        serve(memVisDir, {
            port: 5000
        });
    }

    let snapFileRegex = /snap_(\d+)\.json/;

    function copySnapshots(sourceDir, destDir) {
        console.log('[i]: getting snapshot...');
        var sourceFile, destFile, completeCnt = 0, resolver;
        // search for the snap_{id}.json with the max id
        let files = fs.readdirSync(replayDir);
        let snapFile = '', curId = -1;
        for (let file of files) {
            if (!file || !file.match) continue;
            let res = file.match(snapFileRegex);
            if (!res) continue;
            let id = parseInt(res[1], 10);
            if (id < curId) continue;
            id = curId;
            snapFile = file;
        }
        files = [snapFile, 'prop.json', 'allocTracing_0.json'];
        let promise = new Promise((resolve, reject) => {
            if (completeCnt >= files.length) {
                process.nextTick(resolve);
            } else {
                resolver = resolve;
            }
        });
        for (let file of files) {
            let destFile = file.indexOf('snap_') === 0 ? 'snap_1.json' : file;
            sourceFile = path.resolve(sourceDir, file);
            destFile = path.resolve(destDir, destFile);
            log(`\tcopying ${file}...`);
            // copy files
            fs.createReadStream(sourceFile, {encoding: 'ucs2'})
                .pipe(fs.createWriteStream(destFile), {encoding: 'utf8'})
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
            fs.readdir(dir, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    fs.unlinkSync(path.join(dir, file));
                }
                process.nextTick(resolve);
            });
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
            console.log(data.toString());
        });

        child.stderr.on('data', function (data) {
            console.log(data.toString());
        });
        let promise = new Promise((resolve, reject) => {
            child.addListener('error', reject);
            child.addListener('exit', resolve);
        });
        return promise;
    }
})();

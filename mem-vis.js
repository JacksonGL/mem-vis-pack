(function () {
    'use strict';
    let verbose = false;
    // require packages
    const fs = require('fs');
    const path = require('path');
    const spawn = require('child_process').spawn;
    const Promise = require('bluebird');
    const serve = require('serve');
    const cp = require('child_process');
    const binPath = getNodeBinaryPath();

    // create util functions
    const _consoleLog = console.log;
    const _console = console;
    const _slice = Array.prototype.slice;
    const log = function () {
        if (!verbose) return;
        try {
            _consoleLog.apply(_console, _slice.call(arguments, 0));
        } catch(ex) {
            console.log(ex);
        }
    };
    const handler = (err) => {
        if (!err) return;
        console.log('[!]: Something is wrong. Let me know (gongliang13@berkeley.edu). Thanks :)');
        console.log(err);
    };

    // parse arguments from console
    // generate parameters for invoking mem-vis in the console
    let recordOnly = true;
    let recordArgs, replayArgs;
    if (process.argv[2] === '-rr' || 
        process.argv[2] === '--record-and-replay') {
        recordOnly = false;
        process.argv.splice(2, 1);
    }
    let argv = process.argv.slice(2);
    const replayDir = path.resolve(__dirname, 'snapshot');
    const memVisDir = path.resolve(__dirname, 'mem-vis');
    const dataDir = path.resolve(memVisDir, 'data');
    if (recordOnly) {
        recordArgs = [`--record`, `--alloc-trace`, `${__dirname + '/scripts/ttd-loader.js'}`];
    } else {
        recordArgs = [`--record`, `${__dirname + '/scripts/ttd-loader.js'}`];
    }
    replayArgs = [`--alloc-trace`, `--replay=${replayDir}`, `${__dirname + '/scripts/ttd-loader.js'}`];
    recordArgs = recordArgs.concat(argv);
    replayArgs = replayArgs.concat(argv);
    
    // start invoking the shell command
    runMemVis();

    // business logic functions used by the main function
    /**
     * the main function of this auto-runner
     */
    function runMemVis() {
        if (recordOnly) {
            // record only
            cleanDir(replayDir)
            .then(cleanDir.bind(null, dataDir), handler)
            .then(showMsg.bind(null, '\n\n----------- START RECORDING ------------\n\n'))
            .then(executeAndPromisify.bind(null, binPath, recordArgs, '[i]: recording...'), handler)
            .then(copySnapshots.bind(null, replayDir, dataDir), handler)
            .then(openVisualization.bind(null), handler)
            .then(handler, handler);
        } else {
            // record and replay
            cleanDir(replayDir)
            .then(cleanDir.bind(null, dataDir), handler)
            .then(showMsg.bind(null, '\n\n----------- START RECORDING ------------\n\n'))
            .then(executeAndPromisify.bind(null, binPath, recordArgs, '[i]: recording...'), handler)
            .then(showMsg.bind(null, '\n\n----------- START REPLAYING ------------\n\n'))
            .then(executeAndPromisify.bind(null, binPath, replayArgs, '[i]: replaying...'), handler)
            .then(copySnapshots.bind(null, replayDir, dataDir), handler)
            .then(openVisualization.bind(null), handler)
            .then(handler, handler);
        }
    }

    function openVisualization() {
        serve(memVisDir, {
            port: 5000
        });
    }

    const snapFileRegex = /snap_(\d+)\.json/;

    /**
     * copy the snapshot files from a source dir to a destination dir
     * @param {string} sourceDir the dir from which the files are copied
     * @param {string} destDir the dir to which the files are copied
     */
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

    /**
     * return a promise that waits specified milliseconds 
     * and then calls the resolve callback
     * @param {number} time 
     */
    function wait(time) {
        let promise = new Promise((resolve, reject) => {
            setTimeout(resolve, time);
        });
        return promise;
    }

    /**
     * return a promise that shows a message
     * and then calls the resolve callback
     * @param {string} msg 
     */
    function showMsg(msg) {
        let promise = new Promise((resolve, reject) => {
            console.log(msg);
            process.nextTick(resolve);
        });
        return promise;
    }

    /**
     * return a promise that delete all files in
     * a specified dir and then calls the resolve callback
     * @param {string} dir 
     */
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
     * @param {*} cmd the main shell command
     * @param {*} args arguments to the shell command
     * @param {*} msg the message to display in the console
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

    /**
     * function that detects and returns the absolute path to the
     * node-chakracore binary with mem-vis implementation
     */
    function getNodeBinaryPath() {
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
        return binPath;
    }
})();

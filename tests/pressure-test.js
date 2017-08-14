'use strict';

var path = require('path');
var fsextra = require('fs-extra');
var process = require('process');
var nodeType = 'chakracore';
var heapdump;
if (nodeType === 'v8') {
    heapdump = require('heapdump');
}

let upperbound = 2000 * 20;
var memLimit = 10000000;
var memInc = 5000000;
function checkMem() {
    var cmem = process.memoryUsage().heapTotal;
    console.log(cmem + 'bytes');
    console.log(global.leakyData.length);
    if (global.leakyData.length >= upperbound) {
        var mlstring = memLimit / 1000000 + 'MB';
        console.log(
            'Total memory use exceeded current threshold -- ' + mlstring
        );

        if (global.emitTTDLog) {
            var leaklogdir = __dirname + '/../snapshot';
            fsextra.ensureDirSync(leaklogdir);
            console.log(leaklogdir);
            console.log('Writing leak report to -- ' + leaklogdir);

            global.emitTTDLog(leaklogdir);
            process.exit(0);
        }

        if (nodeType === 'v8') {
            const dir = path.resolve(
                __dirname,
                '..',
                'snapshot'
            );
            heapdump.writeSnapshot(dir + '/' + Date.now() + '.heapsnapshot');
            process.exit(0);
        }

        memLimit += memInc;
    }
}

global.leakyData = [];

class SimpleClass {
    constructor(text) {
        this.text = text;
    }
}

function getAndStoreRandomData() {
    console.log('adding data ' + global.leakyData.length);
    if (global.leakyData.length > upperbound) checkMem();
    for (let j = 0; j < 10; j++) {
        let obj = {};
        for (let i = 0; i < 10; i++) {
            let prop = i;
            obj[prop] = Math.random();
        }
        global.leakyData.push(obj);
    }
    console.log('add complete');
}

function fooPush(data) {
    var object = new SimpleClass(data);
    leakyData.push(object);

    return object;
}

function generateHeapDumpAndStats() {
    process.exit(1);
}

// Kick off the program
setInterval(getAndStoreRandomData, 5); //Add random data every 5 milliseconds
// setInterval(generateHeapDumpAndStats, 1000 * 60); //Do garbage collection and heap dump every 2 seconds

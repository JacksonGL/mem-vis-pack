ttdLogURI = __dirname + '/../snapshot';

require(__dirname + '/leak-example.js');

if (global.emitTTDLog) {
    emitTTDLog(ttdLogURI);
}

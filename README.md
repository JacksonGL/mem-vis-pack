# Mem-vis

A tool that takes a memory snapshot from [node-chakracore](https://github.com/nodejs/node-chakracore) and visualizes the memory data.

For a quick preview, watch [this video](https://www.youtube.com/watch?v=BmaIobIFl54) or [try mem-vis in a docker container](doc/docker.md).

**Requirement**: the binaries in this repo assume a **x64 Windows 10**, **Ubuntu 14.04+**, or **OSX 10.11+**.

## Setup
Install [NVS](https://github.com/jasongin/nvs) and run the following script:

### Mac, Linux

```
git clone https://github.com/JacksonGL/mem-vis-pack.git; cd mem-vis-pack; ./scripts/mem-vis-setup.sh; nvs use mem-vis/8.0.0
```

The `mem-vis-setup.sh` downloads node-chakracore (with memory snapshot ability) via NVS and install the node binary side-by-side with the existing node distribution. The scripts also does git clone and installs this repo. You can also [install it manually](doc/install-manually.md).

### Windows

See the [instructions here](doc/install-manually.md).

## Usage

The base dir of the following shell commands is the root dir of this repo.

  **1.** In the JavaScript code, add the following statements to dump memory snapshot:

```javascript
if (global.emitTTDLog) {
    // please make sure <MEM-VIS-DIR> points to the root dir of this repo
    let snapshotDir = '<MEM-VIS-DIR>/snapshot';
    console.log('Dumping snapshot to -- ' + snapshotDir);
    global.emitTTDLog(snapshotDir);
}
```

  **2.** run TTD and get snapshots

```
node ./mem-vis.js <NODE-APP> <APP-ARGS>
```

Example:

```
node ./mem-vis.js ./tests/crypto.js
```
  
  **3.** open [http://localhost:5000](http://localhost:5000)

**Notice**: Async functions and generators are not supported by the Time Travel Debugging yet.

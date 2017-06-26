# Mem-vis

This repo contains a prototype that takes a memory snapshot from node-chakra and visualizes the memory data.

**Requirement**: the binaries in this repo assume a **x64 Windows 10**.

# Install

```
git clone https://github.com/JacksonGL/mem-vis-pack.git
cd mem-vis-pack
npm install
```

# Usage

The base dir of the following shell commands is the root dir of this repo.

## Dump Memory Snapshot

  **1.** In the JavaScript code, add the following statements to dump memory snapshot:

```javascript
if (global.emitTTDLog) {
    // please make sure <MEM-VIS-DIR> points to the root dir of this repo
    let snapshotDir = '<MEM-VIS-DIR>/snapshot';
    console.log('Dumping snapshot to -- ' + snapshotDir);
    global.emitTTDLog(snapshotDir);
}
```

  **2.** record, replay, and get snapshots

```
node .\mem-vis.js <NODE-APP> <APP-ARGS>
```

Example:

```
node .\mem-vis.js .\tests\crypto.js
```
  
  **3.** open [http://localhost:5000](http://localhost:5000)


# Development

To set up the development environment of this tool, see [here](https://github.com/JacksonGL/memo-vis).

**Notice**: generator is not handled by the Time Travel Debugging yet.
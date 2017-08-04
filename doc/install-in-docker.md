## Install Mem-vis in Docker

First, start a docker container based on an Ubuntu image. For example:
```bash
docker pull ubuntu
docker run -it -p 5000:5000 ubuntu /bin/bash
```

Copy and paste the commands below into the container's terminal:
```bash
export NVS_HOME="$HOME/.nvs" && \
apt-get update && \
apt-get --assume-yes install curl tar xz-utils && \
curl -O https://raw.githubusercontent.com/JacksonGL/mem-vis-pack/master/bin/linux/debian-pkg.deb && \
dpkg -i debian-pkg.deb && \
source "$HOME/.nvs/nvs.sh" && \
nvs use mem-vis/8.0.0 && \
cd /var/lib/mem-vis-pack/ && \
npm install
```

### Quick Check

```bash
node /var/lib/mem-vis-pack/mem-vis.js /var/lib/mem-vis-pack/tests/crypto.js
```

Then, visit [http://localhost:5000](http://localhost:5000) on the host machine.

## Use Mem-vis in Docker

  **1.** In your node app, add the code below to grab a snapshot:

```javascript
if (global.emitTTDLog) {
    let snapshotDir = '/var/lib/mem-vis-pack/snapshot';
    console.log('Dumping snapshot to -- ' + snapshotDir);
    global.emitTTDLog(snapshotDir);
}
```

  **2.** run your node.js app:

```
node /var/lib/mem-vis-pack/mem-vis.js <your-node-app.js> <your-app-args>
```
  
  **3.** visit [http://localhost:5000](http://localhost:5000) on the host machine.

## Install Mem-vis in Docker

First, start a docker container based on an Ubuntu image. For example:
```bash
docker pull ubuntu
docker run -it -p 5000:5000 ubuntu /bin/bash
```

Copy and paste the commands below into the container's terminal:
```shell
if ! which sudo > /dev/null; then SUDO=""; else SUDO="sudo"; fi && \
MV_USER=`whoami` && export NVS_HOME="${HOME}/.nvs" && \
${SUDO} apt-get update && \
${SUDO} apt-get --assume-yes install curl tar xz-utils && \
curl -O https://raw.githubusercontent.com/JacksonGL/mem-vis-pack/master/bin/linux/debian-pkg.deb && \
${SUDO} dpkg -i debian-pkg.deb && \
${SUDO} chown -R ${MV_USER} ${HOME}/.nvs && \
${SUDO} chown -R ${MV_USER} /var/lib/mem-vis-pack && \
source "${HOME}/.nvs/nvs.sh" && \
nvs add node/7.9.0 && nvs use node/7.9.0 && \
cd /var/lib/mem-vis-pack/ && npm install && \
nvs add mem-vis/9.0.0 && nvs use mem-vis/9.0.0
```

### Quick Check

```shell
node /var/lib/mem-vis-pack/mem-vis.js /var/lib/mem-vis-pack/tests/crypto.js
```

Then, visit [http://localhost:5000](http://localhost:5000) on the host machine.

## Use Mem-vis in Docker

<!--
  **1.** Make sure the main file is wrapped as follows. E.g., ```app.js``` is the main file if you run ```node app.js```.

```javascript
setTimeout(() => {}, 0);
setTimeout(() => {
	// content of main file
}, 10);
```
-->

  **1.** In your node app, add the code below to grab a snapshot:

```javascript
if (global.emitTTDLog) {
    global.emitTTDLog('/var/lib/mem-vis-pack/snapshot');
}
```

  **2.** run your node.js app:

```shell
node /var/lib/mem-vis-pack/mem-vis.js <your-node-app.js> <your-app-args>
```
  
  **3.** visit [http://localhost:5000](http://localhost:5000) on the host machine.

**Notice:** If an object in the heap is keep alive only by stack trace frames, it won’t be captured in the heap snapshot right now.

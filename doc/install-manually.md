# Install Manually

Please install [NVS](https://github.com/jasongin/nvs) first.

## Install Node-Chakracore via NVS

To install the node-chakracore side-by-side with you existing node, we recommend using [nvs](https://github.com/jasongin/nvs)

```
nvs remote mem-vis https://raw.githubusercontent.com/JacksonGL/node-chakracore/AllocTracing/releases
nvs add mem-vis/8.0.0
```

Remember to swtich to the modified node-chakracore when opening a new terminal:
```
nvs use mem-vis/8.0.0
```


## Install Mem-vis Tool

To install the memory visualization tool, use the following commands:

```
git clone https://github.com/JacksonGL/mem-vis-pack.git
cd mem-vis-pack
npm install
```

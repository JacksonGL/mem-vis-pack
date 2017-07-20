#!/bin/bash

# install node-chakracore via nvs
export NVS_HOME="$HOME/.nvs"
. "$NVS_HOME/nvs.sh" install

nvs remote mem-vis https://raw.githubusercontent.com/JacksonGL/node-chakracore/AllocTracing/releases

nvs add mem-vis/8.0.0
# nvs use mem-vis/8.0.0

# install the mem-vis-tool
# git clone https://github.com/JacksonGL/mem-vis-pack.git
# cd mem-vis-pack
npm install

#!/bin/bash

# install node-chakracore via nvs
export NVS_HOME="$HOME/.nvs"
. "$NVS_HOME/nvs.sh" install

nvs remote mem-vis https://raw.githubusercontent.com/JacksonGL/node-chakracore/AllocTracing/releases
nvs add mem-vis/9.0.0

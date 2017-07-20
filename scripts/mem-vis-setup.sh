#!/bin/bash

# install node-chakracore via nvs
nvs remote mem-analysis https://raw.githubusercontent.com/JacksonGL/node-chakracore/AllocTracing/releases
nvs use mem-analysis

# install the mem-vis-tool
git clone https://github.com/JacksonGL/mem-vis-pack.git
cd mem-vis-pack
npm install
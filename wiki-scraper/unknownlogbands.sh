#!/bin/bash

cat ~/.pm2/logs/music-site-out-0.log | grep -B 1 '\[\]' | awk '/^[a-zA-Z][a-zA-Z ]*$/{print $0 }' 

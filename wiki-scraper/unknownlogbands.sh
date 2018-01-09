#!/bin/bash

cat ~/.pm2/logs/music-site-out-0.log | grep -B 1 '\[\]' | awk '/^[a-zA-Z][0-9a-zA-Z() ]*$/{print $0 }' 

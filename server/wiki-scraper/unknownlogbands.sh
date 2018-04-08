#!/bin/bash
LOGSDIR="$HOME/.pm2/logs/"
cat $LOGSDIR$(ls -lt $LOGSDIR | awk '{print $9}' | grep music | head -n 1 ) | grep -B 1 '\[\]' | awk '/^[a-zA-Z][0-9a-zA-Z() ]*$/{print $0 }' 

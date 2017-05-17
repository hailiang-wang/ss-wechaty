#! /bin/bash 
###########################################
# Start Docker Container
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
rootDir=$(cd $baseDir/..;pwd)
containerName=ss-wechaty
imageName=samurais/ss-wechaty
# WECHATY_LOG: silly|verbose|info|warn|error|silent
WECHATY_LOG='info'

# functions
function printUsage(){
    echo "Usage:"
    echo "$0 -d # This would run the docker in detached mode."
    echo "$0 -t # This would run the docker in not-attached mode."
}

function main() {
  cd $rootDir
  docker run \
    $* \
    -e WECHATY_LOG="$WECHATY_LOG" \
    -e DEBUG=ss-wechaty \
    -e LOGIC_SERVER_URL=http://192.168.2.234:3001 \
    --name=$containerName \
    $imageName:latest
}

# main
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
if [ "$#" -eq  "0" ]
then
    printUsage
elif [ "$*" = "-t" ]
then
    main -t -i --rm
elif [ "$*" = "-d" ]
then
    main -d
else
    printUsage
fi
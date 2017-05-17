#! /bin/bash 
###########################################
#
###########################################
imageName=samurais/ss-wechaty

# constants
baseDir=$(cd `dirname "$0"`;pwd)
# functions



# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $baseDir/..

# Version key/value should be on his own line
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' | xargs)

docker build --tag $imageName:$PACKAGE_VERSION --force-rm .
docker tag $imageName:$PACKAGE_VERSION $imageName:latest

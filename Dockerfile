FROM zixia/wechaty:latest
MAINTAINER Hai Liang Wang <hailiang.hl.wang@gmail.com>

COPY . /bot
WORKDIR /bot

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["PATH=$PATH:/wechaty/bin:/wechaty/node_modules/.bin; node app.js"]
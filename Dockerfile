FROM node:lts-alpine
RUN apk update && apk add --virtual build-dependencies build-base gcc wget git restic

ARG appDir=/usr/src/app
RUN mkdir -p ${appDir}
ADD . ${appDir}
WORKDIR ${appDir}

RUN yarn --pure-lockfile

EXPOSE 3000

CMD yarn start
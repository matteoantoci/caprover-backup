FROM node:lts-alpine
RUN apk update && apk add --virtual build-dependencies build-base gcc wget git restic

RUN yarn --pure-lockfile

ARG appDir=/usr/src/app
RUN mkdir -p ${appDir}
ADD . ${appDir}
WORKDIR ${appDir}

RUN yarn --pure-lockfile --prod

CMD yarn start
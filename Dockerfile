FROM node:lts-alpine
RUN apk update && apk add --virtual build-dependencies build-base gcc wget git restic

ARG appDir=/usr/src/app
RUN mkdir -p ${appDir}
WORKDIR ${appDir}

ADD package.json ${appDir}
ADD yarn.lock ${appDir}
RUN yarn --pure-lockfile --prod

ADD ./src ${appDir}/src

CMD yarn start
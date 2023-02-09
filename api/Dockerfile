FROM node:19.6.0-bullseye

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# COPY --chown=node:node ./package*.json ./
COPY ./package*.json ./

RUN npm install

CMD ["node", "index"]

EXPOSE 3000
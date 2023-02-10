FROM node:19.6.0-bullseye

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# COPY --chown=node:node ./package*.json ./

COPY ./package*.json ./

RUN npm install nodemon -g
RUN npm install

CMD ["npm", "run", "start:dev"]

EXPOSE 3000
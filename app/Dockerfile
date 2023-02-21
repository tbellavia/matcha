FROM node:19.6.0-bullseye

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./package*.json ./

RUN npm install

CMD ["npm", "start"]

EXPOSE 8000
FROM node:16-alpine As development

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3333

CMD [ "npm", "run", "start:dev" ]
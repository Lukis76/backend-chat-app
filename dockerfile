FROM node:18-alpine

WORKDIR /back

COPY package*.json ./

RUN npm i
# or instalacion ligera
# RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]
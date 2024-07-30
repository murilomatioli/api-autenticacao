FROM node:latest

WORKDIR /src

COPY package.json ./

RUN npm install

COPY ./src ./src

EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]

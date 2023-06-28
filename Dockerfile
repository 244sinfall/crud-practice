FROM node
# создание директории приложения
WORKDIR /usr/src/app
# установка зависимостей
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

#Запустить установку node_modules из package.json
RUN npm install
#Скопировать остальной код
COPY . .

CMD [ "npx", "ts-node", "index.ts" ]
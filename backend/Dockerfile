# 1. Базовый образ Node.js
FROM node:20-alpine

# 2. Устанавливаем рабочую папку внутри контейнера
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь код проекта
COPY . .

# 6. Открываем порт, на котором будет работать backend
EXPOSE 3000

# 7. Команда для запуска
CMD ["npm", "run", "dev"]

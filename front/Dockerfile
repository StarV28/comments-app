# Node 20 + amd64 для совместимости с нативными пакетами
FROM --platform=linux/amd64 node:20-bullseye

WORKDIR /app

# Копируем package.json + package-lock.json
COPY package*.json ./

# Чистая установка зависимостей
RUN npm install --legacy-peer-deps

# Копируем весь код проекта
COPY . .

# Сборка Nuxt
RUN npm run build

# Экспонируем порт Nuxt preview
EXPOSE 3000

CMD ["npm", "run", "preview"]

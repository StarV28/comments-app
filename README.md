
# Comments App

## Описание проекта
`Comments App` — это одностраничное приложение (SPA) для управления комментариями.  
Проект создан с использованием **Nuxt 3** на фронтенде и **Express + Prisma + MySQL** на бэкенде.  
Аутентификация пользователей реализована через **JWT**, поддерживается локальный запуск через **Docker**.

Цель проекта — показать навыки работы с современным стеком, базами данных и авторизацией.

---

## Основные функции
- Регистрация и вход пользователей (JWT).  
- Создание, редактирование и удаление комментариев.  
- Просмотр списка комментариев с пагинацией.  
- Валидация данных на сервере.  
- Лёгкое развёртывание с Docker.

---

## Структура проекта
comments-app/
├─ backend/ # Express + Prisma, REST API
├─ frontend/ # Nuxt 3 SPA
├─ prisma/ # Схема базы данных Prisma
├─ docker/ # Dockerfile и docker-compose
└─ .env.example # Пример переменных окружения

---

## Технологии
- **Frontend:** Nuxt 3, Composition API, Pinia, Axios  
- **Backend:** Node.js, Express, Prisma, MySQL  
- **Аутентификация:** JWT  
- **Docker:** для контейнеризации и лёгкого запуска  
- **Прочее:** dotenv для переменных окружения

---

## Установка и запуск

# Клонируем репозиторий и переходим в него
git clone https://github.com/StarV28/comments-app.git
cd comments-app

# Настройка переменных окружения
cp .env.example .env

# Поднимаем все сервисы через Docker (MySQL, Backend, Frontend)
docker compose up -d

# Проверка работы контейнеров
docker compose ps

# Логи backend (в отдельной вкладке терминала, если нужно смотреть)
docker compose logs -f backend

# Логи frontend
docker compose logs -f frontend

# Применяем миграции Prisma (один раз, если база новая)
docker compose exec backend npx prisma migrate dev --name init

# После этого фронтенд доступен по http://localhost:3001, бэкенд по http://localhost:3000/api

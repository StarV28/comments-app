-- Создание базы данных
CREATE DATABASE IF NOT EXISTS commentsdb;
USE commentsdb;

-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица комментариев
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_created_at (created_at),
    INDEX idx_parent_id (parent_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица файлов, привязанных к комментариям
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('image', 'txt') NOT NULL,
    path VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    width INT NULL,
    height INT NULL,
    comment_id INT NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_comment_id (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

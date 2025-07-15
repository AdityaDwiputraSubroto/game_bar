CREATE DATABASE IF NOT EXISTS `game_bar`;
USE `game_bar`;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `refresh_token` TEXT,
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `games` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `profile_image_url` TEXT,
  `developer` VARCHAR(255),
  `publisher` VARCHAR(255),
  `cumulative_rating` FLOAT DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `genres` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
);

CREATE TABLE `game_genres` (
  `game_id` INT NOT NULL,
  `genre_id` INT NOT NULL,
  PRIMARY KEY (`game_id`, `genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `fk_game_genre_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_game_genre_genre` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
);

CREATE TABLE `game_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `game_id` INT NOT NULL,
  `image_url` TEXT NOT NULL,
  `public_id` VARCHAR(255),
  PRIMARY KEY (`id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `fk_game_image_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
);

CREATE TABLE `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_game` (`user_id`, `game_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
);

CREATE TABLE `review_replies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `review_id` INT,
  `user_id` INT,
  `text` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `review_id` (`review_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_reply_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`),
  CONSTRAINT `fk_reply_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `review_likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT,
  `review_id` INT,
  `is_like` TINYINT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_review` (`user_id`, `review_id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_like_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`)
);

CREATE TABLE `reply_likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT,
  `reply_id` INT,
  `is_like` TINYINT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_reply` (`user_id`, `reply_id`),
  KEY `reply_id` (`reply_id`),
  CONSTRAINT `fk_reply_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_reply_like_reply` FOREIGN KEY (`reply_id`) REFERENCES `review_replies` (`id`)
);

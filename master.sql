CREATE DATABASE `twitch`;

CREATE TABLE `twitch`.`messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `channel` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `content` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE USER 'twitch'@'%' IDENTIFIED BY 'twitch';
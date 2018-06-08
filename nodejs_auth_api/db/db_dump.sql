/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных cluck
CREATE DATABASE IF NOT EXISTS `cluck` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `cluck`;

-- Дамп структуры для таблица cluck.answers
CREATE TABLE IF NOT EXISTS `answers` (
  `id` int(11) unsigned NOT NULL,
  `question_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `answer_body` varchar(3000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.answers: ~0 rows (приблизительно)
DELETE FROM `answers`;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.answer_votes
CREATE TABLE IF NOT EXISTS `answer_votes` (
  `answer_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `vote` enum('Y','N') DEFAULT NULL,
  PRIMARY KEY (`answer_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.answer_votes: ~0 rows (приблизительно)
DELETE FROM `answer_votes`;
/*!40000 ALTER TABLE `answer_votes` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer_votes` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.categories: ~0 rows (приблизительно)
DELETE FROM `categories`;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.questions
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `subject` varchar(300) NOT NULL,
  `question_body` varchar(3000) NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  `views` int(11) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.questions: ~0 rows (приблизительно)
DELETE FROM `questions`;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.question_tags
CREATE TABLE IF NOT EXISTS `question_tags` (
  `question_id` int(11) unsigned NOT NULL,
  `tag_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`question_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.question_tags: ~0 rows (приблизительно)
DELETE FROM `question_tags`;
/*!40000 ALTER TABLE `question_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `question_tags` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.question_votes
CREATE TABLE IF NOT EXISTS `question_votes` (
  `question_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `vote` enum('Y','N') DEFAULT NULL,
  PRIMARY KEY (`question_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.question_votes: ~0 rows (приблизительно)
DELETE FROM `question_votes`;
/*!40000 ALTER TABLE `question_votes` DISABLE KEYS */;
/*!40000 ALTER TABLE `question_votes` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tag_name` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы cluck.tags: ~0 rows (приблизительно)
DELETE FROM `tags`;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;

-- Дамп структуры для таблица cluck.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `acc_action_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `status` enum('New','Active','Disabled','Reseting') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Дамп данных таблицы cluck.users: ~2 rows (приблизительно)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `login`, `email`, `name`, `surname`, `password_hash`, `access_token`, `acc_action_token`, `refresh_token`, `status`, `created_at`) VALUES
	(1, 'admin', 'admin@cluck.org', 'name', 'surname', '186321644b268237b73adea405bb9100d2e08e95177d3d5d2db3677637332a3c', NULL, NULL, NULL, NULL, '2018-06-04 15:39:29'),
	(2, 'user', 'user@cluck.org', 'user', 'lastname', '186321644b268237b73adea405bb9100d2e08e95177d3d5d2db3677637332a3c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0ZSI6ImM3ZWZjMGNlYTljMGNmMWVmYzVlOWZiNGMzNTU2NmQwODVkZGRjOTc3MzM5MDZjZTZmNDI0NmUyYzQ1NTBiMjMiLCJpYXQiOjE1MjgzODg3NzQsIm5iZiI6MTUyODM4ODc3NSwiZXhwIjoxNTI4MzkwNTc0LCJhdWQiOiJDbHVjayBjbGllbnQgYXBwbGljYXRpb24iLCJpc3', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0ZSI6ImM3ZWZjMGNlYTljMGNmMWVmYzVlOWZiNGMzNTU2NmQwODVkZGRjOTc3MzM5MDZjZTZmNDI0NmUyYzQ1NTBiMjMiLCJpYXQiOjE1MjgzODg3NzQsIm5iZiI6MTUyODM4ODc3NSwiZXhwIjoxNTI4MzkwNTc0LCJhdWQiOiJDbHVjayBjbGllbnQgYXBwbGljYXRpb24iLCJpc3', NULL, '2018-06-04 15:39:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

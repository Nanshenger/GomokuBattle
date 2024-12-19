-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: gomoku_db
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` varchar(500) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_moves`
--

DROP TABLE IF EXISTS `game_moves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_moves` (
  `move_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `player_id` int NOT NULL,
  `x` tinyint NOT NULL,
  `y` tinyint NOT NULL,
  `move_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`move_id`),
  KEY `match_id` (`match_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `game_moves_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`),
  CONSTRAINT `game_moves_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_moves`
--

LOCK TABLES `game_moves` WRITE;
/*!40000 ALTER TABLE `game_moves` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_moves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `player_1_id` int NOT NULL,
  `player_2_id` int NOT NULL,
  `winner_id` int DEFAULT NULL,
  `start_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`match_id`),
  KEY `room_id` (`room_id`),
  KEY `player_1_id` (`player_1_id`),
  KEY `player_2_id` (`player_2_id`),
  KEY `winner_id` (`winner_id`),
  CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`player_1_id`) REFERENCES `users` (`userid`),
  CONSTRAINT `matches_ibfk_3` FOREIGN KEY (`player_2_id`) REFERENCES `users` (`userid`),
  CONSTRAINT `matches_ibfk_4` FOREIGN KEY (`winner_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `host_user_id` int NOT NULL,
  `room_status` enum('waiting','playing','finished') DEFAULT 'waiting',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `player_count` int DEFAULT '0',
  PRIMARY KEY (`room_id`),
  KEY `host_user_id` (`host_user_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`host_user_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (23,3,'waiting','2024-12-19 17:24:37',0);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `sex` enum('male','female','unknown') DEFAULT 'unknown',
  `games_played` int unsigned DEFAULT '0',
  `games_won` int unsigned DEFAULT '0',
  `coins` int unsigned DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  `permission_level` tinyint DEFAULT '1',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Anders','123456','2584036741@qq.com','Anders','male',0,0,0,'2024-12-16 22:25:56',NULL,3),(2,'1','1','1@qq.com','1','male',0,0,0,'2024-12-16 22:38:31',NULL,3),(3,'2','2','1234567890@qq.com','2','unknown',0,0,0,'2024-12-17 19:37:25',NULL,1),(4,'3','3','1234567890@qq.com','3','unknown',0,0,0,'2024-12-19 13:44:43',NULL,1),(5,'555','555','1234567890@qq.com','555','unknown',0,0,0,'2024-12-19 15:30:41',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19 17:27:41

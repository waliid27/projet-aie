-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 03, 2026 at 11:34 PM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

CREATE DATABASE IF NOT EXISTS `pdf_app1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `pdf_app1`;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pdf_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Informatique', 'Documents liés à l’informatique', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(2, 'Marketing', 'Documents sur le marketing', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(3, 'Finance', 'Documents financiers', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(4, 'Education', 'Supports éducatifs', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(5, 'Développement Web', 'Cours et ressources web', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(6, 'Intelligence Artificielle', 'Machine learning et IA', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(7, 'Data Science', 'Analyse de données et statistiques', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(8, 'Business', 'Stratégie et gestion d’entreprise', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(9, 'Entrepreneuriat', 'Création de startups', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(10, 'Design', 'UI/UX et design graphique', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(11, 'Réseaux', 'Réseaux informatiques et sécurité', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(12, 'Cybersécurité', 'Protection des systèmes et données', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(13, 'Programmation', 'Langages et développement logiciel', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(14, 'Mobile', 'Développement d’applications mobiles', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(15, 'Cloud Computing', 'Services cloud et DevOps', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(16, 'DevOps', 'Intégration et déploiement continu', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(17, 'Management', 'Gestion d’équipes et projets', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(18, 'Comptabilité', 'Gestion comptable et fiscale', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(19, 'Economie', 'Théories et analyses économiques', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(20, 'Droit', 'Documents juridiques', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(21, 'Santé', 'Médecine et bien-être', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(22, 'Langues', 'Apprentissage des langues', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(23, 'Littérature', 'Romans et œuvres littéraires', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(24, 'Sciences', 'Physique, chimie, biologie', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(25, 'Mathématiques', 'Cours et exercices de maths', '2026-04-27 20:55:21.249855', '2026-04-27 20:55:21.249855'),
(26, 'Mode', 'Nouvelle mode', '2026-05-04 00:01:28.356365', '2026-05-04 00:01:28.356365');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `content` text NOT NULL,
  `rating` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  `documentId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content`, `rating`, `created_at`, `updated_at`, `userId`, `documentId`) VALUES
(1, 'ttinaaaa', 5, '2026-04-27 20:28:43.199832', '2026-04-27 20:28:43.199832', 1, 1),
(2, 'd winaa', 5, '2026-05-04 00:20:56.794041', '2026-05-04 00:20:56.794041', 4, 4),
(3, 'hh', 5, '2026-05-04 00:21:14.067742', '2026-05-04 00:21:14.067742', 4, 4);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text,
  `file_path` varchar(255) NOT NULL,
  `original_file_name` varchar(255) NOT NULL,
  `mime_type` varchar(255) NOT NULL DEFAULT 'application/pdf',
  `size` bigint NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_free` tinyint NOT NULL DEFAULT '1',
  `status` enum('active','hidden','deleted') NOT NULL DEFAULT 'active',
  `view_count` int NOT NULL DEFAULT '0',
  `download_count` int NOT NULL DEFAULT '0',
  `rating_count` int NOT NULL DEFAULT '0',
  `average_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `ownerId` int NOT NULL,
  `categoryId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `description`, `file_path`, `original_file_name`, `mime_type`, `size`, `price`, `is_free`, `status`, `view_count`, `download_count`, `rating_count`, `average_rating`, `created_at`, `updated_at`, `ownerId`, `categoryId`) VALUES
(1, 'chapitre2', 'chapitre 2 ml', 'src/uploads/pdfs/1777314295812-chapitre-2.pdf', 'chapitre_2.pdf', 'application/pdf', 730853, 0.00, 1, 'active', 2, 2, 1, 5.00, '2026-04-27 20:24:55.914090', '2026-04-27 20:57:56.000000', 1, NULL),
(2, 'chapitre1', 'chapitre1', 'src/uploads/pdfs/1777316339427-chapitre1-1.pdf', 'chapitre1_1.pdf', 'application/pdf', 1913461, 30.00, 0, 'active', 0, 2, 0, 0.00, '2026-04-27 20:58:59.528335', '2026-05-03 23:32:44.000000', 1, 6),
(3, 'TP 5', 'Tp5', 'src/uploads/pdfs/1777844128174-tp5-m1gl.pdf', 'TP5_M1GL.pdf', 'application/pdf', 310667, 300.00, 0, 'active', 1, 0, 0, 0.00, '2026-05-03 23:35:28.253745', '2026-05-04 00:14:29.000000', 3, 7),
(4, 'thl', 'thlllll', 'src/uploads/pdfs/1777846733848-cours-thl-pour-etidiant-chapitre-4-partie-1-les-automates-tats-finis-2.pdf', 'Cours THL- Pour Etidiant-chapitre 4 Partie 1-Les Automates Ã  Ãtats Finis 2.pdf', 'application/pdf', 970517, 0.00, 1, 'active', 1, 1, 2, 5.00, '2026-05-04 00:18:54.034745', '2026-05-04 00:17:21.000000', 4, 1),
(5, 'AGL', 'Cours AGL', 'src/uploads/pdfs/1777849375037-chapitre-4-agl.pdf', 'Chapitre 4 AGL.pdf', 'application/pdf', 1125674, 90.00, 0, 'active', 1, 0, 0, 0.00, '2026-05-04 00:02:55.056700', '2026-05-04 00:32:30.000000', 5, 26);

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  `documentId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  `provider` varchar(255) NOT NULL DEFAULT 'manual',
  `reference` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  `documentId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `amount`, `status`, `provider`, `reference`, `created_at`, `updated_at`, `userId`, `documentId`) VALUES
(1, 30.00, 'success', 'simple-front', 'PAY-1777843961395-72230', '2026-05-03 23:32:41.406814', '2026-05-03 23:32:41.406814', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  `documentId` int NOT NULL,
  `paymentId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `created_at`, `userId`, `documentId`, `paymentId`) VALUES
(1, '2026-05-03 23:32:41.430930', 3, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL DEFAULT '',
  `phone` varchar(30) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(160) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `is_active` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `phone`, `date_of_birth`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ibaroudine', 'walid', NULL, NULL, 'walidibaroudine1@gmail.com', '$2a$10$zJSS/Z/LyWz5ZL6yPDY/KuczA8J8geZakbb/A2ND6trF3ME8K79Mm', 'user', 1, '2026-04-27 20:22:46.871205', '2026-05-04 00:22:14.009308'),
(2, 'admin', '', NULL, NULL, 'admin@gmail.com', '$2a$10$ZXGKpIZ6OPZURRI3ij.LCeGv/ACJd7xB5Y/sm5vgkgzxhLvu.caMq', 'admin', 1, '2026-04-27 20:46:20.862830', '2026-05-04 00:22:14.009308'),
(3, 'Raouf', 'Mahdi', NULL, NULL, 'raoufdz222@gmail.com', '$2a$10$X/ZOA5xL2I4WB/.vW.WXc.Fnadxay3f29KgcmUfjuqUksBsuHLphy', 'user', 1, '2026-05-03 23:32:29.019387', '2026-05-04 00:22:14.009308'),
(4, 'hehe', '', NULL, NULL, 'hehe@glmai.com', '$2a$10$wfatIVpyCek/gk9oxP/mmOAHNH5ijP5RFCt6eOJOiyDcBi2rYrs2u', 'user', 1, '2026-05-03 23:44:39.992119', '2026-05-04 00:22:14.009308'),
(5, 'admin', '', NULL, NULL, 'admin@example.com', '$2a$10$SraHertJAEggDFMQEj1/ve4JnsF5swZvYW4Azw/S7cjD6q1MyVHEW', 'admin', 1, '2026-05-04 00:00:17.862173', '2026-05-04 00:22:14.009308'),
(6, 'Hamid', 'Saidani', '071234567', '2026-05-06', 'hamid@gmail.com', '$2a$10$.ZpWGRZlD9hO3oLRqy9zy.pYpiFHGxR4jHiaauBG2SO67PWCxx9G2', 'user', 1, '2026-05-04 00:26:38.496790', '2026-05-04 00:32:15.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_8b0be371d28245da6e4f4b6187` (`name`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7e8d7c49f218ebb14314fdb3749` (`userId`),
  ADD KEY `FK_aa715016eed08ad03a184c1ad2e` (`documentId`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_4106f2a9b30c9ff2f717894a970` (`ownerId`),
  ADD KEY `FK_2d7e06f29424dbb29a827a7c1b5` (`categoryId`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_595378b43027fc104ef2235588` (`userId`,`documentId`),
  ADD KEY `FK_7510c064b16a09c2f84463867f5` (`documentId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d35cb3c13a18e1ea1705b2817b1` (`userId`),
  ADD KEY `FK_86b279ae02beb897abddf8514c1` (`documentId`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_33087b73dda2e79895e99c7221` (`userId`,`documentId`),
  ADD UNIQUE KEY `REL_35280601a9e3f54cb4b1e483bf` (`paymentId`),
  ADD KEY `FK_481a57c82181dd5adcde4448808` (`documentId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK_7e8d7c49f218ebb14314fdb3749` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_aa715016eed08ad03a184c1ad2e` FOREIGN KEY (`documentId`) REFERENCES `documents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `FK_2d7e06f29424dbb29a827a7c1b5` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_4106f2a9b30c9ff2f717894a970` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `FK_7510c064b16a09c2f84463867f5` FOREIGN KEY (`documentId`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_e747534006c6e3c2f09939da60f` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_86b279ae02beb897abddf8514c1` FOREIGN KEY (`documentId`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_d35cb3c13a18e1ea1705b2817b1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `FK_341f0dbe584866284359f30f3da` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_35280601a9e3f54cb4b1e483bfa` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_481a57c82181dd5adcde4448808` FOREIGN KEY (`documentId`) REFERENCES `documents` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

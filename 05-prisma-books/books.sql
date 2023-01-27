-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 27, 2023 at 12:55 PM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `books`
--

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

CREATE TABLE `author` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `author`
--

INSERT INTO `author` (`id`, `name`, `birthdate`) VALUES
(1, 'J. K. Rowling', NULL),
(2, 'George R. R. Martin', NULL),
(3, 'J. R. R. Tolkien', NULL),
(5, 'Krise', '1999-07-18'),
(6, 'Krise', '1999-07-18');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pages` int(10) UNSIGNED NOT NULL,
  `isbn` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publisherId` int(10) UNSIGNED NOT NULL,
  `cover` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `title`, `pages`, `isbn`, `publisherId`, `cover`) VALUES
(4, 'A Game of Thrones', 694, NULL, 1, 'null'),
(5, 'A Storm of Swords', 973, NULL, 1, 'null'),
(6, 'A Clash of Kings', 928, NULL, 2, 'null'),
(7, 'A Feast for Crows', 753, NULL, 2, 'null'),
(8, 'A Dance with Dragons', 1040, NULL, 2, 'null'),
(10, 'A Dance with Dragons 2', 10, NULL, 1, 'null'),
(11, 'Krise\'s Biography', 1337, NULL, 3, 'null'),
(12, 'Krise\'s Biography', 1337, NULL, 3, '{\"thumbnail\": \"https://kbimages1-a.akamaihd.net/a2f113a7-b3d0-49a2-a10f-98728432d55d/1200/1200/False/a-game-of-thrones-a-song-of-ice-and-fire-book-1-1.jpg\", \"largeCover\": \"https://www.norli.no/media/catalog/product/9/7/9780006479888_1.jpg?auto=webp&format=pjpg&width=728&height=910&fit=cover\"}'),
(13, 'Spelet om Tronen', 1337, NULL, 3, '{}'),
(14, 'Spelet om Tronen', 1337, NULL, 3, '{\"thumbnail\": \"https://kbimages1-a.akamaihd.net/a2f113a7-b3d0-49a2-a10f-98728432d55d/1200/1200/False/a-game-of-thrones-a-song-of-ice-and-fire-book-1-1.jpg\", \"largeCover\": \"https://www.norli.no/media/catalog/product/9/7/9780006479888_1.jpg?auto=webp&format=pjpg&width=728&height=910&fit=cover\"}'),
(15, 'Spelet om Tronen', 1337, NULL, 3, '{\"largeCover\": \"https://www.norli.no/media/catalog/product/9/7/9780006479888_1.jpg?auto=webp&format=pjpg&width=728&height=910&fit=cover\", \"hejDetHärÄrEnBild\": \"https://kbimages1-a.akamaihd.net/a2f113a7-b3d0-49a2-a10f-98728432d55d/1200/1200/False/a-game-of-thrones-a-song-of-ice-and-fire-book-1-1.jpg\"}');

-- --------------------------------------------------------

--
-- Table structure for table `publisher`
--

CREATE TABLE `publisher` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `publisher`
--

INSERT INTO `publisher` (`id`, `name`) VALUES
(1, 'Bantam Spectra'),
(2, 'Voyager Books'),
(3, 'Whicks\' Books');

-- --------------------------------------------------------

--
-- Table structure for table `_authortobook`
--

CREATE TABLE `_authortobook` (
  `A` int(10) UNSIGNED NOT NULL,
  `B` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_authortobook`
--

INSERT INTO `_authortobook` (`A`, `B`) VALUES
(5, 10),
(5, 11);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0ffdec21-e719-4875-84a3-dc724f95af69', '05e79f11daebdde5b873e4ce8e0d02e2a0829ad49617bc7d7385e6d30e48c681', '2023-01-26 09:59:57.259', '20230126094526_birthdate_without_time', NULL, NULL, '2023-01-26 09:59:57.106', 1),
('57fd3d51-de1a-40ec-a6f9-36063e10080a', 'e7b76637c2f1cc76746d9a4c9948641b65ebe379968ac6b58533780c94088c51', '2023-01-26 09:59:57.103', '20230126085442_init', NULL, NULL, '2023-01-26 09:59:56.800', 1),
('c303add8-44d1-44b3-be5e-3e7d6aea4301', '2fd0d841e9d141bc4235e8f6b4ab504efb40807773599293449ca7d477836301', '2023-01-26 09:59:58.513', '20230126095958_publisher', NULL, NULL, '2023-01-26 09:59:58.324', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `author`
--
ALTER TABLE `author`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Book_publisherId_fkey` (`publisherId`);

--
-- Indexes for table `publisher`
--
ALTER TABLE `publisher`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_authortobook`
--
ALTER TABLE `_authortobook`
  ADD UNIQUE KEY `_AuthorToBook_AB_unique` (`A`,`B`),
  ADD KEY `_AuthorToBook_B_index` (`B`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `author`
--
ALTER TABLE `author`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `publisher`
--
ALTER TABLE `publisher`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `Book_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `publisher` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `_authortobook`
--
ALTER TABLE `_authortobook`
  ADD CONSTRAINT `_AuthorToBook_A_fkey` FOREIGN KEY (`A`) REFERENCES `author` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_AuthorToBook_B_fkey` FOREIGN KEY (`B`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

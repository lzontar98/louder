-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gostitelj: 127.0.0.1
-- Čas nastanka: 01. sep 2024 ob 19.13
-- Različica strežnika: 10.4.32-MariaDB
-- Različica PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Zbirka podatkov: `louder`
--

-- --------------------------------------------------------

--
-- Struktura tabele `profiles`
--

CREATE TABLE `profiles` (
  `user` varchar(20) NOT NULL,
  `profile` varchar(20) NOT NULL,
  `CH1` float NOT NULL,
  `CH2` float NOT NULL,
  `CH3` float NOT NULL,
  `CH4` float NOT NULL,
  `Bass1` float NOT NULL,
  `Mid1` float NOT NULL,
  `Treble1` float NOT NULL,
  `Bass2` float NOT NULL,
  `Mid2` int(10) NOT NULL,
  `Treble2` int(10) NOT NULL,
  `Bass3` int(10) NOT NULL,
  `Mid3` int(10) NOT NULL,
  `Treble3` int(10) NOT NULL,
  `Bass4` int(10) NOT NULL,
  `Mid4` int(10) NOT NULL,
  `Treble4` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `profiles`
--

INSERT INTO `profiles` (`user`, `profile`, `CH1`, `CH2`, `CH3`, `CH4`, `Bass1`, `Mid1`, `Treble1`, `Bass2`, `Mid2`, `Treble2`, `Bass3`, `Mid3`, `Treble3`, `Bass4`, `Mid4`, `Treble4`) VALUES
('luka', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('luka', 'Profile2', 0.91, 0.62, 0.28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('luka', 'Profile3', 0.81, 0, 1, 1, -26, 9, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('luka', 'Profile4', 0.91, 1, 1, 1, -30, 20, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('radio', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('radio', 'Profile2', 0.91, 0.62, 0.28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('radio', 'Profile3', 0.81, 0, 1, 1, -26, 9, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('radio', 'Profile4', 0.91, 1, 1, 1, -30, 20, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('BIGBOI', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('BIGBOI', 'Profile2', 0.91, 0.62, 0.28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('BIGBOI', 'Profile3', 0.81, 0, 1, 1, -26, 9, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('BIGBOI', 'Profile4', 0.91, 1, 1, 1, -30, 20, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('mihelin', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('mihelin', 'Profile2', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('mihelin', 'Profile3', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('mihelin', 'Profile4', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('marciuš', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('marciuš', 'Profile2', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('marciuš', 'Profile3', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('marciuš', 'Profile4', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('kdoesss', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('kdoesss', 'Profile2', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('kdoesss', 'Profile3', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('kdoesss', 'Profile4', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('pimotej', 'Profile1', 0.42, 0.83, 0.76, 0.83, 0, 0, 0, -9, 10, 4, 3, -16, 4, 7, 0, 0),
('pimotej', 'Profile2', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('pimotej', 'Profile3', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('pimotej', 'Profile4', 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabele `user`
--

CREATE TABLE `user` (
  `user` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `user`
--

INSERT INTO `user` (`user`, `password`) VALUES
('BIGBOI', 'BIGBOI'),
('dvojnik', 'dvojnik'),
('Florijan', 'morijan'),
('kdoesss', 'gbfggtrgrrghujg'),
('luka', 'pipistrel'),
('mafini', 'mafini'),
('majda', 'bajda'),
('marciuš', 'marciuš'),
('merjasec', 'mersec'),
('mihelin', 'mihelin'),
('pimotej', 'ffffffffff'),
('trojnik', 'ddddddddd');

--
-- Indeksi zavrženih tabel
--

--
-- Indeksi tabele `profiles`
--
ALTER TABLE `profiles`
  ADD KEY `profile` (`profile`);

--
-- Indeksi tabele `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

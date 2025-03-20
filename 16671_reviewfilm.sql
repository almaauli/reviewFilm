-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2025 at 06:02 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `16671_reviewfilm`
--

-- --------------------------------------------------------

--
-- Table structure for table `film`
--

CREATE TABLE `film` (
  `id_film` int UNSIGNED NOT NULL,
  `nama_film` varchar(255) NOT NULL,
  `trailer` text,
  `gambar_film` text,
  `deskripsi` text,
  `genre` int UNSIGNED DEFAULT NULL,
  `tahun` int UNSIGNED DEFAULT NULL,
  `negara` int UNSIGNED DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `durasi` bigint UNSIGNED DEFAULT NULL,
  `aktor` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_author` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `film`
--

INSERT INTO `film` (`id_film`, `nama_film`, `trailer`, `gambar_film`, `deskripsi`, `genre`, `tahun`, `negara`, `rating`, `durasi`, `aktor`, `created_at`, `updated_at`, `id_author`) VALUES
(1, 'Petaka Gunung Gede', 'http://localhost:3000/videos/1742262686359.mp4', 'uploads/petakagg.jpg', 'Petaka Gunung Gede adalah sebuah film Indonesia tahun 2025 yang disutradarai oleh Azhar Kinoi Lubis. Jalan ceritanya diambil dari kisah nyata yang ditulis oleh Maya Azka dan Upi Avianto. Film tersebut dibintangi oleh Arla Ailani, Adzana Ashel, Endy Arfian, Raihan Khan, Moh. Iqbal Sulaiman dan Jeremie Moeremans. ', 1, 1, 1, '4.0', 98, 'Arla Ailani, Adzana Ashel, Endy Arfian, Raihan Khan', '2025-02-13 06:35:00', '2025-03-20 02:43:59', 1),
(2, 'Ayo Balikan', 'http://localhost:3000/videos/1742262737182.mp4', 'uploads/ayobalikan.jpg', 'Ayo Balikan adalah film komedi romantis Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani berdasarkan novel berjudul sama karya Ananda Ryu. Film produksi MD Pictures ini dibintangi oleh Syifa Hadju dan Bryan Domani. Film Ayo Balikan tayang perdana di Prime Video pada 23 Mei 2024.', 3, 2, 1, '5.0', 86, 'Bryan domani, Syifa Hadju', '2025-02-22 17:00:51', '2025-03-20 02:45:28', 1),
(3, 'Kuasa Gelap', 'http://localhost:3000/videos/1742262749304.mp4', 'uploads/KuasaGelap.jpg', 'Kuasa Gelap (judul internasional: Dominion of Darkness) adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Bobby Prasetyo. Film tersebut menampilkan Lukman Sardi, Astrid Tiar, Jerome Kurnia, Lea Ciarachel, dan Freya JKT48. Film mengangkat kisah nyata tentang kasus eksorsisme ajaran agama Katolik yang pernah terjadi di Indonesia dan terinspirasi dari kisah nyata seorang pastor eksorsis di salah satu gereja di daerah Semarang. Film tersebut memulai proses syutingnya pada 10 Februari 2024 dan tayang di bioskop Indonesia pada 3 Oktober 2024.[1] Film Kuasa Gelap meraih 1.466.466 penonton selama masa tayangnya di bioskop Indonesia.', 1, 2, 1, '0.0', 96, 'Jerome Kurnia, Astrid Tiar, Lukman Sardi, Lea Cirachel, Freya Jayawardana', '2025-02-24 03:24:28', '2025-03-20 02:45:54', 5),
(4, 'SUMALA', 'http://localhost:3000/videos/1742262765325.mp4', 'uploads/Sumalaa.jpg', 'Sumala adalah sebuah film horor Indonesia tahun 2024 yang diproduksi oleh Hitmaker Studios dan disutradarai oleh Rizal Mantovani. Film tersebut dibintangi oleh Luna Maya, Darius Sinathrya dan Makayla Rose.', 1, 2, 1, '1.0', 113, 'Luna Maya, Darius Sinathrya, Makayla Rose', '2025-02-24 04:02:03', '2025-03-20 02:54:00', 1),
(5, 'Agak Laen', 'http://localhost:3000/videos/1742262788854.mp4', 'uploads/agaklaen.jpg', 'Agak Laen adalah film horor komedi Indonesia tahun 2024 yang disutradarai dan ditulis oleh Muhadkly Acho berdasarkan siniar Agak Laen. Film produksi Imajinari serta Jagartha ini dibintangi oleh personel siniar Agak Laen, yaitu Bene Dion, Oki Rengga, Boris Bokir, dan Indra Jegel.', 5, 2, 1, '5.0', 119, 'Bene Dion, Oki Rengga,, Indra Jegel, Boris Bokir, Tissa Biani', '2025-02-27 06:50:46', '2025-03-20 02:47:20', 1),
(7, 'Sekawan Limo', 'http://localhost:3000/videos/1742262799559.mp4', 'uploads/sekawan.jpg', 'Sekawan Limo adalah sebuah film horor komedi Indonesia tahun 2024 yang disutradarai oleh Bayu Skak. Film yang dibintangi oleh Bayu Skak, Nadya Arina, Keisya Levronka, Dono Pradana, Benidictus Siregar, Indra Pramujito, Firza Valaza, dan Audya Ananta dirilis pada 4 Juli 2024.', 5, 2, 1, '0.0', 112, 'Bayu Skak, Nadya Arina, Keisya Levronka, Dono Pradana, Benidictus Siregar', '2025-03-06 04:18:57', '2025-03-20 02:47:36', 1),
(10, 'Moana 2', 'https://youtu.be/hDZ7y8RP5HE?si=xTW7AvpGDVE1XCVN', 'uploads/moana2.jpg', 'Moana 2 adalah sebuah film animasi musikal Amerika Serikat tahun 2024 yang diproduksi Walt Disney Animation Studios untuk Walt Disney Pictures. Moana 2 merupakan sequel dari Moana.', 7, 2, 3, '5.0', 90, 'Moana, Maui', '2025-03-12 06:54:44', '2025-03-20 02:48:01', 5),
(11, 'Decendants of The Sun', 'https://youtu.be/wTGwjDqtfzQ?si=ZhvVdVx6BbZ_UfU3', 'uploads/dots.jpg', 'Descendants of the Sun adalah serial televisi Korea Selatan tahun 2016 yang dibintangi Song Joong-ki, Song Hye-kyo, Jin Goo dan Kim Ji-won. Drama ini disiarkan di KBS2 mulai 24 Februari hingga 14 April 2016 setiap Rabu dan Kamis pukul 22.00 untuk 16 episode.', 3, 17, 4, '0.0', 90, 'Song Jong-ki, Song He-kyo', '2025-03-14 03:48:07', '2025-03-20 02:48:24', 5),
(12, 'Lovely Runner', 'https://youtu.be/5kk0dYa8Ccc?si=xAfX1yUMhD4eI2et', 'uploads/lovely.jpg', 'Lovely Runner adalah seri televisi Korea Selatan yang dibintangi oleh Kim Hye-yoon dan Byeon Woo-seok. Seri televisi ini didasarkan pada Webtoon yang berjudul Tomorrow\'s Best karya Kim Bbang, yang mana karya aslinya dirilis pada Juli 2020 di KakaoPage.', 3, 2, 4, '0.0', 120, 'Byun Woo-seok, Kim Hye-yoon', '2025-03-14 03:54:48', '2025-03-20 02:48:52', 5),
(13, 'My Demon', 'https://youtu.be/D-bAfFqvxZg?si=u_NRWsXn0IA-Ek5L', 'uploads/demon.jpg', 'My Demon adalah seri televisi Korea Selatan yang dibintangi oleh Song Kang, Kim Yoo-jung, dan Lee Sang-yi. Seri televisi ini tayang perdana di SBS TV untuk Korea Selatan dan Netflix secara global pada 24 November 2023, dan disiarkan setiap Jumat dan Sabtu pada pukul 22:00.', 3, 2, 4, '0.0', 120, 'Song Kang, Kim Yoo-Jung', '2025-03-14 15:10:56', '2025-03-20 02:49:09', 2),
(14, 'Business Proposal', 'https://youtu.be/jfnTceEqw_4?si=g6UtXxXiIDcsU4q_', 'uploads/business.jpg', 'Business Proposal adalah seri televisi komedi romantis Korea Selatan yang didasarkan pada webtun berjudul sama yang ditulis oleh HaeHwa dan diilustrasikan oleh Narak.', 3, 4, 4, NULL, 120, 'Kim Se-jeong, Ahn Hyeo-seop, Kim Min-kyu, Seol In-ah', '2025-03-14 15:36:21', '2025-03-20 01:12:05', 2),
(16, 'Vincenzo', 'https://youtu.be/_J8tYxYB_YU?si=B6YJC8eQv-VrukvD', 'https://asianwiki.com/images/0/01/Vincenzo-KD-p1.jpg', 'Vincenzo adalah seri televisi Korea Selatan tahun 2021 yang menampilkan Song Joong-ki, Jeon Yeo-been, Ok Taec-yeon, Kim Yeo-jin, Kwak Dong-yeon, dan Jo Han-cul. Ditayangkan perdana di tvN setiap Sabtu dan Minggu pukul 21:00 mulai 20 Februari hingga 2 Mei 2021 dan juga tersedia melalui Netflix.', 2, 5, 4, '2.0', 120, 'Song Jong-ki, Jeon Yeo-been', '2025-03-15 21:53:43', '2025-03-20 02:54:18', 5),
(17, 'Welcome to Samdal-ri', 'https://youtu.be/dAnQ23o2w-c?si=HLUB4iV4ZO3C9xY2', 'https://upload.wikimedia.org/wikipedia/id/5/54/Welcome_to_Samdal-ri.jpg', 'Welcome to Samdal-ri adalah seri televisi Korea Selatan yang ditulis oleh Kwon Hye-joo, disutradarai oleh Cha Young-hoon, dan dibintangi oleh Ji Chang-wook, Shin Hye-sun dan Kang Young-seok. Seri ini dijadwalkan akan dirilis di JTBC pada Desember 2023.', 5, 3, 4, NULL, 120, 'Ji Chang-wook, Shin Hye-sun', '2025-03-15 22:57:02', '2025-03-20 01:08:17', 2),
(18, 'KKN Desa Penari', 'https://youtu.be/01BPk6M37qs?si=BJwxVEYm_Sb-dHzb', 'https://m.media-amazon.com/images/M/MV5BNTMxODczNmUtOTJjZC00MTk4LWI1ZTUtMWRjYTczNjRkMTdlXkEyXkFqcGc@._V1_.jpg', 'KKN Di Desa Penari diadaptasi dari salah satu cerita horror yang telah viral di tahun 2019 melalui Twitter, menurut sang penulis, cerita ini diambil dari sebuah kisah nyata sekelompok mahasiswa yang tengah melakukan program KKN (Kuliah Kerja Nyata) di Desa Penari. Tak berjalan mulus, serentetan pengalaman horror pun menghantui mereka hingga program KKN tersebut berakhir tragis.', 1, 4, 1, NULL, 130, 'Tissa Biani, Adinda Thomas, Achmad Megantara, Aghniny Haque, Calvin Jeremy, Fajar Nugra', '2025-03-16 08:23:21', '2025-03-20 01:56:01', 2),
(19, '1 Kakak 7 Ponakan', 'https://youtu.be/LkUsJMFngiI?si=1xIni4n9hpM1F7x6', 'https://cdn.idntimes.com/content-images/community/2024/12/teaser-a-brother-and-7-siblings-a724bbfc49c32d1d8d2b9a54da0949b6-f9b07ba3933f86ff10e059d87f1afacf.jpg', '1 Kakak 7 Ponakan adalah film keluarga Indonesia tahun 2025 yang disutradarai oleh Yandy Laurens. Film tersebut diadaptasi dari sinetron tahun 1996 bernama sama.', 4, 1, 1, NULL, 131, 'Chicco Kurniawan, Amanda Rawles, Fatih Unru, Freya JKT48, Ahmad Nadhif', '2025-03-16 08:28:36', '2025-03-20 01:57:24', 2),
(21, 'In The lost lands', 'http://localhost:3000/videos/1742115365952.mp4', 'http://localhost:3000/uploads/1742115370401.jpg', 'Diterjemahkan dari bahasa Inggris-In the Lost Lands adalah film fantasi gelap epik tahun 2025 yang disutradarai oleh Paul W. S. Anderson, dengan skenario oleh Constantin Werner dari cerita yang mereka berdua tulis bersama. Berdasarkan cerita pendek berjudul sama karya George R. R. ', 7, 1, 3, '0.0', 101, 'Milla Jovovich, Dave Bautista', '2025-03-16 08:56:27', '2025-03-20 02:49:51', 5),
(22, 'Dilan 1990', 'http://localhost:3000/videos/1742140940534.mp4', 'http://localhost:3000/uploads/1742140945076.jpg', 'Milea (Vanesha Prescilla) bertemu dengan Dilan (Iqbaal Ramadhan) di sebuah SMA di Bandung. Itu adalah tahun 1990, saat Milea pindah dari Jakarta ke Bandung. Perkenalan yang tidak biasa kemudian membawa Milea mulai mengenal keunikan Dilan lebih jauh. Dilan yang pintar, baik hati dan romantis... semua dengan caranya sendiri. Cara Dilan mendekati Milea tidak sama dengan teman-teman lelakinya yang lain, bahkan Beni, pacar Milea di Jakarta. Bahkan cara berbicara Dilan yang terdengar kaku, lambat laun justru membuat Milea kerap merindukannya jika sehari saja ia tak mendengar suara itu. Perjalanan hubungan mereka tak selalu mulus. Beni, gank motor, tawuran, Anhar, Kang Adi, semua mewarnai perjalanan itu. Dan Dilan... dengan caranya sendiri...selalu bisa membuat Milea percaya ia bisa tiba di tujuan dengan selamat. Tujuan dari perjalanan ini. Perjalanan mereka berdua. Katanya, dunia SMA adalah dunia paling indah. Dunia Milea dan Dilan satu tingkat lebih indah daripada itu.', 3, 9, 1, '5.0', 120, 'Iqbal Ramadhan, Vanesha Prescilla', '2025-03-16 16:02:37', '2025-03-20 02:53:01', 5),
(23, 'Ancika: Dia yang Bersamaku 1998', 'https://youtu.be/DbOa2bGLNWA?si=wj2mPS1qsnUB4Djv', 'https://i.pinimg.com/736x/1a/e5/e8/1ae5e882ea2cb77454f31ba33fcadc22.jpg', 'Dikisahkan tentang persahabatan dan jalin hubungan antara Dilan dan Ancika Mehrunisa Rabu. Hubungan mereka yang semakin erat membuat benih-benih cinta tumbuh dan hubungan mereka pun menanjak hingga ke jenjang kekasih. Di tahun 1995, Dilan si mantan panglima geng motor jatuh cinta pada Ancika, perempuan yang sangat membenci geng motor. Sudah begitu, Ancika juga tidak suka berpacaran, dan jelas, tidak suka Dilan. Jadilah Dilan harus mencari cara untuk menaklukan perempuan yang jauh berbeda dengan Milea, si mantan. Selisih usia dan lingkungan membuat usaha Dilan berlipat ganda, apalagi di balik sikap dewasa yang nggak sesuai usianya, Ancika itu cemburuan. Makin berat perjuangan Dilan.', 3, 2, 1, '2.0', 112, 'Zee JKT48, Arbani Yasiz, Daffa Wardhana, Dito Darmawan, Ratu Rafa', '2025-03-16 16:21:06', '2025-03-20 02:52:41', 2),
(25, 'Miracle in Cell No.7', 'http://localhost:3000/videos/1742202261364.mp4', 'http://localhost:3000/uploads/1742202265882.jpg', 'Dodo Rozak hanya ingin menjadi ayah yang baik bagi anaknya, Kartika, sekalipun dia hanyalah pria dengan kecerdasan terbatas, bertingkah dan berperilaku seperti anak-anak. Pada kenyataannya, justru Kartika yang lebih sering menjaga dan merawat ayahnya. Tapi keduanya hidup bahagia. Kartika bangga pada ayahnya yang berjualan balon sehari-harinya.', 4, 4, 1, '5.0', 123, 'Vino G. Bastian, Graciella Abigail, Indro Warkop, Tora Sudiro, Rigen Rakelna, Indra Jegel, Bryan Domani, Denny Sumargo, Mawar de Jongh', '2025-03-17 09:04:39', '2025-03-20 02:52:20', 2),
(27, 'Moana', 'https://youtu.be/raLXRLgHHqI?si=4-bA-zDQDVpH6jxe', 'https://www.hawaii.edu/news/attachments/img9643_8689l.jpg', 'Moana memulai petualangan berlayar dengan perahu untuk meyakinkan Maui, si sosok setengah-dewa, agar mengembalikan hati sang dewi, Te Fitti, setelah panen gagal dan ikan-ikan di pulaunya mulai mati.', 10, 9, 3, '3.5', 111, 'Moana, Maui', '2025-03-19 03:16:35', '2025-03-20 02:53:43', 2),
(29, 'Doctor Slump', 'https://youtu.be/Lt5M2-8p41c?si=hGjh0sw3zYUZ2Gs7', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQMGSBaFGSljzTTPUNZ-KrhFHHK-1B_7HOhxwWGayHU5ofvRK44YFmrR_E5ZiXrPVyCjZsoudu1nEDIYwFwtnGc04KQ_H5GamHMNRd90w', 'Doctor Slump adalah seri televisi Korea Selatan tahun 2024 yang ditulis oleh Baek Sun-woo, disutradarai oleh Oh Hyun-jong, dan dibintangi oleh Park Hyung-sik, Park Shin-hye, Yoon Park, dan Kong Seong-ha. ', 5, 2, 4, '3.0', 123, 'Park Hyung-Sik, Park Shin-Hye', '2025-03-19 07:05:39', '2025-03-20 02:51:42', 5),
(30, 'Mr. Queen', 'https://youtu.be/2-Ikfk0hJbw?si=KT6ziWCEQB13dBIs', 'https://upload.wikimedia.org/wikipedia/id/e/e7/Mr._Queen_poster.jpg', 'Mr. Queen adalah seri televisi Korea Selatan tahun 2020 yang dibintangi oleh Shin Hye-sun dan Kim Jung-hyun. Seri ini ditayangkan di tvN setiap Sabtu dan Minggu pukul 21:00 mulai 12 Desember 2020 hingga 14 Februari 2021.', 5, 6, 4, NULL, 90, 'Shin Hye-sun, Kim Jung-hyun', '2025-03-20 05:55:09', '2025-03-20 05:55:09', 5);

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `id_genre` int UNSIGNED NOT NULL,
  `nama_genre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`id_genre`, `nama_genre`, `created_at`, `updated_at`) VALUES
(1, 'Horor', '2025-02-12 08:15:28', '2025-02-12 08:15:28'),
(2, 'Aksi', '2025-02-22 12:00:17', '2025-02-22 12:00:17'),
(3, 'Romance', '2025-02-22 16:58:48', '2025-02-22 16:58:48'),
(4, 'Dokumenter', '2025-02-24 03:26:12', '2025-02-24 03:26:12'),
(5, 'Komedi', '2025-02-27 06:47:29', '2025-02-27 06:47:29'),
(7, 'Fantasi', '2025-03-06 03:37:46', '2025-03-12 00:42:51'),
(9, 'Thriller', '2025-03-17 09:41:10', '2025-03-20 01:25:29'),
(10, 'Animasi', '2025-03-17 22:23:34', '2025-03-17 22:23:34');

-- --------------------------------------------------------

--
-- Table structure for table `komentar`
--

CREATE TABLE `komentar` (
  `id_komentar` bigint UNSIGNED NOT NULL,
  `id_film` int UNSIGNED NOT NULL,
  `id_user` int UNSIGNED NOT NULL,
  `rating_user` enum('1','2','3','4','5') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `komentar` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `komentar`
--

INSERT INTO `komentar` (`id_komentar`, `id_film`, `id_user`, `rating_user`, `komentar`, `created_at`, `updated_at`) VALUES
(38, 1, 11, '4', 'uwah', '2025-03-20 02:43:59', '2025-03-20 02:43:59'),
(39, 2, 11, '5', 'mauq', '2025-03-20 02:45:28', '2025-03-20 02:45:28'),
(40, 5, 11, '5', 'keren', '2025-03-20 02:47:20', '2025-03-20 02:47:20'),
(41, 10, 11, '5', 'info moana 3', '2025-03-20 02:48:01', '2025-03-20 02:48:01'),
(42, 29, 11, '3', 'bgs', '2025-03-20 02:51:42', '2025-03-20 02:51:42'),
(43, 27, 11, '4', 'info moana 2', '2025-03-20 02:52:05', '2025-03-20 02:52:05'),
(44, 25, 11, '5', 'syedd', '2025-03-20 02:52:20', '2025-03-20 02:52:20'),
(45, 23, 11, '2', 'ganti pemain', '2025-03-20 02:52:41', '2025-03-20 02:52:41'),
(46, 22, 11, '5', 'W O W', '2025-03-20 02:53:01', '2025-03-20 02:53:01'),
(47, 27, 1, '3', 'bagusan moana 2', '2025-03-20 02:53:43', '2025-03-20 02:53:43'),
(48, 4, 1, '1', 'serem ih', '2025-03-20 02:54:00', '2025-03-20 02:54:00'),
(49, 16, 1, '2', 'GANTUNG BET', '2025-03-20 02:54:18', '2025-03-20 02:54:18');

--
-- Triggers `komentar`
--
DELIMITER $$
CREATE TRIGGER `update_film_rating_after_delete` AFTER DELETE ON `komentar` FOR EACH ROW BEGIN
    UPDATE film
    SET rating = (
        SELECT COALESCE(AVG(CAST(rating_user AS DECIMAL(3,1))), 0) 
        FROM komentar 
        WHERE id_film = OLD.id_film
    )
    WHERE id_film = OLD.id_film;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_film_rating_after_insert` AFTER INSERT ON `komentar` FOR EACH ROW BEGIN
    UPDATE film
    SET rating = (
        SELECT COALESCE(AVG(CAST(rating_user AS DECIMAL(3,1))), 0) 
        FROM komentar 
        WHERE id_film = NEW.id_film
    )
    WHERE id_film = NEW.id_film;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_film_rating_after_update` AFTER UPDATE ON `komentar` FOR EACH ROW BEGIN
    UPDATE film
    SET rating = (
        SELECT COALESCE(AVG(CAST(rating_user AS DECIMAL(3,1))), 0) 
        FROM komentar 
        WHERE id_film = NEW.id_film
    )
    WHERE id_film = NEW.id_film;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `negara`
--

CREATE TABLE `negara` (
  `id_negara` int UNSIGNED NOT NULL,
  `nama_negara` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `negara`
--

INSERT INTO `negara` (`id_negara`, `nama_negara`, `created_at`, `updated_at`) VALUES
(1, 'Indonesia\r\n', '2025-02-12 08:14:55', '2025-02-12 08:14:55'),
(3, 'English', '2025-03-06 03:23:49', '2025-03-06 03:23:49'),
(4, 'Korea', '2025-03-10 13:12:26', '2025-03-10 13:12:26');

-- --------------------------------------------------------

--
-- Table structure for table `tahun`
--

CREATE TABLE `tahun` (
  `id_tahun` int UNSIGNED NOT NULL,
  `tahun_rilis` year NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tahun`
--

INSERT INTO `tahun` (`id_tahun`, `tahun_rilis`, `created_at`, `updated_at`) VALUES
(1, 2025, '2025-02-12 08:15:08', '2025-02-12 08:15:08'),
(2, 2024, '2025-02-13 06:47:02', '2025-02-13 06:47:02'),
(3, 2023, '2025-02-18 07:47:46', '2025-02-18 07:47:46'),
(4, 2022, '2025-02-19 14:51:37', '2025-02-19 14:51:37'),
(5, 2021, '2025-02-19 15:05:53', '2025-02-19 15:05:53'),
(6, 2020, '2025-02-19 15:14:21', '2025-02-19 15:14:21'),
(7, 2019, '2025-02-21 06:57:54', '2025-02-21 06:57:54'),
(9, 2018, '2025-02-24 00:52:36', '2025-02-24 00:52:36'),
(10, 2017, '2025-03-02 06:10:56', '2025-03-02 06:40:06'),
(17, 2016, '2025-03-05 10:00:07', '2025-03-05 10:00:07'),
(18, 2010, '2025-03-05 10:02:21', '2025-03-18 04:18:31'),
(19, 2002, '2025-03-17 09:17:23', '2025-03-17 09:17:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `usia` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','author','admin') NOT NULL,
  `profile` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `watchlist` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama`, `usia`, `email`, `password`, `role`, `profile`, `created_at`, `updated_at`, `watchlist`) VALUES
(1, 'Sky', '18', 'sky@gmail.com', '$2b$10$OTFuZxAt8FsLfb0WOQwbXOV0hQu4yJRXDUONRQ.zzFYDGCrBGRXYa', 'user', '1742199487879.jpg', '2025-02-07 17:03:21', '2025-03-20 04:50:08', '[1,2,21,25,27]'),
(2, 'admin', '18', 'admin@gmail.com', '$2b$10$3JtLoCSCc9/BtekA2WFM7.Zx.y0H5iYhpJENrT959SI67SMNEqNze', 'admin', '1742268236605.JPG', '2025-02-07 17:05:54', '2025-03-18 03:23:56', NULL),
(5, 'Yata', '18', 'yata@gmail.com', '$2b$10$idjp/6DE3annROb7d0shuOz5RZp.Qu/DAjp6uOPs3PkPcqBJTUgr6', 'author', '1742268295439.jpg', '2025-02-11 01:45:00', '2025-03-18 03:24:55', '[5,12,7]'),
(6, 'Eak', '11', 'lali@gmail.com', '$2a$12$1Dv5VMeVgcXQxUzPe.V0AODDaLJwO0zljjKhoMdj.AZUV9fie3knu', 'author', '1742271027945.jpg', '2025-02-11 04:23:33', '2025-03-18 06:28:48', NULL),
(11, 'www', '18', 'www@gmail.com', '$2b$10$5yXG2LF1aY19h/gtcrNrBOYzclIEYIgHREtnzhg8MCFrmVyNjhbaS', 'user', '1742271072926.jpg', '2025-03-09 15:38:01', '2025-03-18 04:11:12', '[23]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`id_film`),
  ADD KEY `genre` (`genre`),
  ADD KEY `tahun` (`tahun`),
  ADD KEY `negara` (`negara`),
  ADD KEY `fk_film_author` (`id_author`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id_genre`);

--
-- Indexes for table `komentar`
--
ALTER TABLE `komentar`
  ADD PRIMARY KEY (`id_komentar`),
  ADD KEY `id_film` (`id_film`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `negara`
--
ALTER TABLE `negara`
  ADD PRIMARY KEY (`id_negara`);

--
-- Indexes for table `tahun`
--
ALTER TABLE `tahun`
  ADD PRIMARY KEY (`id_tahun`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `film`
--
ALTER TABLE `film`
  MODIFY `id_film` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id_genre` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `komentar`
--
ALTER TABLE `komentar`
  MODIFY `id_komentar` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `negara`
--
ALTER TABLE `negara`
  MODIFY `id_negara` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tahun`
--
ALTER TABLE `tahun`
  MODIFY `id_tahun` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `film`
--
ALTER TABLE `film`
  ADD CONSTRAINT `film_ibfk_1` FOREIGN KEY (`genre`) REFERENCES `genre` (`id_genre`),
  ADD CONSTRAINT `film_ibfk_2` FOREIGN KEY (`tahun`) REFERENCES `tahun` (`id_tahun`),
  ADD CONSTRAINT `film_ibfk_3` FOREIGN KEY (`negara`) REFERENCES `negara` (`id_negara`),
  ADD CONSTRAINT `fk_film_author` FOREIGN KEY (`id_author`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `komentar`
--
ALTER TABLE `komentar`
  ADD CONSTRAINT `komentar_ibfk_1` FOREIGN KEY (`id_film`) REFERENCES `film` (`id_film`),
  ADD CONSTRAINT `komentar_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

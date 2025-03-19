const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "rahasyaaja";
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/videos", (req, res, next) => {
  console.log(`Meminta video: ${req.url}`);
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/videos", express.static(path.join(__dirname, "mp4")));

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware session
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "16671_reviewfilm",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal terhubung ke database:", err);
    throw err;
  }
  console.log("Terhubung ke database MySQL");
});

// Storage untuk gambar dan video
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, './mp4'); // Jika file adalah video, simpan di folder 'mp4'
    } else {
      cb(null, './uploads'); // Jika file adalah gambar, simpan di folder 'uploads'
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file dengan timestamp
  }
});

// Filter untuk hanya menerima gambar dan video
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov/; // Ekstensi yang diizinkan
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: File harus berupa gambar atau video');
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Maksimal 10MB
});


//middleware verify
const verifyToken = require("./verifyToken");
app.get("/protected-route", verifyToken, (req, res) => {
  res.send({ message: `Welcome, user ${req.userId} with role ${req.role}` });
});

// Register
app.post("/register", async (req, res) => {
  const { nama, email, password } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ error: "Semua field wajib diisi!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, 'user')";
    db.query(query, [nama, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error saat registrasi:", err);
        return res.status(500).json({ error: "Gagal melakukan registrasi." });
      }
      res.status(201).json({ message: "Registrasi berhasil." });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Gagal memproses data." });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(401).send({ message: "Email not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: "Invalid password" });
    const token = jwt.sign(
      {
        userId: user.id_user,
        role: user.role,
        nama: user.nama, // Tambahkan nama ke payload token
        profile: user.profile, // Tambahkan profile ke payload token
      },
      secretKey,
      { expiresIn: "1h" }
    );

    res.send({
      message: "Login successful",
      token,
      role: user.role,
      userId: user.id_user, // Kirim user_id ke frontend
    });
  });
});

//CRUD USER
app.get("/user", (req, res) => {
  db.query(
    "SELECT id_user, nama, usia, email, role, profile, watchlist, created_at, updated_at FROM users",
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});
app.post("/user", async (req, res) => {
  const { nama, usia, email, password, role, profile, watchlist } = req.body;

  if (!nama || !email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Nama, email, password, dan role harus diisi" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (nama, usia, email, password, role, profile, watchlist, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    db.query(
      query,
      [nama, usia, email, hashedPassword, role, profile, watchlist],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User added", id: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error hashing password" });
  }
});
app.put("/user/:id", (req, res) => {
  console.log("Request update user:", req.body);
  console.log("User ID:", req.params.id);

  const { id } = req.params;
  const { nama, usia, email, role, profile, watchlist } = req.body;

  if (!nama || !email || !role) {
    return res.status(400).json({ error: "Nama, email, dan role harus diisi" });
  }

  const sql = `
  UPDATE users SET 
  nama = ?, usia = ?, email = ?, role = ?, profile = ?, 
  watchlist = ? , updated_at = NOW() 
  WHERE id_user = ?`;

  const values = [nama, usia, email, role, profile || null, watchlist || null, id];

  console.log("SQL Query:", sql);
  console.log("Values:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saat update user:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    res.json({ message: "User berhasil diperbarui" });
  });
});
app.delete("/user/:id", (req, res) => {
  console.log("Request DELETE dari Angular:", req.params);

  const { id } = req.params;

  db.query("DELETE FROM users WHERE id_user = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

//CRUD tahun
app.get("/tahun", (req, res) => {
  db.query("SELECT * FROM tahun", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
app.post("/tahun", (req, res) => {
  console.log("Request body:", req.body);
  const { tahun_rilis } = req.body;
  if (!tahun_rilis)
    return res.status(400).json({ error: "Tahun rilis harus diisi" });

  db.query(
    "INSERT INTO tahun (tahun_rilis, created_at, updated_at) VALUES (?, NOW(), NOW())",
    [tahun_rilis],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Tahun added", id: result.insertId });
    }
  );
});
app.put("/tahun/:id", (req, res) => {
  console.log("Request dari Angular (PUT /tahun):", req.body);
  const { id } = req.params;
  const { tahun_rilis } = req.body;
  if (!tahun_rilis)
    return res.status(400).json({ error: "Tahun rilis harus diisi" });

  db.query(
    "UPDATE tahun SET tahun_rilis = ?, updated_at = NOW() WHERE id_tahun = ?",
    [tahun_rilis, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Tahun updated" });
    }
  );
});
app.delete("/tahun/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tahun WHERE id_tahun = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tahun deleted" });
  });
});

//CRUD Negara
app.get("/negara", (req, res) => {
  db.query("SELECT * FROM negara", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
app.post("/negara", (req, res) => {
  const { nama_negara } = req.body;
  db.query(
    "INSERT INTO negara (nama_negara, created_at, updated_at) VALUES (?, NOW(), NOW())",
    [nama_negara],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Negara added", id: result.insertId });
    }
  );
});
app.put("/negara/:id", (req, res) => {
  const { id } = req.params;
  const { nama_negara } = req.body;
  db.query(
    "UPDATE negara SET nama_negara = ?, updated_at = NOW() WHERE id_negara = ?",
    [nama_negara, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Negara updated" });
    }
  );
});
app.delete("/negara/:id", (req, res) => {
  db.query(
    "DELETE FROM negara WHERE id_negara = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Negara deleted" });
    }
  );
});

//CRUD Genre
app.get("/genre", (req, res) => {
  db.query("SELECT * FROM genre", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
app.post("/genre", (req, res) => {
  console.log("Request body:", req.body);
  const { nama_genre } = req.body;
  if (!nama_genre)
    return res.status(400).json({ error: "Nama genre harus diisi" });

  db.query(
    "INSERT INTO genre (nama_genre, created_at, updated_at) VALUES (?, NOW(), NOW())",
    [nama_genre],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Genre added", id: result.insertId });
    }
  );
});
app.put("/genre/:id", (req, res) => {
  console.log("Request dari Angular (PUT /genre):", req.body);
  const { id } = req.params;
  const { nama_genre } = req.body;
  if (!nama_genre)
    return res.status(400).json({ error: "Nama genre harus diisi" });

  db.query(
    "UPDATE genre SET nama_genre = ?, updated_at = NOW() WHERE id_genre = ?",
    [nama_genre, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Genre updated" });
    }
  );
});
app.delete("/genre/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM genre WHERE id_genre = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Genre deleted" });
  });
});

//CRUD Film
app.get("/films", (req, res) => {
  const sql = `
    SELECT 
      f.id_film, f.nama_film, f.trailer, f.gambar_film, f.deskripsi, 
      g.nama_genre AS genre, 
      t.tahun_rilis AS tahun, 
      n.nama_negara AS negara, 
      f.rating, f.durasi, f.aktor, f.created_at, f.updated_at, f.id_author
    FROM film f
    LEFT JOIN genre g ON f.genre = g.id_genre
    LEFT JOIN tahun t ON f.tahun = t.id_tahun
    LEFT JOIN negara n ON f.negara = n.id_negara
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
app.post("/films", (req, res) => {
  const {
    nama_film,
    trailer,
    gambar_film,
    deskripsi,
    genre,
    tahun,
    negara,
    durasi,
    aktor,
    id_author,
    rating
  } = req.body;

  if (!nama_film || !trailer || !gambar_film || !deskripsi || !genre || !tahun || !negara || !durasi || !aktor || !id_author) {
    return res.status(400).json({ error: "Semua field harus diisi kecuali rating" });
  }

  const query = `
    INSERT INTO film (nama_film, trailer, gambar_film, deskripsi, genre, tahun, negara, rating, durasi, aktor, id_author, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
  `;

  const filmData = [
    nama_film,
    trailer,
    gambar_film,
    deskripsi,
    genre,
    tahun,
    negara,
    rating || null,
    durasi,
    aktor,
    id_author
  ];

  db.query(query, filmData, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Film berhasil ditambahkan", id: result.insertId });
  });
});
app.put("/films/:id", (req, res) => {
  const { id } = req.params;
  const {
    nama_film,
    trailer,
    gambar_film,
    deskripsi,
    genre,
    tahun,
    negara,
    rating,
    durasi,
    aktor,
  } = req.body;

  const updateSql = `
    UPDATE film 
    SET nama_film=?, trailer=?, gambar_film=?, deskripsi=?, 
        genre=?, tahun=?, negara=?, rating=?, durasi=?, aktor=?, updated_at=NOW() 
    WHERE id_film=?`;

  db.query(
    updateSql,
    [nama_film, trailer, gambar_film, deskripsi, genre, tahun, negara, rating, durasi, aktor, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Setelah update berhasil, ambil data yang sudah diperbarui dengan nama genre, tahun, dan negara
      const selectSql = `
        SELECT 
          f.id_film, f.nama_film, f.trailer, f.gambar_film, f.deskripsi, 
          g.nama_genre AS genre, 
          t.tahun_rilis AS tahun, 
          n.nama_negara AS negara, 
          f.rating, f.durasi, f.aktor, f.created_at, f.updated_at, f.id_author
        FROM film f
        LEFT JOIN genre g ON f.genre = g.id_genre
        LEFT JOIN tahun t ON f.tahun = t.id_tahun
        LEFT JOIN negara n ON f.negara = n.id_negara
        WHERE f.id_film = ?`;

      db.query(selectSql, [id], (err, updatedFilm) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Film berhasil diperbarui", film: updatedFilm[0] });
      });
    }
  );
});
app.delete("/films/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM film WHERE id_film=?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Film berhasil dihapus" });
  });
});

//CRUD Komentar
app.get("/komentar", (req, res) => {
  const sql = `
    SELECT k.id_komentar, 
           f.id_film, f.nama_film AS film, 
           u.id_user, u.nama AS user, 
           k.rating_user, 
           k.komentar, 
           k.created_at, 
           k.updated_at
    FROM komentar k
    LEFT JOIN film f ON k.id_film = f.id_film
    LEFT JOIN users u ON k.id_user = u.id_user;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal mengambil data komentar" });
    }
    res.json(results);
  });
});
app.post("/komentar", (req, res) => {
  const { id_film, id_user, rating_user, komentar } = req.body;
  db.query(
    "INSERT INTO komentar (id_film, id_user, rating_user, komentar) VALUES (?, ?, ?, ?)",
    [id_film, id_user, rating_user, komentar],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Komentar ditambahkan" });
    }
  );
});
app.put("/komentar/:id", (req, res) => {
  const { id_film, id_user, rating_user, komentar } = req.body;
  db.query(
    "UPDATE komentar SET id_film=?, id_user=?, rating_user=?, komentar=? WHERE id_komentar=?",
    [id_film, id_user, rating_user, komentar, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Komentar diperbarui" });
    }
  );
});
app.delete("/komentar/:id", (req, res) => {
  db.query(
    "DELETE FROM komentar WHERE id_komentar=?",
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Komentar dihapus" });
    }
  );
});

//admin-dashboard
app.get("/negara", (req, res) => {
  const query = "SELECT * FROM negara";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data negara:", err);
      res.status(500).json({ error: "Gagal mengambil data negara" });
      return;
    }
    res.json(results);
  });
});
app.get("/genre", (req, res) => {
  const query = "SELECT * FROM genre";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data genre:", err);
      res.status(500).json({ error: "Gagal mengambil data genre" });
      return;
    }
    res.json(results);
  });
});
app.get("/film", (req, res) => {
  const query = "SELECT * FROM film";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data film:", err);
      res.status(500).json({ error: "Gagal mengambil data film" });
      return;
    }
    res.json(results);
  });
});
app.get("/komentar", (req, res) => {
  const query = "SELECT * FROM komentar";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data coment:", err);
      res.status(500).json({ error: "Gagal mengambil data coment" });
      return;
    }
    res.json(results);
  });
});
app.get("/total-users", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM users";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalUsers: result[0].total });
  });
});

app.get("/total-film", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM film";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalFilm: result[0].total });
  });
});
app.get("/total-komen", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM komentar";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalComent: result[0].total });
  });
});
app.get("/total-genre", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM genre";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalGenre: result[0].total });
  });
});

//anon
app.get("/api/genres", (req, res) => {
  db.query("SELECT id_genre, nama_genre FROM genre", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.get("/api/tahun", (req, res) => {
  db.query("SELECT id_tahun, tahun_rilis FROM tahun", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.get("/api/negara", (req, res) => {
  db.query("SELECT id_negara, nama_negara FROM negara", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.get("/api/films", (req, res) => {
  const query = `
    SELECT id_film, nama_film, trailer, gambar_film, deskripsi, genre, tahun, negara, durasi, 
           rating, created_at, updated_at
    FROM film
    ORDER BY created_at DESC
    LIMIT 6
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
app.get("/api/popular-films", (req, res) => {
  const query = `
    SELECT id_film, nama_film, trailer, gambar_film, deskripsi, genre, tahun, negara, durasi, 
           rating, created_at, updated_at
    FROM film
    ORDER BY rating DESC
    LIMIT 6
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
app.get("/api/comments", (req, res) => {
  db.query(
    "SELECT k.*, u.nama AS username FROM komentar k JOIN users u ON k.id_user = u.id_user ORDER BY k.created_at DESC LIMIT 3",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});
app.get("/api/statistics", (req, res) => {
  const statsQuery = `
    SELECT 
    (SELECT COUNT(*) FROM film) AS totalMovies,
    (SELECT COUNT(*) FROM komentar) AS totalReviews,
    (SELECT COUNT(*) FROM users WHERE role IN ('user', 'author')) AS totalUsers
  `;

  db.query(statsQuery, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});
app.get("/api/top-reviewers", (req, res) => {
  const reviewersQuery = `
    SELECT users.id_user, 
           users.nama AS username, 
           IFNULL(users.profile, 'default-profile.jpg') AS profile, 
           COUNT(komentar.id_komentar) AS review_count
    FROM users
    LEFT JOIN komentar ON users.id_user = komentar.id_user
    WHERE users.role = 'user' OR users.role = 'author'
    GROUP BY users.id_user
    ORDER BY review_count DESC
    LIMIT 5
  `;

  db.query(reviewersQuery, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Tambahkan URL backend untuk gambar profile
    const reviewers = result.map((reviewer) => ({
      ...reviewer,
      profile: `http://localhost:3000/uploads/${reviewer.profile}`,
    }));

    res.json(reviewers);
  });
});
app.get("/films/search", (req, res) => {
  const { query, genreId, countryId, year } = req.query;

  let sql = `
      SELECT f.* 
      FROM film f
      JOIN tahun t ON f.tahun = t.id_tahun
      JOIN genre g ON f.genre = g.id_genre
      JOIN negara n ON f.negara = n.id_negara
      WHERE 1=1
  `;
  const params = [];

  if (query) {
    sql += " AND f.nama_film LIKE ?";
    params.push(`%${query}%`);
  }
  if (genreId && genreId !== 'null' && genreId.trim() !== '') {
    sql += " AND g.id_genre = ?";
    params.push(parseInt(genreId)); // Pakai parseInt untuk memastikan ID numerik
  }
  if (countryId && countryId !== 'null' && countryId.trim() !== '') {
    sql += " AND n.id_negara = ?";
    params.push(parseInt(countryId));
  }
  if (year && year !== 'null' && year.trim() !== '') {
    sql += " AND t.tahun_rilis = ?";
    params.push(parseInt(year));
  }

  console.log("Final Query:", sql);
  console.log("Final Params:", params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err.sqlMessage || err);
      return res.status(500).json({ error: err.sqlMessage || "Database error" });
    }
    res.json(results);
  });
});

//anon-detail
app.get("/api/films/:id", (req, res) => {
  const filmId = req.params.id;
  const query = `
   SELECT 
      f.id_film, f.nama_film, f.trailer, f.gambar_film, f.deskripsi, 
      g.nama_genre AS genre, t.tahun_rilis AS tahun, 
      n.nama_negara AS negara, f.rating, f.durasi,
      u.nama AS author_name, u.profile AS author_profile,
      f.updated_at, f.aktor
    FROM film f
    JOIN genre g ON f.genre = g.id_genre
    JOIN tahun t ON f.tahun = t.id_tahun
    JOIN negara n ON f.negara = n.id_negara
    JOIN users u ON f.id_author = u.id_user
    WHERE f.id_film = ?
  `;

  db.query(query, [filmId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Film tidak ditemukan" });
    res.json(result[0]);  // Kirim data termasuk author_name
  });
});
app.get("/api/comments/film/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT k.id_komentar, k.id_film, k.id_user, k.rating_user, k.komentar, k.updated_at,
           u.nama AS username, u.profile
    FROM komentar k
    JOIN users u ON k.id_user = u.id_user
    WHERE k.id_film = ?
    ORDER BY k.created_at DESC
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/films/genre/:id_genre", (req, res) => {
  const { id_genre } = req.params;
  const sql = "SELECT * FROM film WHERE genre = ?";

  db.query(sql, [id_genre], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada film dalam kategori ini." });
    }

    res.json(result);
  });
});

//watchlist
app.get("/api/watchlist/:id_user", (req, res) => {
  const { id_user } = req.params;
  const sql = "SELECT watchlist FROM users WHERE id_user = ?";

  db.query(sql, [id_user], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const watchlistIds = result[0].watchlist
      ? JSON.parse(result[0].watchlist)
      : [];

    if (watchlistIds.length === 0) {
      return res.json([]);
    }

    // Ambil detail film berdasarkan ID di watchlist
    const sqlFilms = `SELECT id_film, nama_film, gambar_film, deskripsi, rating, durasi FROM film WHERE id_film IN (?)`;

    db.query(sqlFilms, [watchlistIds], (err, films) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(films);
    });
  });
});
app.post("/api/watchlist", (req, res) => {
  const { id_user, id_film } = req.body;

  const sqlSelect = "SELECT watchlist FROM users WHERE id_user = ?";
  db.query(sqlSelect, [id_user], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    let watchlist = result[0]?.watchlist ? JSON.parse(result[0].watchlist) : [];

    if (watchlist.includes(id_film)) {
      return res.status(400).json({ message: "Film sudah ada di watchlist" });
    }

    watchlist.push(id_film);

    const sqlUpdate = "UPDATE users SET watchlist = ? WHERE id_user = ?";
    db.query(sqlUpdate, [JSON.stringify(watchlist), id_user], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Film berhasil ditambahkan ke watchlist" });
    });
  });
});
app.delete("/api/watchlist/:id_film/:id_user", (req, res) => {
  const { id_film, id_user } = req.params; // Ambil `id_user` dari params

  const sqlSelect = "SELECT watchlist FROM users WHERE id_user = ?";
  db.query(sqlSelect, [id_user], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    let watchlist = result[0].watchlist ? JSON.parse(result[0].watchlist) : [];
    watchlist = watchlist.filter((film) => film !== parseInt(id_film));

    const sqlUpdate = "UPDATE users SET watchlist = ? WHERE id_user = ?";
    db.query(sqlUpdate, [JSON.stringify(watchlist), id_user], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Film berhasil dihapus dari watchlist" });
    });
  });
});

// Endpoint upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Tidak ada file yang diunggah');
  }

  // Tentukan URL berdasarkan apakah itu gambar atau video
  let fileUrl;
  if (req.file.mimetype.startsWith('video/')) {
    fileUrl = `http://localhost:3000/videos/${req.file.filename}`; // URL video
  } else {
    fileUrl = `http://localhost:3000/uploads/${req.file.filename}`; // URL gambar
  }

  res.send({ url: fileUrl });
});

app.get('/profile/:id', verifyToken, (req, res) => {
  console.log('Decoded token:', req.userId);  // Menampilkan ID yang diterima dari token
  const userId = req.userId;

  db.query('SELECT * FROM users WHERE id_user = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  });
});

// Endpoint: Update user profile
app.put("/profile/:id", upload.single("profile"), (req, res) => {
  console.log("Request update profile:", req.body);
  console.log("User ID:", req.params.id);
  const id = parseInt(req.params.id, 10);
  const { nama, usia, email, role, watchlist } = req.body;
  const profile = req.file ? req.file.filename : null;

  // Pastikan nama, email, dan role tidak kosong
  if (!nama || !email || !role) {
    return res.status(400).json({ error: "Nama, email, dan role harus diisi" });
  }

  // Jika email diubah, pastikan email belum digunakan oleh user lain
  db.query("SELECT id_user FROM users WHERE email = ? AND id_user != ?", [email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      return res.status(400).json({ error: "Email sudah digunakan oleh pengguna lain" });
    }

    // Jika email valid, lanjutkan pembaruan profil
    const sql = `
      UPDATE users SET 
      nama = ?, usia = ?, email = ?, role = ?, profile = ?, 
      watchlist = ?, updated_at = NOW() 
      WHERE id_user = ?`;

    const values = [nama, usia, email, role, profile || null, watchlist || null, id];

    console.log("SQL Query:", sql);
    console.log("Values:", values);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error saat update profile:", err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }
      res.json({ message: "Profile berhasil diperbarui" });
    });
  });
});

//author
app.get("/films/author/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT film.*, 
           users.nama AS author_name, 
           genre.nama_genre, 
           tahun.tahun_rilis 
    FROM film 
    JOIN users ON film.id_author = users.id_user 
    JOIN genre ON film.genre = genre.id_genre 
    JOIN tahun ON film.tahun = tahun.id_tahun 
    WHERE film.id_author = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//forgot
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'Email not found' });

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '15m' });
    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    transporter.sendMail({
      to: email,
      subject: 'Reset Password',
      text: `Click this link to reset your password: ${resetLink}`
    }, (error) => {
      if (error) return res.status(500).json({ message: 'Failed to send email' });
      res.json({ message: 'Reset link sent to your email' });
    });
  });
});
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });

      db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, decoded.email], (error) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Password updated successfully' });
      });
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Logged out successfully" });
  });
});

// server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

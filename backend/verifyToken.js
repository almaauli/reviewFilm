const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "rahasyaaja";

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("Token diterima:", authHeader);

  if (!authHeader) {
    return res.status(403).json({ message: "Akses ditolak, token tidak ditemukan!" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token tidak valid!" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Token tidak valid:", err);
      return res.status(401).json({ message: "Token tidak valid!" });
    }

    req.user = decoded;
    req.userId = decoded.userId;
    req.role = decoded.role;

    console.log("User ID:", req.userId, "Role:", req.role);

    next();
  });
};

module.exports = verifyToken;

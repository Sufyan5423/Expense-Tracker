// 1️⃣ IMPORT MODULES
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db.cjs"); // make sure db.cjs exists

// 2️⃣ INIT EXPRESS APP
const app = express();

// 3️⃣ MIDDLEWARE
app.use(cors());
app.use(bodyParser.json()); // parse JSON requests

// 4️⃣ SIGNUP ROUTE
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Signup failed" });
    }
    res.json({ success: true, message: "Signup successful" });
  });
});

// 5️⃣ LOGIN ROUTE
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Login failed" });
    }

    if (result.length > 0) {
      res.json({ success: true, user: result[0] });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// 6️⃣ START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

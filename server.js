const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'jobappuser',
  password: 'securepassword',
  database: 'jobappdb',
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF files are allowed'));
  },
});

// Create uploads directory
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Form submission endpoint
app.post(
  '/api/apply',
  upload.single('resume'),
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, position } = req.body;
    const resumePath = req.file ? req.file.path : null;

    try {
      const [result] = await pool.query(
        'INSERT INTO applications (full_name, email, position, resume_path) VALUES (?, ?, ?, ?)',
        [fullName, email, position, resumePath]
      );
      res.json({ message: 'Application submitted successfully', id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  }
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.static('public'));

// =====================================================
// DELETE registration
// =====================================================
app.post('/delete-registration', async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    await pool.query(
      `DELETE FROM registrations WHERE user_id=$1 AND event_id=$2`,
      [userId, eventId]
    );

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// =====================================================
// GET user’s registered events
// =====================================================
app.get('/my-registrations/:userId', async (req, res) => {
  const { userId } = req.params;

  const result = await pool.query(`
    SELECT events.id, events.title
    FROM registrations
    JOIN events ON events.id = registrations.event_id
    WHERE registrations.user_id = $1
  `, [userId]);

  res.json(result.rows);
});

// =====================================================
// AUTH: REGISTER USER
// =====================================================
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1,$2,$3)',
    [name, email, hashed]
  );

  res.json({ message: 'Signup successful' });
});

// =====================================================
// AUTH: LOGIN
// =====================================================
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );

  const user = result.rows[0];

  if (!user) return res.status(400).send('No user');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send('Wrong password');

  res.json(user);
});


// =====================================================
// EVENTS: CREATE (ADMIN ONLY)
// =====================================================
app.post('/create-event', async (req, res) => {
  const { title, description, date, adminId } = req.body;

  await pool.query(
    'INSERT INTO events (title, description, date, created_by) VALUES ($1,$2,$3,$4)',
    [title, description, date, adminId]
  );

  res.json({ message: 'Event created' });
});


// =====================================================
// EVENTS: LIST ALL
// =====================================================
app.get('/events', async (req, res) => {
  const result = await pool.query('SELECT * FROM events');
  res.json(result.rows);
});

// =====================================================
// EVENTS: MY EVENTS
// =====================================================
app.get('/my-events/:userId', async (req, res) => {
  const userId = req.params.userId;

  const result = await pool.query(`
    SELECT events.* FROM events
    JOIN registrations ON events.id = registrations.event_id
    WHERE registrations.user_id = $1
  `, [userId]);

  res.json(result.rows);
});

// =====================================================
// REGISTER FOR EVENT
// =====================================================
app.post('/register-event', async (req, res) => {
  const { userId, eventId, fullName, collegeId } = req.body;

  await pool.query(
    `INSERT INTO registrations (user_id, event_id, full_name, college_id)
     VALUES ($1, $2, $3, $4)`,
    [userId, eventId, fullName, collegeId]
  );

  res.json({ message: 'Registered' });
});
// =====================================================
// TEST ROUTE (DB)
// =====================================================
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// =========================
// TEST: Get all registrations
// =========================
app.get('/all-registrations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.email, events.title, registrations.full_name, registrations.college_id
      FROM registrations
      JOIN users ON users.id = registrations.user_id
      JOIN events ON events.id = registrations.event_id
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// =====================================================
// VIEW USER REGISTRATIONS
// =====================================================
app.get('/my-registrations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(`
      SELECT events.* FROM events
      JOIN registrations ON events.id = registrations.event_id
      WHERE registrations.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// START SERVER
// =====================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

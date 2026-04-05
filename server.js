// Import required libraries
const express = require('express'); // Web framework for routing
const bcrypt = require('bcrypt');   // Library for hashing passwords
const { Firestore } = require('@google-cloud/firestore'); // Firestore client

// Initialize app and database
const app = express();
const db = new Firestore({
  databaseId: 'data-registrations'
}); // Auth handled automatically in Cloud Run

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve frontend files

// =========================
// ROUTE: User Registration
// =========================
app.post('/register', async (req, res) => {
  try {
    // Extract user input
    const { name, email, password } = req.body;

    // =========================
    // HASHING PASSWORD
    // =========================
    // Never store raw password
    const saltRounds = 10; // Cost factor
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // =========================
    // STORE IN FIRESTORE
    // =========================
    await db.collection('users').add({
      name,
      email,
      password: hashedPassword, // Store hashed password only
      createdAt: new Date()
    });

    // Send response
    res.send({ message: 'User registered securely!' });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).send({ error: error.message });
  }
});

// =========================
// ROUTE: Get All Users (DEBUG)
// =========================
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
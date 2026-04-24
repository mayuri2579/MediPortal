const express = require('express');
const cors = require('cors');
const pool = require('./db.cjs');

const app = express();

// CORS ka updated setup - Isko exact aise hi copy karo
app.use(cors({
    origin: "*", // Har jagah se request allow karega
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Ye test route ab "Cannot GET /" ki jagah ye message dikhayega
app.get('/', (req, res) => {
    res.send("✅ Backend Server is Live and Connected!");
});

app.post('/api/register', async (req, res) => {
  const client = await pool.connect();
  try {
    const data = req.body;
    await client.query('BEGIN'); 

    // Patients Table
    const patientQuery = `
      INSERT INTO patients (first_name, last_name, dob, gender, email, phone)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING patient_id`;
    
    const patientRes = await client.query(patientQuery, [
      data.firstName, data.lastName, data.dob, data.gender, data.email, data.phone
    ]);
    const patientId = patientRes.rows[0].patient_id;

    // Emergency Contact
    await client.query(
      `INSERT INTO emergency_contacts (patient_id, contact_name, relationship, phone) 
       VALUES ($1, $2, $3, $4)`,
      [patientId, data.emergencyName, data.emergencyRelationship, data.emergencyPhone]
    );

    await client.query('COMMIT'); 
    res.status(201).json({ success: true, message: "Registered!" });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
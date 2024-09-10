const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Report = require('../backend/Models/report');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://sambag2:lKpzO65WP0DDop0j@sambag2.vgrfp.mongodb.net/Reports?retryWrites=true&w=majority&appName=Sambag2')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


  // Route to handle creating a new report
app.post('/report', async (req, res) => {
  const { reportId, name, contact, imageUrl } = req.body;
  
  if (!reportId || !name || !contact || !imageUrl) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    const result = await handleDatabaseOperation(async (database) => {
      const collection = database.collection('report'); // Collection name
      return await collection.insertOne({ reportId, name, contact, imageUrl });
    });
    
    res.status(201).json({ message: 'Report created', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error inserting document' });
  }
});
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
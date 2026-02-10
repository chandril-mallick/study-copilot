const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/study-planner', require('./routes/studyPlannerRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

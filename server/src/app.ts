import express from 'express';
import cors from 'cors'; // Add this import
import connectDB from './config/db';
import setUserRoutes from './routes/userRoutes';

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Connect to the database
connectDB();

app.get('/', (req, res) => {
  res.redirect('/api');
});

// Set up user routes
app.use('/api', setUserRoutes(app)); // Mount routes under /api

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
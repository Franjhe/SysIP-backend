import express from 'express';
import dotenv from 'dotenv/config';
import v1AuthRouter from './v1/routes/authRoutes.js';

const app = express(); 
dotenv;

app.use(express.json());

app.use("/api/v1/auth", v1AuthRouter);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => { 
  console.log(`\n API is listening on port ${PORT}`);
});
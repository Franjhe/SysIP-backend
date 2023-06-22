import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import authenticate from './middlewares/authenticate.js'
import v1AuthRouter from './v1/routes/authRoutes.js';
import v1TradeRouter from './v1/routes/tradeRoutes.js';

const app = express(); 
dotenv;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v1/trade", authenticate, v1TradeRouter);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => { 
  console.log(`\n API is listening on port ${PORT}`);
});
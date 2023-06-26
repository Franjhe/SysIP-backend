import express from 'express';
import tradeController from '../../controllers/tradeController.js';

const router = express.Router();

router

    .post("/search", tradeController.getAllTrade);

export default router;
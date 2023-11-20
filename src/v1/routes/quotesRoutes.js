import express from 'express';
import quotesController from '../../controllers/quotesController.js';

const router = express.Router();

router

    .post("/automobile/create",  quotesController.createQuotes)

export default router;
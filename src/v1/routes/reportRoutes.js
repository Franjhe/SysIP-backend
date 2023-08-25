import express from 'express';
import reportController from '../../controllers/ninjaParkController.js';

const router = express.Router();

router

    .post("/search",  reportController.searchPremiums)

export default router;
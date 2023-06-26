import express from 'express';
import valrepController from '../../controllers/valrepController.js';

const router = express.Router();

router

    .post("/trade", valrepController.getTrade)
    .post("/coin", valrepController.getCoin)
    .post("/client", valrepController.getClient)
    .post("/brockers", valrepController.getBrokers)

export default router;
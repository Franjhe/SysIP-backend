import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import valrepController from '../../controllers/valrepController.js';

const router = express.Router();

router

    .post("/trade", authenticate, valrepController.getTrade)
    .post("/coin", authenticate, valrepController.getCoin)
    .post("/client", authenticate, valrepController.getClient)
    .post("/brockers", authenticate, valrepController.getBrokers)

export default router;
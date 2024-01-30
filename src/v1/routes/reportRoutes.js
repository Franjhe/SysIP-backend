import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import reportController from '../../controllers/reportController.js';

const router = express.Router();

router

    .post("/search",  reportController.searchPremiums)
    .post("/receipt", reportController.searchReceipt)

export default router;
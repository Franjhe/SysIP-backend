import express from 'express';
import certificateController from '../../controllers/certificateController.js';

const router = express.Router();

router

    .get("/search",  certificateController.searchCertificate)
    .post("/detail",  certificateController.detailCertificate)

export default router;
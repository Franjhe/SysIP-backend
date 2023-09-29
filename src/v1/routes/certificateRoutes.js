import express from 'express';
import certificateController from '../../controllers/certificateController.js';

const router = express.Router();

router

    .get("/search",  certificateController.searchCertificate)

export default router;
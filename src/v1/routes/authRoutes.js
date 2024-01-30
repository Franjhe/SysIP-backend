import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import authController from '../../controllers/authController.js';

const router = express.Router();

router

    .post("/signIn", authController.createJWT)
    .post("/user-modules", authController.getUserModules)
    .post("/user-brokerphp", authController.createJWTPHP)

export default router;
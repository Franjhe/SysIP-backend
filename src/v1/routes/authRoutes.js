import express from 'express';
import authController from '../../controllers/authController.js';

const router = express.Router();

router

    // .post("/signIn", authController.createJWT)

    .post("/user-modules", authenticate, authController.getUserModules)

export default router;
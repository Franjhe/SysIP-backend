import express from 'express';
import menuController from '../../controllers/menuController.js';

const router = express.Router();

router

    .post("/get-menu", menuController.getAllMenu);

export default router;
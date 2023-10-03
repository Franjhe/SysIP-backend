import express from 'express';
import consulPagosController from '../../controllers/consulPagosController.js';

const router = express.Router();

router

    .post("/create",  consulPagosController.createUsersFromConsulPagos)

export default router;
import express from 'express';
import ninjaParkController from '../../controllers/ninjaParkController.js';

const router = express.Router();

router

    .post("/create", ninjaParkController.createUsersFromNinja)
    // .post("/coin",   ninjaParkController.getCoin)

export default router;
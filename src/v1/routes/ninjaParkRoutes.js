import express from 'express';
import ninjaParkController from '../../controllers/ninjaParkController.js';

const router = express.Router();

router

    .post("/create",  ninjaParkController.createUsersFromNinja)
    .post("/search",  ninjaParkController.searchUsersFromNinja)
    .post("/detail",  ninjaParkController.detailUsersFromNinja)

export default router;
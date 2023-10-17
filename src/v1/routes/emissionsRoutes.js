import express from 'express';
import emissionsController from '../../controllers/emissionsController.js';

const router = express.Router();

router

    .post("/automobil/hull-price",  emissionsController.searchHullPrice)
    .post("/automobil/premium-amount",  emissionsController.executePremiumAmount)
    .post("/automobil/create",  emissionsController.createIndividualContract)
    .post("/automobil/search",  emissionsController.searchAllContract)

export default router;
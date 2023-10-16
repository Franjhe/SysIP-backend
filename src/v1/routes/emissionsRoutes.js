import express from 'express';
import emissionsController from '../../controllers/emissionsController.js';

const router = express.Router();

router

    .post("/automobil/hull-price",  emissionsController.searchHullPrice)
    .post("/automobil/premium-amount",  emissionsController.executePremiumAmount)

export default router;
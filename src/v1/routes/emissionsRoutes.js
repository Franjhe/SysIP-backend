import express from 'express';
import emissionsController from '../../controllers/emissionsController.js';

const router = express.Router();

router

    .post("/automobile/hull-price",  emissionsController.searchHullPrice)
    .post("/automobile/premium-amount",  emissionsController.executePremiumAmount)
    .post("/automobile/create",  emissionsController.createIndividualContract)
    .post("/automobile/search",  emissionsController.searchAllContract)
    .post("/automobile/propietary",  emissionsController.searchPropietary)
    .post("/automobile/vehicle",  emissionsController.searchVehicle)

export default router;
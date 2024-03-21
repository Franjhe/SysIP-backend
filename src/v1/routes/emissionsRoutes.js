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
    .post("/automobile/ubii/update",  emissionsController.updateUbii)
    .post("/automobile/riot-rate",  emissionsController.searchRiotRate)
    .post("/automobile/group",  emissionsController.createGroupContract)
    .post("/automobile/search-quote",  emissionsController.searchQuotes)
    .post("/automobile/search-rates",  emissionsController.searchRates)

    //emissions generic
    .post("/health",  emissionsController.createEmmisionHealthGeneric)
    .post("/health-Paralife",  emissionsController.createEmmisionHealthParalife)
    .post("/automovile",  emissionsController.createEmmisionAutomovileGeneric)



export default router;
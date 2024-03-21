import express from 'express';
import virtualAssistantController from '../../controllers/virtualAssistantController.js'

const router = express.Router();

router

    .get("/client/:id",  virtualAssistantController.searchClient)
    .post("/service/",  virtualAssistantController.searchClient)
    .post("/service/arys/",  virtualAssistantController.searchClient)

export default router;
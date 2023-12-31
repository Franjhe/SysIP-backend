import express from 'express';
import quotesController from '../../controllers/quotesController.js';

const router = express.Router();

router

    .post("/automobile/create",  quotesController.createQuotes)
    .post("/automobile/update",  quotesController.updateQuotes)
    .post("/automobile/search-coverages",  quotesController.searchCoverages)
    .post("/automobile/detail",  quotesController.detailQuotes)
    .post("/automobile/detail-automobile",  quotesController.detailQuotesAutomobile)
    .post("/automobile/search-quotes",  quotesController.searchQuotes)

export default router;
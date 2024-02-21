import express from 'express';
import quotesController from '../../controllers/quotesController.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json({ limit: '10mb' });

const router = express.Router();

router

    .post("/automobile/create",  quotesController.createQuotes)
    .post("/automobile/update",  quotesController.updateQuotes)
    .post("/automobile/search-coverages",  quotesController.searchCoverages)
    .post("/automobile/detail",  quotesController.detailQuotes)
    .post("/automobile/detail-automobile",  quotesController.detailQuotesAutomobile)
    .post("/automobile/search-quotes",  quotesController.searchQuotes)
    .post("/automobile/send-email", jsonParser,  quotesController.sendEmail)
    .post("/automobile/update-premiums",  quotesController.updatePremiums)

export default router;
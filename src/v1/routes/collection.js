import express from 'express';
import collectionController from '../../controllers/collectionController.js'

const router = express.Router();

router

    .post("/search",  collectionController.searchCollectionbyClient)
    .post("/create",  collectionController.createPaymentReport)
    .get("/search-notification",  collectionController.searchPaymentReportNotification)
    .get("/search-pending",  collectionController.searchPaymentPending)
    .get("/search-payments-collected",  collectionController.PaymentsCollected)

export default router;
import express from 'express';
import collectionController from '../../controllers/collectionController.js'

const router = express.Router();

router

    .post("/search",  collectionController.searchCollectionbyClient)
    .post("/create-trans",  collectionController.createPaymentReporTrans) 
        
    .get("/search-notification",  collectionController.searchPaymentReportNotification)
    .get("/search-pending",  collectionController.searchPaymentPending)
    .get("/search-payments-collected",  collectionController.PaymentsCollected)
    .get("/search-vencido",  collectionController.searchPaymentVencin)
    .get("/search-collected/:id",  collectionController.searchPaymentCollected)

    .post("/receipt-under-review",  collectionController.receiptUnderReview)
    .get("/search-difference-of-notification",  collectionController.differenceOfNotification) 
    .patch("/update-difference-of-notification",  collectionController.updateDifferenceOfNotification) 

    //busquedas de notificaciones
    .patch("/update-receipt/",  collectionController.updateReceipt)
    .get("/search-receipt-data/:id",  collectionController.searchReceiptClient)
    .get("/search-client/:id",  collectionController.searchClient)


export default router;
import express from 'express';
import collectionController from '../../controllers/collectionController.js'

const router = express.Router();

router

    .post("/search",  collectionController.searchCollectionbyClient)
    .post("/create-trans",  collectionController.createPaymentReporTrans) //creacion del movimiento de transaccion del reporte de pago
    .post("/create-report",  collectionController.createPaymentReportSoport) //abjuncion de las imagenes para el transaccion del reporte de pago
    .get("/search-notification",  collectionController.searchPaymentReportNotification)
    .get("/search-pending",  collectionController.searchPaymentPending)
    .get("/search-payments-collected",  collectionController.PaymentsCollected)
    .get("/search-vencido",  collectionController.searchPaymentVencin)
    .get("/search-collected",  collectionController.searchPaymentCollected)

    .post("/receipt-under-review",  collectionController.receiptUnderReview) //abjuncion de las imagenes para el transaccion del reporte de pago
    .get("/search-difference-of-notification",  collectionController.differenceOfNotification) //abjuncion de las imagenes para el transaccion del reporte de pago
    .patch("/update-difference-of-notification",  collectionController.updateDifferenceOfNotification) 


    //busquedas de notificaciones
    .get("/search-notification-data/:id",  collectionController.searchPaymentReportNotificationData)
    .patch("/update-receipt/",  collectionController.updateReceipt)
    .get("/search-receipt-data/:id",  collectionController.searchReceiptClient)
    .get("/search-client/:id",  collectionController.searchClient)




export default router;
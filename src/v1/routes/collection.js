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

    //busquedas de notificaciones
    .get("/search-notification-data/:id",  collectionController.searchPaymentReportNotificationData)
    .patch("/update-receipt/",  collectionController.updateReceipt)


export default router;
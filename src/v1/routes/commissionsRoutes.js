import express from 'express';
import commissionsController from '../../controllers/commissionsController.js'

import fileExtension from 'file-extension';
import multer from 'multer';


const DOCUMENTS_PATH = './public/documents'; 

const document_storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DOCUMENTS_PATH);
    },
  
    filename: (req, file, cb) => {
        console.log(file, req)
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname));
    }
});
  
let document_upload = multer({
    storage: document_storage,
    limits: {
    fileSize: 5000000
    },
    fileFilter(req, file, cb) {
    cb(null, true);
    }
    
});

const router = express.Router();

router

    .post("/",  commissionsController.searchCualquierData)
    .post("/search",  commissionsController.searchComisionesProductores)
    .post("/search-insurerCommissions/",  commissionsController.searchInsurerCommissions)//creacion del movimiento de transaccion del reporte de pago
    .post("/search-data/:id",  commissionsController.searchDataProductor) //abjuncion de las imagenes para el transaccion del reporte de pago
    
    .post("/search-paymentRequests",  commissionsController.searchPaymentRequests)
    .post("/detail-paymentRequests/:id",  commissionsController.searchComisionesProductores)
    .post("/create-paymetRequests",  commissionsController.createPaymentRequests)
    .post("/pay-paymetRequests",  commissionsController.payPaymentRequests)
    //api de carga de transacciones 
    
    // .post("/create-notification-movement", document_upload.single('file'), commissionsController.createNotificationMovement   ) //creacion del movimiento de transaccion del reporte de pago


    
    // .get("/search-notification",  commissionsController.searchPaymentReportNotification)
    // .get("/search-pending",  commissionsController.searchPaymentPending)
    // .get("/search-payments-collected",  commissionsController.PaymentsCollected)
    // .get("/search-vencido",  commissionsController.searchPaymentVencin)
    // .get("/search-collected",  commissionsController.searchPaymentCollected)

    // .post("/receipt-under-review",  commissionsController.receiptUnderReview) //abjuncion de las imagenes para el transaccion del reporte de pago
    // .get("/search-difference-of-notification",  commissionsController.differenceOfNotification) //abjuncion de las imagenes para el transaccion del reporte de pago
    // .patch("/update-difference-of-notification",  commissionsController.updateDifferenceOfNotification) 


    // //busquedas de notificaciones
    // .get("/search-notification-data/:id",  commissionsController.searchPaymentReportNotificationData)
    // .patch("/update-receipt/",  commissionsController.updateReceipt)
    // .get("/search-receipt-data/:id",  commissionsController.searchReceiptClient)
    // .get("/search-client/:id",  commissionsController.searchClient)




export default router;
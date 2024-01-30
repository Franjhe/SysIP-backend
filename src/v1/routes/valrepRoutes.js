import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import valrepController from '../../controllers/valrepController.js';

const router = express.Router();

router

    .get("/trade",valrepController.getTrade)
    .get("/coin", valrepController.getCoin)
    .post("/client", valrepController.getClient)
    .post("/brokers", valrepController.getBrokers)
    .post("/departament", valrepController.getDepartament)
    .post("/rol", valrepController.getRol)
    .post("/main-menu", valrepController.getMainMenu)
    .post("/menu", valrepController.getMenu)
    .post("/submenu", valrepController.getSubMenu)
    .post("/user", valrepController.getUser)
    .post("/park", valrepController.getPark)
    .post("/state", valrepController.getState)
    .post("/city", valrepController.getCity)
    .post("/brand", valrepController.getBrand)
    .post("/model", valrepController.getModel)
    .post("/version", valrepController.getVersion)
    .post("/color", valrepController.getColor)
    .post("/rates", valrepController.getRates)
    .post("/type-vehicle", valrepController.getTypeVehicle)
    .post("/utility-rechange", valrepController.getUtilityRechange)
    .post("/utility", valrepController.getUtility)
    .post("/class", valrepController.getClass)
    .post("/plan", valrepController.getPlan)
    .post("/accesories", valrepController.getAccesories)
    .post("/method-of-payment", valrepController.getMethodOfPayment)
    .post("/takers", valrepController.getTakers)
    .post("/type-of-payment", valrepController.getTypeOfPayment)
    .post("/bank",  valrepController.getBank)
    .post("/target-bank",  valrepController.getTargetBank)
    
export default router;
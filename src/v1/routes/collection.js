import express from 'express';
import collectionController from '../../controllers/collectionController.js'

const router = express.Router();

router

    .post("/search",  collectionController.searchCollectionbyClient)

export default router;
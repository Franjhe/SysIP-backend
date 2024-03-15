import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import authenticate from './middlewares/authenticate.js'
import v1AuthRouter from './v1/routes/authRoutes.js';
import v1TradeRouter from './v1/routes/tradeRoutes.js';
import v1MenuRouter from './v1/routes/menuRoutes.js';
import v1ValrepRouter from './v1/routes/valrepRoutes.js';
import v1SecurityRouter from './v1/routes/securityRoutes.js';
import v1NinjaParkRouter from './v1/routes/ninjaParkRoutes.js';
import v1ReportRouter from './v1/routes/reportRoutes.js';
import v1ConsulPagosRouter from './v1/routes/consulPagosRoutes.js';
import viCertificated from './v1/routes/certificateRoutes.js'
import v1EmissionsRouter from './v1/routes/emissionsRoutes.js';
import v1QuotesRouter from './v1/routes/quotesRoutes.js';
import v1Collection from './v1/routes/collection.js'
import v1Commissions from './v1/routes/commissionsRoutes.js'
import fileExtension from 'file-extension';
import multer from 'multer';
const { diskStorage } = multer;

const app = express(); 
dotenv;

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v1/trade", v1TradeRouter);
app.use("/api/v1/menu", v1MenuRouter);
app.use("/api/v1/valrep", v1ValrepRouter);
app.use("/api/v1/security", v1SecurityRouter);
app.use("/api/v1/ninjaPark", v1NinjaParkRouter);
app.use("/api/v1/report", v1ReportRouter);
app.use("/api/v1/consul-pagos", v1ConsulPagosRouter);
app.use("/api/v1/certificate", viCertificated);
app.use("/api/v1/emissions", v1EmissionsRouter);
app.use("/api/v1/quotes", v1QuotesRouter);
app.use("/api/v1/collection", v1Collection);
app.use("/api/v1/commissions", v1Commissions);

const PORT = process.env.PORT || 3000; 

const DOCUMENTS_PATH = './public/documents';

app.get('/api/get-document/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DOCUMENTS_PATH, filename);
  const absolutePath = path.resolve(filePath);

  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: 'Archivo no encontrado' });
    } else {
      res.sendFile(absolutePath);
    }
  });
});

app.listen(PORT, () => { 
  console.log(`\n API is listening on port ${PORT}`);
});

const document_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOCUMENTS_PATH);
  },

  filename: (req, file, cb) => {
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

app.post('/api/upload/documents', document_upload.array('xdocumentos', 5), (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    const error = new Error('Please upload at least one file');
    error.httpStatusCode = 400;
    console.log(error.message)
    return res.status(400).json({ data: { status: false, code: 400, message: error.message } });
  }

//   const uploadedFiles = files.map(file => ({ filename: file.filename }));

  res.json({ data: { status: true, uploadedFile: files } });
});

app.post('/api/upload/image', document_upload.single('file'),(req, res , err) => {
  const files = req.file;
  if (!files || files.length === 0) {
    const error = new Error('Please upload at least one file');
    error.httpStatusCode = 400;

    return res.status(400).json({  status: false, code: 400, message: error.message  });
  }

  res.json({  status: true, uploadedFile: files  });
});
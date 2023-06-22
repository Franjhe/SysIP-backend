import * as express from 'express';
import v1AuthRouter from './v1/routes/authRoutes.js';

const app = express(); 

app.use(express.json());

app.use("/api/v1/auth", v1AuthRouter);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => { 
  console.log(`\n API is listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});
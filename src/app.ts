/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import { getImages } from './app/utils/ImageController';

const app: Application = express();

app.use(
  cors({
    origin: [
      'https://appspectra.cloud',
      'https://federico-dashboard-tx1e.vercel.app',
      'http://10.10.7.48:3003',
      'http://10.10.7.46:3003',
      'https://federico-dashboard.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'authorization',
      'ngrok-skip-browser-warning',
      'resettoken',
    ],
  }),
);

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

getImages(app);
// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  res.send(`<h1 style="text-align:center; color:#173616; font-family:Verdana;">Beep-beep! The server is alive and kicking.</h1>
    <p style="text-align:center; color:#173616; font-family:Verdana;">${date}</p>
    `);
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;

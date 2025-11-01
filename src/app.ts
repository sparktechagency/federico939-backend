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

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

app.use(
  cors({
    origin: [
      'http://10.10.7.102:3003',
      'https://federico-dashboard-tx1e.vercel.app',
      'https://appspectra.cloud',
    ],
    credentials: true,
  }),
);

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

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

// core middleWare
app.use(cors());
app.use(bodyParser.json());

// function import
import connectToDatabase from './database/db.js';

// middleware import
import { errorHandler, notFound } from './middleware/common/errorHandler.js';
// route import
import homeRoute from './routes/v1/home.router.js';
import amazonProductList from './routes/v1/amazonProductList.router.js';
import userPost from './routes/v1/creareUser.router.js';
import productDetails from './routes/v1/amazonproductDetails.router.js';
import productList1688V3 from './routes/v3/productList1688.router.js';

// database connection
app.use(async (req, res, next) => {
  try {
    req.db = await connectToDatabase();
    next();
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// route
app.use('/', homeRoute);
app.use('/v1/itc/user', userPost);
app.use('/v1/itc/amazon', amazonProductList);
app.use('/v1/itc/amazon/product-details', productDetails);
app.use('/v3/itc/1688/product-list', productList1688V3);

// 404 not found handelar
app.use(notFound);
//common error handdaling
app.use(errorHandler);

app.listen(port, () => {
  console.log('server is running ...', port);
});

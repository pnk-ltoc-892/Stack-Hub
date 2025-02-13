import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

dotenv.config({path: './.env'})

mongoose
    .connect(`${process.env.MONGOBD_URI}/ecom`)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));


const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
// console.log(process.env.CORS_ORIGIN);

// app.use(
//     cors({
//         origin: "*",
//         methods: ["GET", "POST", "DELETE", "PUT"],
//         allowedHeaders: [
//             "Content-Type",
//             "Authorization",
//             "Cache-Control",
//             "Expires",
//             "Pragma",
//         ],
//         credentials: true,
//     })
// );

app.use(cookieParser());
app.use(express.json());


import userRouter from './routes/user.routes.js'
import adminProductsRouter from './routes/admin/products.routes.js'
import adminOrderRouter from './routes/admin/order.routes.js'

import shopProductsRouter from './routes/shop/products.routes.js'
import shopCartRouter from './routes/shop/cart.routes.js'
import shopAddressRouter from './routes/shop/address.routes.js'
import shopOrderRouter from './routes/shop/order.routes.js'
import shopSearchRouter from './routes/shop/search.routes.js'
import shopReviewRouter from './routes/shop/review.routes.js'
import commonFeatureRouter from './routes/common/feature.routes.js'


app.use('/api/v1/user/', userRouter)

app.use('/api/v1/admin/products', adminProductsRouter)

app.use('/api/v1/admin/orders', adminOrderRouter)

// -----------------------------------------------------------------

app.use('/api/v1/shop/products', shopProductsRouter)

app.use('/api/v1/shop/cart', shopCartRouter)

app.use('/api/v1/shop/address', shopAddressRouter)

app.use('/api/v1/shop/order', shopOrderRouter)

app.use('/api/v1/shop/search', shopSearchRouter)

app.use('/api/v1/shop/review', shopReviewRouter)

app.use("/api/v1/common/feature", commonFeatureRouter);


app.get('/', async (req, res) => {
    res.send("Server is running");
});



app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
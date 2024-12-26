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


app.use('/api/v1/user/', userRouter)

app.use('/api/v1/admin/products', adminProductsRouter)


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
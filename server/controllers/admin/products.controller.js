import { Product } from "../../models/Product.js";
import { uploadOnCloudinary } from "../../services/cloudinary.js";


const handleImageUpload = async (req, res) => {
    try {
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) {
            res.json({
                success: false,
                message: "Error occured Uploading Image on cloudinary",
            });
        }
        const result = await uploadOnCloudinary(avatarLocalPath);
        res.json({
            success: true,
            result: result,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error occured Uploading Image on cloudinary",
        });
    }
}

//add a new product
const addNewProduct = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        } = req.body;
        // console.log(averageReview, "averageReview");

        const newProduct = await Product.create({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        });

        res.status(201).json({
            success: true,
            data: newProduct,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

//edit a product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        } = req.body;

        // ! Another Way of Updating a Product Data
        let findProduct = await Product.findById(id);
        if (!findProduct)
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.salePrice =
        salePrice === "" ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.averageReview = averageReview || findProduct.averageReview;
        
        // ! Make a Separate FOr Updating Image ??  or how to do it in in edit only ?
        findProduct.image = image || findProduct.image;

        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

//delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // ! check if product actually exist 
        const product = await Product.findByIdAndDelete(id);

        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        res.status(200).json({
            success: true,
            message: "Product delete successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};


//fetch all products
const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success: true,
            data: listOfProducts,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

export {
    handleImageUpload,
    addNewProduct,
    editProduct,
    deleteProduct,
    fetchAllProducts
}
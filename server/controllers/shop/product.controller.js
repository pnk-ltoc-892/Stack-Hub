import { Product } from "../../models/Product.js";


const getFilteredProducts = async (req, res) => {
    try {
        // const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
        // let filters = {};

        // if (category) query.category = category;
        // if (price) query.price = { $lte: price };
        // if (rating) query.rating = { $gte: rating };
        // if (color) query.color = color;
        // if (brand) query.brand = brand;

        const products = await Product.find({});

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
}


const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product not found!",
            });

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

export {
    getFilteredProducts,
    getProductDetails,

}

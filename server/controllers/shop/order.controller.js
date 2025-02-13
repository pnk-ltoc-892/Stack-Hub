import { Order } from "../../models/Order.js";
import { Cart } from "../../models/Cart.js";
import { Product } from "../../models/Product.js";




// ! Only Creates Order - Not make it successfull or failed
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
        } = req.body;

        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: "http://localhost:5173/shop/paypal-return",
                cancel_url: "http://localhost:5173/shop/paypal-cancel",
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map((item) => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: "USD",
                            quantity: item.quantity,
                        })),
                    },
                    amount: {
                        currency: "USD",
                        total: totalAmount.toFixed(2),
                    },
                    description: "description",
                },
            ],
        };

        // paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        let error = false;
        if (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Error while creating paypal payment",
            });
        }

        const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
        });
        await newlyCreatedOrder.save();

        // const approvalURL = paymentInfo.links.find(
        //     (link) => link.rel === "approval_url"
        // ).href;

        // const approvalURL = "pay-success.com"
        const approvalURL = "http://localhost:5173/shop/paypal-return"

        res.status(201).json({
            success: true,
            approvalURL,
            orderId: newlyCreatedOrder._id,
            json: create_payment_json,
            data: newlyCreatedOrder,
        });

        // });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
}


const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order can not be found",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        // ! Update the stock of the products
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Not enough stock for this product ${product.title}`,
                });
            }
            product.totalStock -= item.quantity;
            await product.save();
        }

        // ! Delete the cart
        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        // ! Save the order
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId });

        if (!orders.length) {
            return res.status(200).json({
                success: false,
                message: "No orders found!",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};


export {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
}
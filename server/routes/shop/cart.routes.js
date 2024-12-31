
import {
    addToCart,
    fetchCartItems,
    deleteCartItem,
    updateCartItemQty,
} from "../../controllers/shop/cart.controller.js";

import { Router } from "express";

const router = Router();

router.post("/add", addToCart);

router.get("/get/:userId", fetchCartItems);

router.put("/update-cart", updateCartItemQty);

router.delete("/:userId/:productId", deleteCartItem);


export default router

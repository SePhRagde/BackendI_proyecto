import { Router } from "express";
import { CartsManager } from "../dao/managers/cartsManager.js";

const cartsManager = new CartsManager();
const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartsManager.createCart();
        res.status(201).send(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsManager.getCartById(cid);
        res.send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});


router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartsManager.addProductToCart(cid, pid);
        res.send(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

export default router;

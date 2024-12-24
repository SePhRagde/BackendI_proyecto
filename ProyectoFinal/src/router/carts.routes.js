import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";
import { productDao } from "../dao/mongoDao/product.dao.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({});
    res.json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: `Cart id ${cid} not found` });
    
    res.json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const findProduct = await productModel.findById(pid);
    if (!findProduct) return res.status(404).json({ status: "error", message: `Product id ${pid} not found` });

    const findCart = await cartModel.findById(cid);
    if (!findCart) return res.status(404).json({ status: "error", message: `Cart id ${cid} not found` });

    const product = findCart.products.find((productCart) => productCart.product.toString() === pid);
    if (!product) {
      findCart.products.push({ product: pid, quantity: 1 });
    } else {
      product.quantity++;
    }

    const updatedCart = await cartModel.findByIdAndUpdate(cid, { products: findCart.products }, { new: true });
    res.json({ status: "ok", payload: updatedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) return res.status(404).json({ status: "error", message: `Product id ${pid} not found` });

    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart id ${cid} not found` });

    const cartUpdated = await cartDao.deleteProductInCart(cid, pid);
    res.json({ status: "ok", payload: cartUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: "error", message: "Quantity must be greater than 0" });
    }

    const product = await productDao.getById(pid);
    if (!product) return res.status(404).json({ status: "error", message: `Product id ${pid} not found` });

    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart id ${cid} not found` });

    const cartUpdated = await cartDao.updateProductInCart(cid, pid, quantity);
    res.json({ status: "ok", payload: cartUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart id ${cid} not found` });

    const cartUpdated = await cartDao.deleteProductsInCart(cid);
    res.json({ status: "ok", payload: cartUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;

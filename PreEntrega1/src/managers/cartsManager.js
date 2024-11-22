import fs from "fs";
import { v4 as uuid } from "uuid";

export class CartsManager {
    constructor() {
        this.path = "./src/managers/data/carts.json";
    }

    async getCarts() {
        try {
            const file = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(file);
            return carts || [];
        } catch (error) {
            console.error("Error leyendo el archivo de carritos:", error);
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: uuid(),
            products: [],
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado`);
        return cart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado`);

        const existingProduct = cart.products.find(product => product.product === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

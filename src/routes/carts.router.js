// Express
import { Router } from "express";
const carts = Router();

// Managers
import CartsManager from "../managers/carts.manager.js";
const cartsManager = new CartsManager("carts");
import ProductsManager from "../managers/products.manager.js";
const productsManager = new ProductsManager("products");

// Endpoint para agregar un carrito:
carts.post("/", async (req, res) => {
	try {
		const postResponse = cartsManager.addCart();
		return res.status(200).send(postResponse);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para buscar un carrito por ID:
carts.get("/:cid", async (req, res) => {
	try {
		// Tomar ID, convertirlo en entero y buscar carrito:
		const { cid } = req.params;
		const cartId = parseInt(cid);

		// Obtener y devolver carrito actualizado:
		const cart = await cartsManager.getCartById(cartId);
		return res.status(200).json(cart);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para agregar un producto a un carrito:
carts.post("/:cid/product/:pid", async (req, res) => {
	try {
		// Tomar IDs, convertirlos en entero y agregar producto al carrito:
		const { cid, pid } = req.params;
		const cartId = parseInt(cid);
		const productId = parseInt(pid);

		// Validar producto:
		const product = productsManager.getProductById(productId);

		// Si no existe, devolver error:
		if (typeof product === "string") {
			return res.status(200).send(product);
		}

		// Si existe, agregar producto al carrito:
		cartsManager.addProductToCart(cartId, productId);

		// Obtener y devolver carrito actualizado:
		const cart = await cartsManager.getCartById(cartId);
		return res.status(200).json(cart);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para borrar un carrito:
carts.delete("/:cid/product/:pid", async (req, res) => {
	try {
		// Tomar IDs, convertirlos en entero y borrar carrito:
		const { cid, pid } = req.params;
		const cartId = parseInt(cid);
		const productId = parseInt(pid);

		// Borrar carrito y devolver respuesta:
		const deleteResponse = cartsManager.deleteCart(cartId, productId);
		return res.status(200).send(deleteResponse);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default carts;
import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import axios from "axios"

const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || "http://inventory-service:8080";

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        // Inside addProduct, after saving:
        const newId = product._id;
        await axios.post(`${INVENTORY_URL}/api/inventory/${newId}/initialize`, { stock: 50 });

        res.json({ success: true, message: "Product Added." })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {

        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed." })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)

        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        let stockData = { current_stock: 0, provider: "offline" };

        // 🔗 Call the Go Inventory Service
        try {
            const response = await axios.get(`${INVENTORY_URL}/api/inventory/${productId}`);
            stockData = response.data;
        } catch (goError) {
            console.error("⚠️ Inventory Service unreachable. Falling back to 0.");
        }

        // Merge the MongoDB data with the Go data
        const productWithInventory = {
            ...product._doc, // Spread the mongoose document
            stock: stockData.current_stock,
            stockStatus: stockData.provider
        }

        res.json({ success: true, product: productWithInventory })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }
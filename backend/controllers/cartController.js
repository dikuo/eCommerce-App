import userModel from "../models/userModel.js"

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const {userId, itemId, size} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        // 🟢 Using the nested structure: cartData[itemId][size]
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        // We use {cartData} because we are replacing the whole object
        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: "Added To Cart"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const {userId, itemId, size, quantity} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        // 🟢 Defensive check: Ensure the item exists before setting size
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // 🟢 Optimization: If quantity is 0, remove the size to keep DB clean
        if (quantity === 0) {
            delete cartData[itemId][size];
            
            // If that was the last size, remove the itemId entirely
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: "Cart Updated"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId)
        
        // Return empty object if cartData doesn't exist yet
        let cartData = userData.cartData || {};

        res.json({success: true, cartData})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {addToCart, updateCart, getUserCart}
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const shuffleStock = async () => {
    try {
        // 🟢 The Fix: Passing dbName explicitly overrides the URI's default
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'eCommerce' 
        });

        console.log("✅ Successfully connected to database:", mongoose.connection.name);

        const Product = mongoose.model('Product', new mongoose.Schema({
            stock: Number
        }, { collection: 'products' }));

        const products = await Product.find({});
        
        if (products.length === 0) {
            console.log("❌ Found 0 products in 'eCommerce.products'. Check your collection name.");
            return;
        }

        console.log(`📦 Found ${products.length} products. Shuffling...`);

        for (const product of products) {
            const randomStock = Math.floor(Math.random() * 51);
            await Product.updateOne({ _id: product._id }, { $set: { stock: randomStock } });
        }

        console.log("✨ Shuffle Complete! Check Atlas now.");
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
    }
};

shuffleStock();
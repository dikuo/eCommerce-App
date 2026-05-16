import app from './app.js'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

const port = process.env.PORT || 4000

// 🟢 We only connect to external services here
connectDB()
connectCloudinary()

// 🟢 We only start the listener here
app.listen(port, ()=> console.log("Server started on PORT: " + port));
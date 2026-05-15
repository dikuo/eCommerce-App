import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config - We initialize the app here
const app = express()

// Middlewares
app.use(express.json())
app.use(cors())

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res)=> {
    res.send('API Working.')
})

// 🟢 CRITICAL: Export the app so server.js AND Jest can use it
export default app;
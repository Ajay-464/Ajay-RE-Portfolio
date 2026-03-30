import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

//File imports
import testimonialModal from "./models/testimonials.js"

const app = express()

app.use(cors({
    origin: ["http://localhost:3000", "https://ajaysvj.me", "http://127.0.0.1:5500"],
    allowedHeaders: ["Content-Type"]
}))

dotenv.config()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.json("Server is running...")
})

app.post("/post-comment", async (req, res) => {
    try {
        const { name, company, rating, message, avatar } = req.body

        // Validate required fields
        if (!name || !rating || !message) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Name, rating, and message are required fields."
            })
        }

        // Create new testimonial document
        const newTestimonial = new testimonialModal({
            name,
            company,
            rating,
            message,
            avatar
        })

        // Save to MongoDB
        await newTestimonial.save()

        return res.status(201).json({
            success: true,
            message: "Testimonial saved successfully!",
            data: newTestimonial
        })

    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: err.message
        })
    }
})

app.get("/get-comments", async (req, res) => {
    try {
        const comments = await testimonialModal.find()
        return res.status(200).json({
            data: comments,
            error: false,
            success: true
        })
    } catch(err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: err.message
        })
    }
})

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("MongoDB Connected Successfully")
    } catch(err) {
        console.log(err)
    }
}

app.listen(5000, () => {
    connectDB();
    console.log("Server Running on port 5000");
})
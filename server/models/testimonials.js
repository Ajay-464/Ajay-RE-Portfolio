import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: String,
    company: String,
    rating: Number,
    message: String,
    avatar: String
})

const testimonialModal = new mongoose.model("testimonal", testimonialSchema);
export default testimonialModal
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    weddingDate: { type: String, required: true },
    note: { type: String },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
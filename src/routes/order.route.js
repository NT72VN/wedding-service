const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

/**
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới
 */
router.post("/", async (req, res, next) => {
    try {
        const order = new Order(req.body);
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/orders
 * @desc    Lấy tất cả đơn hàng (Admin)
 */
router.get("/", async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

/**
 * ✅ FIX LỖI "XEM CHI TIẾT"
 * @route   GET /api/orders/:id
 * @desc    Lấy chi tiết 1 đơn hàng theo ID
 */
router.get("/:id", async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy thông tin đơn hàng này"
            });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Cập nhật trạng thái đơn hàng
 */
router.put("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
});

module.exports = router;

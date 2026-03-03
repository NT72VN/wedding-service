const express = require("express");
const router = express.Router();
const { 
    createBooking, 
    getMyBookings, 
    updateBookingStatus 
} = require("../controllers/bookingController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Route cho người dùng (phải đăng nhập)
router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);

// Route cho Admin duyệt đơn
router.put("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;
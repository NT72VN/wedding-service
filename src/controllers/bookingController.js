const Booking = require("../models/Booking");
const Service = require("../models/Service");

// @desc    Tạo đơn đặt lịch mới
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { serviceId, weddingDate } = req.body;

        // 1. Kiểm tra xem dịch vụ (sản phẩm) có tồn tại không
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại" });
        }

        // 2. Tạo đơn đặt lịch
        const booking = await Booking.create({
            user: req.user._id, // Lấy từ protect middleware
            service: serviceId,
            weddingDate,
            totalPrice: service.price, // Lưu giá tại thời điểm đặt
            status: "pending"
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi đặt lịch", error: error.message });
    }
};

// @desc    Lấy danh sách đơn đặt lịch của người dùng hiện tại
// @route   GET /api/bookings/me
const getMyBookings = async (req, res) => {
    try {
        // Sử dụng populate để lấy chi tiết sản phẩm thay vì chỉ hiện ID
        const bookings = await Booking.find({ user: req.user._id })
            .populate("service", "name price category")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy dữ liệu", error: error.message });
    }
};

// @desc    Admin duyệt hoặc hủy đơn đặt lịch
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // status có thể là 'approved' hoặc 'cancelled'
        
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt lịch" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật trạng thái", error: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    updateBookingStatus
};
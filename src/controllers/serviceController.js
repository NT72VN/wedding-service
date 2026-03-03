const Service = require("../models/Service");

// @desc    Lấy danh sách tất cả sản phẩm
// @route   GET /api/services
const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: error.message });
    }
};

// @desc    Lấy chi tiết một sản phẩm theo ID
// @route   GET /api/services/:id
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(400).json({ message: "ID không hợp lệ" });
    }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/services
const createService = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;

        // Kiểm tra đầu vào bắt buộc
        if (!name || !price) {
            return res.status(400).json({ message: "Vui lòng nhập tên và giá sản phẩm" });
        }

        const newService = await Service.create({
            name,
            price,
            description,
            category,
            image
        });

        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: "Dữ liệu không hợp lệ", error: error.message });
    }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/services/:id
const updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật" });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi cập nhật", error: error.message });
    }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
        }
        res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi xóa", error: error.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
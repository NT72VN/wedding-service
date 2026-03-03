const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Đảm bảo đường dẫn này chính xác

/**
 * @route   GET /api/categories
 * @desc    Lấy tất cả loại sản phẩm
 */
router.get('/', async (req, res) => {
    try {
        // Kiểm tra xem Model có tồn tại và có hàm find không để tránh lỗi "is not a function"
        if (!Category || typeof Category.find !== 'function') {
            throw new Error('Model Category chưa được định nghĩa đúng chuẩn Mongoose');
        }

        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (err) {
        console.error('Lỗi GET /api/categories:', err.message);
        res.status(500).json({ message: 'Lỗi server: ' + err.message });
    }
});

/**
 * @route   GET /api/categories/:id
 * @desc    Lấy chi tiết một loại sản phẩm
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm này' });
        }
        res.status(200).json(category);
    } catch (err) {
        console.error('Lỗi GET /api/categories/:id:', err.message);
        res.status(500).json({ message: 'ID không hợp lệ hoặc lỗi server' });
    }
});

/**
 * @route   POST /api/categories
 * @desc    Thêm loại sản phẩm mới
 */
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!name) {
            return res.status(400).json({ message: 'Tên loại sản phẩm là bắt buộc' });
        }

        // Kiểm tra trùng tên
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Tên loại sản phẩm này đã tồn tại' });
        }

        const newCategory = new Category({ name, description });
        const savedCategory = await newCategory.save();

        res.status(201).json(savedCategory);
    } catch (err) {
        console.error('Lỗi POST /api/categories:', err.message);
        res.status(400).json({ message: 'Không thể thêm loại: ' + err.message });
    }
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Cập nhật loại sản phẩm
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true } // Trả về bản ghi mới và chạy kiểm tra Schema
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm để cập nhật' });
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        console.error('Lỗi PUT /api/categories/:id:', err.message);
        res.status(400).json({ message: 'Lỗi cập nhật: ' + err.message });
    }
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Xóa loại sản phẩm
 */
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm để xóa' });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa loại sản phẩm thành công' });
    } catch (err) {
        console.error('Lỗi DELETE /api/categories/:id:', err.message);
        res.status(500).json({ message: 'Lỗi server khi xóa: ' + err.message });
    }
});

module.exports = router;
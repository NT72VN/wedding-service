const express = require("express");
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require("../controllers/serviceController");

// Import middleware bảo mật
const { protect, admin } = require("../middlewares/authMiddleware");

// --- ROUTES CÔNG KHAI (Ai cũng có thể xem) ---
router.get("/", getServices);
router.get("/:id", getServiceById);

// --- ROUTES BẢO MẬT (Chỉ Admin có Token mới được làm) ---
// Yêu cầu: 1. Có Token (protect) | 2. Là Admin (admin)
router.post("/", protect, admin, createService);
router.put("/:id", protect, admin, updateService);
router.delete("/:id", protect, admin, deleteService);

module.exports = router;
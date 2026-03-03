const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/auth.controller");

// Các route cũ
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route mới cho tính năng quên mật khẩu
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
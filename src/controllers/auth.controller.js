const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// Cấu hình gửi mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// --- REGISTER & LOGIN ---
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email đã tồn tại" });
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
        }
    } catch (error) { res.status(500).json({ message: "Lỗi server khi đăng ký" }); }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
        } else { res.status(401).json({ message: "Sai email hoặc mật khẩu" }); }
    } catch (error) { res.status(500).json({ message: "Lỗi server khi đăng nhập" }); }
};

// --- QUÊN MẬT KHẨU ---
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ message: "Email không tồn tại" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút

        await user.save(); // Bây giờ sẽ lưu được vì đã có trong Schema

        const mailOptions = {
            from: `"DUC & CO. WEDDINGS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Mã OTP khôi phục mật khẩu",
            html: `<h3>Mã xác nhận của bạn là: <b style="color:red;">${otp}</b></h3>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Mã xác nhận đã gửi" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi gửi email" });
    }
};

// --- RESET MẬT KHẨU ---
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordToken: otp.toString().trim(),
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Mã xác nhận không đúng hoặc đã hết hạn" });
        }

        // Gán mật khẩu mới (Middleware .pre('save') ở Model sẽ tự động băm mật khẩu này)
        user.password = newPassword;

        // Xóa mã OTP
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đổi mật khẩu" });
    }
};
module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
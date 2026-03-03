const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: [true, "Vui lòng nhập tên"] },
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email không hợp lệ"]
        },
        password: { type: String, required: [true, "Vui lòng nhập mật khẩu"], minlength: 6 },
        isAdmin: { type: Boolean, required: true, default: false },
        // --- THÊM 2 TRƯỜNG NÀY ĐỂ FIX LỖI UNDEFINED ---
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    { timestamps: true }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    // Chỉ băm lại mật khẩu nếu trường password bị thay đổi
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User", userSchema);
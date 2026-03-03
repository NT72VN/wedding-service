const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Sửa lại đường dẫn cho đúng cấu trúc thư mục của bạn
const User = require("./src/models/User"); 
const Service = require("./src/models/Service");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("📦 Đã kết nối MongoDB để Seed dữ liệu"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

const seedData = async () => {
    try {
        // Xóa dữ liệu cũ để tránh trùng lặp Email
        await User.deleteMany();
        await Service.deleteMany();

        // Tạo tài khoản Admin chuẩn
        await User.create({
            name: "Admin Wedding",
            email: "admin2@gmail.com",
            password: "password123", // Hãy dùng mật khẩu này để đăng nhập Postman
            isAdmin: true // BẮT BUỘC phải là isAdmin để đúng với Middleware của bạn
        });

        // Thêm các dịch vụ mẫu
        await Service.insertMany([
            {
                name: "Gói cưới Basic",
                price: 10000000,
                description: "Trang trí cơ bản với cổng hoa và bàn gia tiên",
                category: "Decoration"
            },
            {
                name: "Gói cưới VIP",
                price: 30000000,
                description: "Trang trí cao cấp với hoa tươi nhập khẩu toàn bộ",
                category: "Decoration"
            }
        ]);

        console.log("✅ Seed dữ liệu thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi Seed dữ liệu:", error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedData();
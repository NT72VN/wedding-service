const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Vui lòng nhập tên dịch vụ/sản phẩm"] 
        },
        price: { 
            type: Number, 
            required: [true, "Vui lòng nhập giá tiền"],
            min: [0, "Giá tiền không được nhỏ hơn 0"]
        },
        description: { 
            type: String, 
            default: "" 
        },
        category: { 
            type: String, 
            default: "Wedding" 
        },
        image: { 
            type: String, 
            default: "https://via.placeholder.com/150" 
        }
    },
    { 
        timestamps: true // Tự động tạo createdAt và updatedAt
    }
);

/**
 * THAM SỐ THỨ 3 LÀ 'product':
 * Ép Mongoose kết nối đúng vào Collection có tên là 'product' trong Compass của bạn.
 */
module.exports = mongoose.model("Service", serviceSchema, "product");
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const allOrders = await Order.find();

        // Chỉ tính doanh thu từ các đơn hàng đã hoàn thành (completed)
        const totalRevenue = allOrders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Đếm đơn hàng đang chờ (pending)
        const pendingOrders = allOrders.filter(order => order.status === 'pending').length;

        // Tổng đơn hàng đã giao thành công
        const completedOrders = allOrders.filter(order => order.status === 'completed').length;

        res.json({
            totalProducts,
            totalOrders: completedOrders, // Khớp với "Đơn Đã Giao" trên giao diện
            pendingOrders,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
import Order from "../models/Orders.js";

export const createOrders = async(req,res)=>{
    try{
        const {items,shippingAddress,paymentInfo} = req.body;

        if(!items || items.length ==0) {
            return res.status(404).json({message:"no item"})
        }
        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        if(!req.user || ! req.user.userId){
            return res.status(404).json({success:"false",message:"not authorised"})
        }
        const order = await Order.create({
  userId: req.user.userId,
  items,
  shippingAddress,
  totalAmount,
  status: "Pending", // default
});

    
        res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


// GET /api/orders/my
// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate("items.productId", "title image category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Security check: user apna order dekh sake
    if (order.userId._id.toString() !==  req.user.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import Address from "../models/Address.js";
import PaymentMethod from "../models/PaymentMethod.js";
import User from "../models/User.js";

// GET /api/web/user/addresses
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/web/user/address/:id
export const deleteUserAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await address.remove();
    res.json({ message: "Address removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/web/user/payments
export const getUserPayments = async (req, res) => {
  try {
    const payments = await PaymentMethod.find({ userId: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/web/user/payment/:id
export const deleteUserPayment = async (req, res) => {
  try {
    const payment = await PaymentMethod.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment method not found" });
    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await payment.remove();
    res.json({ message: "Payment method removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import mongoose from "mongoose";
import Address from "../models/Address.js";
import PaymentMethod from "../models/PaymentMethod.js";
import User from "../models/User.js";

// POST /api/web/user/address
export const createUserAddress = async (req, res) => {
  try {
    const { type, street, city, state, postalCode, country, phone, isDefault } = req.body;
    
    if (!type || !street || !city || !state || !postalCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // If this is default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      userId: req.user.id,
      type,
      street,
      city,
      state,
      postalCode,
      country: country || "India",
      phone,
      isDefault: isDefault || false
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/web/user/address/:id
export const updateUserAddress = async (req, res) => {
  try {
    const { type, street, city, state, postalCode, country, phone, isDefault } = req.body;
    const addressId = req.params.id;

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const address = await Address.findById(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });
    
    if (address.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If this is default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    Object.assign(address, {
      type: type || address.type,
      street: street || address.street,
      city: city || address.city,
      state: state || address.state,
      postalCode: postalCode || address.postalCode,
      country: country || address.country,
      phone: phone || address.phone,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault
    });

    await address.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
    const addressId = req.params.id;

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const address = await Address.findById(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await address.deleteOne();
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

// POST /api/web/user/payment
export const createUserPayment = async (req, res) => {
  try {
    const { type, cardHolderName, cardNumber, expiryDate, cvv, isDefault } = req.body;

    // Validation
    if (!type || !cardHolderName || !cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ message: "All payment details are required" });
    }

    const sanitizedNumber = cardNumber.replace(/\D/g, "");
    if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
      return res.status(400).json({ message: "Invalid card number" });
    }

    if (cvv.length < 3 || cvv.length > 4) {
      return res.status(400).json({ message: "Invalid CVV" });
    }

    const [monthStr, yearStr] = expiryDate.split("/").map((item) => item.trim());
    const expiryMonth = parseInt(monthStr, 10);
    let expiryYear = parseInt(yearStr, 10);

    if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12 || !yearStr || Number.isNaN(expiryYear)) {
      return res.status(400).json({ message: "Invalid expiry date" });
    }

    if (yearStr.length === 2) {
      expiryYear += expiryYear < 70 ? 2000 : 1900;
    }

    if (isDefault) {
      await PaymentMethod.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const payment = await PaymentMethod.create({
      userId: req.user.id,
      type,
      cardHolderName,
      last4: sanitizedNumber.slice(-4),
      expiryMonth,
      expiryYear,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: "Payment method added successfully",
      payment
    });
  } catch (err) {
    console.error("Create payment error:", err);
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
    await payment.deleteOne();
    res.json({ message: "Payment method removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

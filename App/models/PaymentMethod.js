import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String, required: true }, // e.g., "credit_card", "debit_card", "paypal"
  last4: { type: String, required: true }, // last 4 digits
  expiryMonth: { type: Number },
  expiryYear: { type: Number },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("PaymentMethod", paymentMethodSchema);

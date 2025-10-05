import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // Replace with your actual key_id or use environment variable
  key_secret: process.env.RAZORPAY_SECRET // Replace with your actual key_secret or use environment variable
});

export default razorpayInstance;

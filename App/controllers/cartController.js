// import Cart from "../models/Cart.js";

//  const getCartItem = async(req,res)=>{
//     try{
//     const cart= await Cart.findOne({userId:req.user.id}).populate("items.productId");
//     res.json(cart || {items:[]});
//     }
//     catch(err){
//         res.status(500).json({message:"Server Error"});
//     }
// }


// const addToCartItem = async(req,res)=>{
//     try{
//         const{productId,quantity}=req.body;
//     const cart = await Cart.findOne({userId:req.user.id});
//     if(!cart){
//         cart = new Cart({userId:req.user.id,items:[]});
//     }
//     const itemIndex = cart.items.findIndex(item=>item.productId.toString()===productId);
//     if(itemIndex>-1){
//         cart.items[itemIndex].quantity+=quantity;
//     }else{
//         cart.items.push({productId:productId,quantity});
//     }
//     await cart.save();
//     res.json(cart);
//     }
//     catch(err){
//         res.status(500).json({message:"Server Error"});
//     }
// }

// const removeCartItem = async (req, res) => {
//   try {
//     let cart = await Cart.findOne({ userId: req.user.id });
//     cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
//     await cart.save();
//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

//  const clearCart = async (req, res) => {
//   try {
//     let cart = await Cart.findOne({ user: req.user.id });
//     if (cart) {
//       cart.items = [];
//       await cart.save();
//     }
//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// export {getCartItem,addToCartItem,removeCartItem,clearCart};

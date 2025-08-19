import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmails.js';

export const signup=async(req,res)=>{
    try{
        const { name, email, password } = req.body;
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user  = new User({ name,email,password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const login=async(req,res)=>{
    try{
        const{ email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn: '1h'});
        res.status(200).json({
            token,
            user:{id:user._id, name:user.name, email:user.email}
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    
}

// forgot password functionality
export const forgotPassword=async (req,res)=>{
    const { email } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
        user.resetPasswordExpire = Date.now() + 10* 60 * 1000; 
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

       await sendEmail({
        email: user.email,
        subject: "password request reset",
        message: `Click the link to reset your password: ${resetUrl}`,  // plain text version
        link: resetUrl  // ✅ for HTML version
});

    
        res.json({ message: 'Reset link sent to email' });
    } catch (err) {
         console.error("Forgot Password Error:", err);  
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
}


// reset password functionality
 export const resetPassword=async(req,res)=>{
        try{
    //          console.log("BODY RECEIVED:", req.body);
    // console.log("TOKEN PARAM:", req.params.token);  
            const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest('hex');

            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire :{$gt:Date.now()}
            })
            // console.log("BODY RECEIVED:", req.body);

             if (!user) {
            return res.status(400).json({ message: 'Token is invalid or expired' });
        } 
            // console.log("BODY RECEIVED:", req.body);
        user.password = await bcrypt.hash(req.body.password,10);
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save();
        res.json({ message: 'Password reset successful' });
    }
    catch (err) {
         console.error("Forgot Password Error:", err);  
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
 }
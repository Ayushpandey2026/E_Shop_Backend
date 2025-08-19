import express from "express";
import enquiryModel from "../models/Enquiry.js";

let enquiryInsert=async(req,res)=>{
    let {name, email, phone, message} = req.body;
    const enquiry = new enquiryModel({
        name,
        email,
        phone,
        message
    })
    await enquiry.save().then(()=>{
    res.status(200).json({status: 1, message: "Enquiry inserted successfully"});
})}

let enquirylist = async(req, res) => {
   let result= await enquiryModel.find();
    if(result.length > 0)  res.status(200).json({status: 1, result})
}

let enquirydelete=async(req,res)=>{
        let enid = req.params.id;
        console.log(enid);
       try {
    const result = await enquiryModel.findByIdAndDelete(enid);
    if (result) {
      res.status(200).json({ status: 1, message: "Enquiry deleted successfully" });
    } else {
      res.status(404).json({ status: 0, message: "Enquiry not found" });
    }
  } catch (error) {
    console.error("🔥 Error in delete handler:", error);
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// below for updation
let enquiryget=async(req,res)=>{
  let enid = req.params.id;

  let data = await enquiryModel.findOne({_id: enid});
  res.status(200).json({
            status: 1,
            message: "Enquiry updated successfully",
            data: data
  })
}

let enquiryUpdate = async(req,res)=>{
    const enquiryid = req.params.id;
    const {name, email, phone,message} = req.body;
    const upobj = {
        name,
        email,
        phone,
        message
    };
    const updateddata = await enquiryModel.updateOne({_id: enquiryid}, upobj);
    res.status(200).json({
        status: 1,
        message: "Enquiry updated successfully",
        data: updateddata
    })
  }

    export { enquiryInsert ,enquirylist,enquirydelete, enquiryUpdate, enquiryget };
import express from "express";
import { enquiryInsert,enquiryUpdate,enquirydelete,enquirylist,enquiryget } from "../controllers/enquiryController.js";
const enquiryRouter =express.Router();

enquiryRouter.post("/insert",enquiryInsert);
enquiryRouter.get("/list",enquirylist);
enquiryRouter.delete("/delete/:id",enquirydelete);
enquiryRouter.get('/update/:id', enquiryget); 
enquiryRouter.put("/update/:id",enquiryUpdate);
export default enquiryRouter;




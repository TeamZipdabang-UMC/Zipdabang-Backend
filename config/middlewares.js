import multer from "multer";

export const upload =multer({dest : "uploads/recipePics", limits:{
    fileSize : 4000000,
}});
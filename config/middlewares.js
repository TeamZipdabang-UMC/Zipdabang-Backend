import multer from "multer";
import multerS3 from "multer-s3"
import aws from "aws-sdk"
import privateInfo from "./privateInfo";

const s3 = new aws.S3({
    credentials : {
        accessKeyId : privateInfo.AWS_ID,
        secretAccessKey : privateInfo.AWS_SECRET
    }
})  

const multerUploader = multerS3({
    s3 : s3,
    bucket : 'zipdabangs3',
    acl : "public-read"
})

export const uploadPicture = multer({
    dest : "uploads/pictures/",
    limits : {
        fileSize : 8000000,
    },
    storage : multerUploader,
})

export const tokenCheckPicture = async(req, res, next) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    else
        next();
}

export const tokenAndBodyCheck = async(req, res, next) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    else
        next();
}
import privateInfo from "./privateInfo";
import jwt from "jsonwebtoken"

export const jwtMiddleware = (req,res,next) =>{
    // read the token from header or url
    const token = req.headers['x-access-token']
    // token does not exist
    if(!token) {
        console.log("hihi")
        next();
    }

    // create a promise that decodes the token
    else{
        const p = new Promise(
            (resolve, reject) => {
                jwt.verify(token, privateInfo.JWT_SECRET , (err, verifiedToken) => {
                    if(err) reject(err);
                    resolve(verifiedToken)
                })
            }
        );
    
        // if it has failed to verify, it will return an error message
        const onError = (error) => {
            console.log(error)
            next()
        };
        // process the promise
        p.then((verifiedToken)=>{
            //비밀 번호 바뀌었을 때 검증 부분 추가 할 곳
            req.verifiedToken = verifiedToken;
            next();
        }).catch(onError);
    }
}

import { checkExistEmail } from "./userProvider"
import pool from "../../config/database"
import { createUserEmail } from "./userDao";
import jwt from "jsonwebtoken"
import privateInfo from "../../config/privateInfo";



export const startWithKakao = async(userProfile, userEmail)=>{

    const isLogin = await checkExistEmail(userEmail)
    if (!isLogin){
        const connection = await pool.getConnection(async conn => conn);
        const result = await createUserEmail(connection, userEmail, userProfile);
        connection.release();
        if (result > 0)
            return "join"
    }
    else{
        // 이미 이메일이 있다? -> 로그인 시키기
        // 토큰에는 id, 이메일만 담을것임!
        let token = await jwt.sign({
            userId : isLogin,
            userEmail,
        },
        privateInfo.JWT_SECRET,
        {
            expiresIn : "30d",
            subject : "userInfo"
        });

        return token
    }
}
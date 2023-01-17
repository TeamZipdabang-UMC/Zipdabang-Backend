import { checkExistEmail } from "./userProvider"
import pool from "../../config/database"
import { createUserEmail, insertNewUser, insertUserData } from "./userDao";
import jwt from "jsonwebtoken"
import privateInfo from "../../config/privateInfo";
import bcrypt from "bcrypt"



export const startWithKakao = async(userProfile, userEmail)=>{

    const isLogin = await checkExistEmail(userEmail)

    if (!(isLogin.length > 0)){
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
            userId : isLogin[0].Id,
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

export const startWithGoogle = async(userProfile, userEmail) => {
    
    const isLogin = await checkExistEmail(userEmail)

    console.log(isLogin)
    if (!(isLogin.length > 0)){
        const connection = await pool.getConnection(async conn => conn);
        const result = await createUserEmail(connection, userEmail, userProfile);
        connection.release();
        
        if (result > 0){
            const responseObj = {
                status : "join",
                joinedEmail : `${userEmail}`
            }
            return responseObj;
        }
    }
    else{
        let token = await jwt.sign({
            userId : isLogin[0].Id,
            userEmail : userEmail,
        },
        privateInfo.JWT_SECRET,
        {
            expiresIn : "30d",
            subject : "userInfo"
        });

        const responseObj = {
            status : "login",
            token
        }
        return responseObj;
    }
}

export const finishSocialLogin = async(dataObj) =>{
    // 존재성 여부는 할 필요가 없다

    const connection = await pool.getConnection(async conn => conn);

    const now = new Date()

    let nowYear = now.getFullYear() % 100
    
    const userYear = Number(dataObj.birth.substr(0,2))

    if (nowYear < userYear)
        nowYear += 100
    
    const userAge = nowYear - userYear + 1
    
    const genderNum = Number(dataObj.birth[7])

    const userGender = genderNum % 2 == 0 ? 2 : 1

  
    const {name, phoneNum, nickname, email} = dataObj

    const dataParam = [name, phoneNum, userAge, nickname, userGender]
    
    const result = insertUserData(connection, dataParam, email)
    return result
}

export const addUser = async(dataObj) =>{
    const connection = await pool.getConnection(async conn => conn)

    const {email, name, nickname, birth, password, phoneNum} = dataObj
    const now = new Date()

    let nowYear = now.getFullYear() % 100
    
    const userYear = Number(dataObj.birth.substr(0,2))

    if (nowYear < userYear)
        nowYear += 100
    
    const userAge = nowYear - userYear + 1
    
    const genderNum = Number(dataObj.birth[7])

    const userGender = genderNum % 2 == 0 ? 2 : 1

    const hashedPass = await bcrypt.hash(password,8);

    const dataParam = [name, email, phoneNum, userAge, nickname, hashedPass, userGender]
    
    const result = await insertNewUser(connection, dataParam);
    return result
}


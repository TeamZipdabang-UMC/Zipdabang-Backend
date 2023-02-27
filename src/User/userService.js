import { checkExistEmail } from "./userProvider"
import pool from "../../config/database"
import { blockUserDao, createUserEmail, deleteScrapRow, insertNewUser, insertUserData, reportUserDao, updateInactive, updateNickname } from "./userDao";
import jwt from "jsonwebtoken"
import privateInfo from "../../config/privateInfo";
import bcrypt from "bcrypt"



export const startWithKakao = async(userEmail, userProfile)=>{

    const isLogin = await checkExistEmail(userEmail)

    console.log("isLogin" , isLogin)
    if (!(isLogin.length > 0)){
        const connection = await pool.getConnection(async conn => conn);
        const result = await createUserEmail(connection, userEmail, userProfile);
        const adduser = await checkExistEmail(userEmail)
        if (result > 0)
        {
            console.log("adduser",adduser[0].Id)
            let token = await jwt.sign({
                userId : adduser,
                userEmail,
            },
            privateInfo.JWT_SECRET,
            {
                expiresIn : "30d",
                subject : "userInfo"
            });
            const responseObj = {
                status : "join",
                email : userEmail,
                token
            }
            return responseObj
        }
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

        const responseObj = {
            status : "login",
            email : userEmail,
            token
        }
        console.log("after login",responseObj)
        return responseObj
    }
}

export const startWithGoogle = async(userEmail, userProfile) => {
    
    const isLogin = await checkExistEmail(userEmail)

    console.log("is login value",isLogin.length)
    if (!(isLogin.length > 0)){
        const connection = await pool.getConnection(async conn => conn);
        const result = await createUserEmail(connection, userEmail, userProfile);
        const adduser = checkExistEmail(userEmail)
        if (result > 0){
            let token = await jwt.sign({
                userId : adduser,
                userEmail,
            },
            privateInfo.JWT_SECRET,
            {
                expiresIn : "30d",
                subject : "userInfo"
            });
            const responseObj = {
                status : "join",
                email : userEmail,
                token
            }
            return responseObj
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
            email : userEmail,
            token
        }
        return responseObj;
    }
}

export const finishSocialLogin = async(dataObj) =>{
    // 존재성 여부는 할 필요가 없다

    console.log("in service", "dataObj : ", dataObj)

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
    connection.release();
    return result
}


export const deleteScraps = async(target,userId) =>{
    console.log("in service", target, userId)
    const connection = await pool.getConnection(async conn => conn)
    let deleteSubQuery = target.join(",")
    deleteSubQuery = '(' + deleteSubQuery + ')'
    const result = await deleteScrapRow(connection, deleteSubQuery,userId);
    connection.release();
    return result
}

export const changeNickname = async(userId, nickname) =>{
    console.log("in service", userId, nickname)
    const connection = await pool.getConnection(async conn => conn)
    const updateResult = await updateNickname(connection, userId, nickname)
    connection.release();
    return updateResult
} 

export const quitUser = async(userId) =>{
    console.log("in service", userId)
    const connection = await pool.getConnection(async conn => conn)
    const patchResult = await updateInactive(connection, userId)
    connection.release();
    return patchResult
}

export const blockUser = async(block,userId) =>{
    console.log(block, userId)
    const connection = await pool.getConnection(async conn => conn)
    const postResult = await blockUserDao(connection,userId,block)
    return postResult
}

export const reportUser = async(reporter,outlaw, target_recipe, target_comment, crime) =>{
    console.log(reporter, target_recipe, target_comment)
    const connection = await pool.getConnection(async conn => conn)
    const postResult = await reportUserDao(connection,reporter,outlaw,target_recipe,target_comment,crime)
    return postResult
}   
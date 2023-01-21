import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { addUser, changeNickname, deleteScraps, finishSocialLogin, startWithGoogle, startWithKakao } from "./userService";
import { checkExistNickname, getMyChallengingAll, getMyChallengingOverView, getMyCompleteAll, getMyCompleteOverView,  getMyScrapAll,  getMyScrapOverView, getNextScrap } from "./userProvider";


export const kakaoLogin = async(req, res) =>{
    const {userEmail, userProfile} = req.body

    console.log(userEmail, userProfile)
    const result = await startWithKakao(userEmail, userProfile);
    res.send(JSON.stringify(result))
}

export const googleLogin = async(req, res) =>{
    const {userEmail, userProfile} = req.body

    const result = await startWithGoogle(userEmail, userProfile);
    res.send(JSON.stringify(result))
}

export const findExistNickname = async(req,res)=>{
    const {nickname} = req.query
    
    const result = await checkExistNickname(nickname);
    if (result){
        const responseObj = {
            exist : true,
            nickname
        }
        console.log(responseObj)
        res.send(JSON.stringify(responseObj))
    }
    else{
        const responseObj = {
            exist : false,
        }
        console.log(responseObj)
        res.send(JSON.stringify(responseObj))
    }
}

export const postUserDataSocial = async(req,res) =>{
    const {name, nickname, phoneNum, birth, email} = req.body

    const expressionErrorObj = {
        status : "expression error",
        type : ``
    }

    const existErrorObj = {
        status : "data exist error",
        type : ``
    }

    if (!name)
    {
        existErrorObj.type = `name`
        return res.status(400).send(JSON.stringify(existErrorObj))
    }
    else if (!nickname){
        existErrorObj.type = `nickname`
        return res.status(400).send(JSON.stringify(existErrorObj))
    }
    else if (!phoneNum){
        existErrorObj.type = `phoneNum`
        return res.status(400).send(JSON.stringify(existErrorObj))
    }
    else if (!birth){
        existErrorObj.type = `birth`
        return res.status(400).send(JSON.stringify(existErrorObj))
    }
    else if (!email){
        existErrorObj.type = `email`
        return res.status(400).send(JSON.stringify(existErrorObj))
    }

    if (!regexEmail.test(email))
    {
        expressionErrorObj.type = `email`
        return res.status(400).send(JSON.stringify(expressionErrorObj))
    }
    else if (name.length <= 0 || name.length > 10)
    {
        expressionErrorObj.type = `name`
        return res.status(400).send(JSON.stringify(expressionErrorObj))
    }
    else if (nickname.length <= 1 || nickname.length > 10)
    {
        expressionErrorObj.type = `nickname`
        return res.status(400).send(JSON.stringify(expressionErrorObj))
    }
    else if (phoneNum.length != 11)
    {
        expressionErrorObj.type = `phone number`
        return res.status(400).send(JSON.stringify(expressionErrorObj))
    }
    else if (birth.length != 8 || birth[6] != '-'){
        expressionErrorObj.type = `birth`
        return res.status(400).send(JSON.stringify(expressionErrorObj))
    }

    const dataObj = req.body
    const result = finishSocialLogin(dataObj);
    if (result)
    {
        const responseObj = {
            success: true,
            name : dataObj.name,
            nickname : dataObj.nickname,
            phoneNum : dataObj.phoneNum
        }

        console.log(responseObj)
        return res.send(JSON.stringify(responseObj));
    }
}


export const getMyPage = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken;
    const myScrapResult = await getMyScrapOverView(userId);
    const myChallengingResult = await getMyChallengingOverView(userId);
    const myCompleteResponse = await getMyCompleteOverView(userId);
    
    const myPageResponse = {
        myScrapOverView : myScrapResult,
        myChallengingOverView : myChallengingResult,
        myCompleteOverView : myCompleteResponse
    }

    console.log(myPageResponse)
    res.send(JSON.stringify(myPageResponse))
}

export const getMyScrap = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken
    const myAllScrap = await getMyScrapAll(userId)
    
    const response = {
        myScrap : myAllScrap
    }
    console.log(response)
    res.send(JSON.stringify(response))
}

export const getMyChallenging = async(req, res) => {
    const {userId, userEmail} = req.verifiedToken
    const myAllChallenging = await getMyChallengingAll(userId)

    const response = {
        myChallenging : myAllChallenging
    }
    console.log(response)
    res.send(JSON.stringify(response))
}

export const getMyComeplete = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken
    const myAllComplete = await getMyCompleteAll(userId)

    const response = {
        myComplete : myAllComplete
    }
    console.log(response)
    res.send(JSON.stringify(response))
}

export const deleteMyScrap = async(req, res) =>{
    const {target} = req.body
    const {userId} = req.verifiedToken
    if (!target || target.length == 0)
    {
        const responseObj = {
            success : false,
            error : "삭제할 레시피들의 아이디를 보내주세요"
        }

        console.log(responseObj)
        return res.status(400).send(JSON.stringify(responseObj))
    }
    const result = await deleteScraps(target,userId)
    if (result > 0){
        const responseObj = {
            success : true,
        }
        console.log(responseObj)
       return res.send(JSON.stringify(responseObj))
    }
    else{
        const responseObj = {
            success : false,
            error : "삭제할 레시피가 데이터베이스에 없습니다"
        }
       return res.status(400).send(JSON.stringify(responseObj))
    }
}

export const patchNickname = async(req, res) =>{
    const {nickname} = req.body
    const {userId} = req.verifiedToken

    const errorResponseObj = {
        success : false,
        error : ``
    }

    if(!nickname){
        errorResponseObj.error = '닉네임을 보내주세요'
        return res.status(400).send(JSON.stringify(errorResponseObj))
    }
    else if (nickname.length < 2 || nickname.length >= 10){
        errorResponseObj.error = '닉네임은 2 ~ 10글자로 해주세요'
        return res.status(400).send(JSON.stringify(errorResponseObj))
    }

    const nicknameCheck = await checkExistNickname(nickname)
    if (nicknameCheck){
        errorResponseObj.error = '닉네임이 이미 누가 사용중입니다'
        return res.status(400).send(JSON.stringify(errorResponseObj))
    }
    else{
        const changeResult = await changeNickname(userId,nickname)
        if (changeResult > 0){
            const responseObj = {
                success : true,
                error : null
            }

            console.log(responseObj)
            return res.status(200).send(JSON.stringify(responseObj))
        }
    }
}
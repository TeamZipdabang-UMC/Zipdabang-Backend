import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import { changeNickname, deleteScraps, finishSocialLogin, quitUser, startWithGoogle, startWithKakao } from "./userService";
import { checkExistEmail, checkExistNickname, getMyChallengingAll, getMyChallengingOverView, getMyCompleteAll, getMyCompleteOverView,  getMyScrapAll,  getMyScrapOverView, getNextScrap, getUserInfoProvider, getUserNicknameProvider } from "./userProvider";
import jwt from "jsonwebtoken"

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

    const responseObj = {
        success : null,
        data : null,
        error :null
    }

    if (!name)
    {
        responseObj.success = false,
        responseObj.error = "이름 없음"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (!nickname){
        responseObj.success = false,
        responseObj.error = "닉네임 없음"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (!phoneNum){
        responseObj.success = false,
        responseObj.error = "핸드폰 번호 없음"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (!birth){
        responseObj.success = false,
        responseObj.error = "주민등록번호 없음"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (!email){
        responseObj.success = false,
        responseObj.error = "이메일 없음"
        return res.status(400).send(JSON.stringify(responseObj))
    }

    if (!regexEmail.test(email))
    {
        responseObj.success = false,
        responseObj.error = "이메일 양식 틀림"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (name.length <= 0 || name.length > 10)
    {
        responseObj.success = false,
        responseObj.error = "이름은 2 ~ 10글자"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (nickname.length <= 1 || nickname.length > 10)
    {
        responseObj.success = false,
        responseObj.error = "닉네임은 2 ~ 10글자"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (phoneNum.length != 11)
    {
        responseObj.success = false,
        responseObj.error = "핸드폰번호는 11글자"
        return res.status(400).send(JSON.stringify(responseObj))
    }
    else if (birth.length != 8 || birth[6] != '-'){
        responseObj.success = false,
        responseObj.error = "주민등록번호 양식 틀림"
        return res.status(400).send(JSON.stringify(responseObj))
    }

    const dataObj = req.body
    const result = await finishSocialLogin(dataObj);
    if (result)
    {
        const addedUser = await checkExistEmail(email);
        let token = await jwt.sign({
            userId : addedUser[0].Id,
            userEmail : email,
        },
        privateInfo.JWT_SECRET,
        {
            expiresIn : "30d",
            subject : "userInfo"
        });
        

        responseObj.success = true,
        responseObj.data = token

        console.log(responseObj)
        return res.json(responseObj);
    }
}


export const getMyPage = async(req, res) =>{

    let baseResponse = {
        success : null,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }

    const {userId, userEmail} = req.verifiedToken;

    console.log("내 집다방 페이지 토큰", userId)
    const myScrapResult = await getMyScrapOverView(userId);
    const myChallengingResult = await getMyChallengingOverView(userId);
    const myCompleteResponse = await getMyCompleteOverView(userId);
    
    baseResponse.success = true
    baseResponse.data = {
        myScrapOverView : myScrapResult,
        myChallengingOverView : myChallengingResult,
        myCompleteOverView : myCompleteResponse
    }

    console.log(baseResponse)
    res.json(baseResponse)
}

export const getMyScrap = async(req, res) =>{
    
    let baseResponse = {
        success : null,
        data : null,
        error : null
    }

    if (!req.verifiedToken){
        baseResponse.success = false,
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {userId, userEmail} = req.verifiedToken

    console.log("내 스크랩 조회 토큰")
    const myAllScrap = await getMyScrapAll(userId)
    
    baseResponse.success = true
    baseResponse.data = {
        myScrap : myAllScrap
    }
    console.log(baseResponse)
    res.json(baseResponse)
}

export const getMyChallenging = async(req, res) => {
    let baseResponse = {
        success : null,
        data : null,
        error :null
    }
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {userId, userEmail} = req.verifiedToken
    console.log("내 도전중 토큰",userId);
    const myAllChallenging = await getMyChallengingAll(userId)

    baseResponse.success = true
    baseResponse.data = {
        myChallenging : myAllChallenging
    }
    console.log(baseResponse)
    res.json(baseResponse)
}

export const getMyComeplete = async(req, res) =>{
    let baseResponse = {
        success : null,
        data : null,
        error :null
    }
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {userId, userEmail} = req.verifiedToken

    console.log("내 도전완료 페이지 토큰", userId)
    const myAllComplete = await getMyCompleteAll(userId)

    baseResponse.success = true
    baseResponse.data = {
        myComplete : myAllComplete
    }
    console.log(baseResponse)
    res.json(baseResponse)
}

export const deleteMyScrap = async(req, res) =>{
    let baseResponse = {
        success : null,
        data : null,
        error :null
    }
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    console.log(req.body)
    const {target} = req.body
    const {userId} = req.verifiedToken
    if (!target || target.length == 0)
    {
        baseResponse.success = false
        baseResponse.error = "삭제할 레시피 아이디 보내주세요"

        console.log(baseResponse)
        return res.status(400).json(baseResponse)
    }
    const result = await deleteScraps(target,userId)
    if (result > 0){
        baseResponse.success = true
        console.log(baseResponse)
       return res.json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.error = "삭제할 대상이 데이터베이스에 없습니다"
       return res.status(400).json(baseResponse)
    }
}

export const patchNickname = async(req, res) =>{
    let baseResponse = {
        success : null,
        data : null,
        error :null
    }
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }

    console.log(req.body)
    const {nickname} = req.body
    const {userId} = req.verifiedToken


    if(!nickname){
        baseResponse.success = false
        baseResponse.error = "닉네임 보내주세요"
        return res.status(400).json(baseResponse)
    }
    else if (nickname.length < 2 || nickname.length >= 10){
        baseResponse.success = false
        baseResponse.error = "닉네임은 2 ~ 10 글자"
        return res.status(400).json(baseResponse)
    }

    const nicknameCheck = await checkExistNickname(nickname)
    if (nicknameCheck){
        baseResponse.success = false
        baseResponse.error = "닉네임을 누가 이미 사용중입니다"
        return res.status(400).json(baseResponse)
    }
    else{
        const changeResult = await changeNickname(userId,nickname)
        if (changeResult > 0){
            baseResponse.success = true

            console.log(baseResponse)
            return res.status(200).json(baseResponse)
        }
    }
}

export const patchUser = async(req, res) =>{
    let baseResponse = {
        success : null,
        data : null,
        error :null
    }
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken
    console.log("in controller", userId)

    const result = await quitUser(userId)

    if (result > 0){
        baseResponse.success = true

        console.log(baseResponse)
        return res.json(baseResponse)
    }
}

export const getUserInfo = async(req,res) =>{
    let baseResponse = {
        success : null,
        data : null,
        error :null
    }
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken
    try{
        const result = await getUserInfoProvider(userId);
        baseResponse.success = true;
        if (result.length > 0)
            baseResponse.data = result[0]
        res.json(baseResponse)
    }catch(e){
        baseResponse.success = false;
        baseResponse.error = `server error, the error type: ${e.name}, the error detail : ${e.message}`;
        console.dir(e)
        res.json(baseResponse);
    }
}
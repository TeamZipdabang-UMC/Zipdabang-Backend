import { query } from "express";

export const getCategoryList = async(connection, categoryId, is_official,userId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=${categoryId} and is_official = ${is_official} 
    and recipe.id not in (select blocked from banned_recipe where owner =${userId})
    and recipe.owner not in (select blocked from blocked_user where owner=${userId})
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId,userId);
    return categoryList[0];
}

export const getMainCategoryList = async(connection, categoryId,userId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url as image, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=? and recipe.is_temp != 1 
    and recipe.id not in (select blocked from banned_recipe where owner =${userId})
    and recipe.owner not in (select blocked from blocked_user where owner=${userId})
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId,userId);
    return categoryList[0];
}

export const getThumbCategoryList = async(connection, categoryId,userId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.id as recipeId, likes, beveragecategory.name,image_url as image, recipe.name  
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.category=${categoryId} and recipe.is_temp != 1 
    and recipe.id not in (select blocked from banned_recipe where owner =${userId} )
    and recipe.owner not in (select blocked from blocked_user where owner= ${userId} )
    order by created_at desc
    limit 2
    ;`;
    const categoryList = await connection.query(selectCategorryQuery, categoryId, userId);
    return categoryList[0];
}

export const getCategoryPagingList = async(connection, categoryId, last, isOfficial,userId) =>{
    let selectCategorryQuery = `` 
    if (isOfficial == null)
        selectCategorryQuery = 
        `SELECT recipe.id, beveragecategory.name, recipe.name, image_url as image, likes 
        FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
        where recipe.category = ${categoryId} 
        and created_at < ( select created_at from recipe where id=${last} )
        and recipe.is_temp != 1 
        and recipe.id not in (select blocked from banned_recipe where owner =${userId})
        and recipe.owner not in (select blocked from blocked_user where owner=${userId})
        order by created_at desc
        limit 12
        ;`;
    else
    selectCategorryQuery =  
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url as image, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    
    where recipe.category = ${categoryId} 
    and recipe.is_official = ${isOfficial} 
    and created_at < ( select created_at from recipe where id=${last} ) 
    and recipe.id not in (select blocked from banned_recipe where owner =${userId})
    and recipe.owner not in (select blocked from blocked_user where owner=${userId})
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery,userId);
    return categoryList[0];
}

export const getRecipesList = async(connection, is_official,userId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url, likes 
    from recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.is_official = ?
    and recipe.id not in (select blocked from banned_recipe where owner =${userId})
    and recipe.owner not in (select blocked from blocked_user where owner=${userId})
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, is_official,userId);
    return categoryList[0];
}


export const getViewPaging = async(connection, is_official, last,userId) =>{
    const AllViewPagingQuery = 
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.is_official=${is_official} and created_at < ( select created_at from recipe where id=${last} )
    and recipe.id not in (select blocked from banned_recipe where owner =${userId})
    and recipe.owner not in (select blocked from blocked_user where owner=${userId})
    order by created_at desc
    limit 12
    ;`;
    const AllViewPagingData = await connection.query(AllViewPagingQuery, is_official, last,userId);
    return AllViewPagingData[0];
}


export const searchKeywordList = async(connection, keyword, category,userId) =>{
    //console.log(typeof(keyword))

    //const findString = "라떼";
    // { 커피 음료 티 에이드 스무디 건강음료 }
    /*
    if(keyword.indexOf("커피") != -1) {
        const category = " and category = 1";
    }
    else if(keyword.indexOf("음료") != -1) {
        const category = " and category = 2";
    }
    else if(keyword.indexOf("티") != -1) {
        const category = " and category = 3";
    }
    else if(keyword.indexOf("에이드") != -1) {
        const category = " and category = 4";
    }
    else if(keyword.indexOf("스무디") != -1) {
        const category = " and category = 5";
    }
    else if(keyword.indexOf("건강음료") != -1) {
        const category = " and category = 6";
    }
    */
   
    const splited = keyword.split(" ");

    let i=0;

    //let result = new Array(splited.length);

    let result = []
    while (i<splited.length) {
        const searchQuery = 
        /*
        `
        select distinct recipe.id, image_url, name, likes 
        from recipe
        where is_temp != 1 and name like '%${splited[i]}%' and category = '${category}';
        `;
        */
        `
        select distinct recipe.id, image_url, name, likes
        from recipe 
        where is_temp != 1 
        and name like '%${splited[i]}%' 
        and category = '${category}'
        and recipe.id not in (select blocked from banned_recipe where owner =${userId})
        and recipe.owner not in (select blocked from blocked_user where owner=${userId});

        `

        // const categoryList = await connection.query(searchQuery, splited[i]);
        //console.log(categoryList[0]);
        // result[i]=categoryList[0];
        // result.push(categoryList[0]);
        const categoryList = await connection.query(searchQuery);
        console.log("categoryList",categoryList[0][0]);
        for (let j = 0; j < categoryList[0].length; j++)
            result.push(categoryList[0][j])
        // console.log("categoryList", categoryList[0])
        // result[i] = categoryList[0]
        i=i+1;
        //console.log(result)

    }
    console.log(`search result in ${category}`, result)
    return result;
}


export const deleteTempSavedInfo = async(connection, tempSavedId)=>{
    const deleteTempSavedInfo = `DELETE FROM TEMP WHERE id='${tempSavedId}';`;
    await connection.query(deleteTempSavedInfo);

    return "기존 임시저장 정보 삭제";
}
/*
export const getTempSavedInfos = async(connection, recipeId)=>{

    const result = [[],[],[],[]];
    //각 정보를 result에 담기

    const selectRecipeInfo = `select (Id, is_official, owner, time, name, intro, image_url, review) from recipe where id='${recipeId}';`;
    const recipe = await connection.query(selectRecipeInfo);
    if(recipe != null){
        result[0]=recipe[0][0];
    }
    else{
        console.log("해당 recipeId 정보가 존재하지 않습니다.");
        return null;
    }

    const selectCategory = `select name from beverageCategory where id='${recipe.category}';`;
    const category = await connection.query(selectCategory)
    if(category != null){
        result[1]=category[0][0]
    }

    const selectIngredient =`select (Id, name, count, quantity) from ingredient where target_recipe='${recipeId}' order by id;`;
    const ingredients = await connection.query(selectIngredient)
    if(ingredients != null){
        result[2]=ingredients[0]
    }

    const selectMethod =`select (Id, step, step_image_url, step_description) from method where target_recipe='${recipeId}' order by step;`;
    const steps = await connection.query(selectMethod)[0][0]
    if(steps != null){
        result[3]=steps[0]
    }

    return result;
}
*/
export const checkRecipeExistsDao = async(connection, recipeId)=>{
    const sql = `select id from recipe where id='${recipeId}';`
    const result = await connection.query(sql);
    return result[0];
}

export const checkUserExistsDao = async(connection,userId)=>{
    // const sql = `select owner from recipe where owner='${owner}';`
    const sql = `select Id from user where Id = ${userId};`
    const result = await connection.query(sql);

    return result;
}

export const checkTempSaveExists = async(connection, userId) =>{
    const selectTempSavedInfo = `SELECT * FROM TEMP where owner='${userId}';`
    const tempSavedInfo = await connection.query(selectTempSavedInfo);

    return tempSavedInfo;
}

export const updateThumbURL = async(connection, recipeId, dest) =>{
    const sql = `update recipe set img_url = '${dest}', updated_at = current_timestamp(6) where id = '${recipeId}';` //update_at 정보 추가
    const result = await connection.query(sql);
    console.log(result, "thumb 업데이트 성공");
}

export const createRecipeForThumb = async(connection, userId, dest)=>{
    const sql = `insert into recipe (owner, img_url) value ('${userId}','${dest}')`
    const result = await connection.query(sql);
    console.log(result, "thumb 저장 성공")

    return result[0][0].id;
}

export const checkStepExists = async(connection, recipeId,step)=>{
    const sql = `select id from step where target_recipe='${recipeId}' and step='${step};`
    const result = await connection.query(sql);

    return result;
}


export const updateStepURL = async(connection, stepId, dest) =>{
    const sql = `update step set img_url = '${dest}', updated_at=current_timestamp(6) where id = '${stepId}';` //update_at 정보 추가
    const result = await connection.query(sql);
    console.log(result, "stepImg 업데이트 성공");
}

export const createStepForImg = async(connection, dest)=>{
    const sql = `insert into step (img_url) value ('${dest}')`
    const result = await connection.query(sql);
    console.log(result, "img 저장 성공")

    return result[0].id;
}

//updated_at=current_timestamp
export const updateR_InsertCIS = async(connection, recipe, category,ingredients,steps)=>{
    //recipe만 테이블 있음
    //category, ingredients, steps는 새로 생성
}

//export const insertTempRecipe = async(connection, recipe, category,ingredients)=>{
//    //모든 table을 새로 생성해서 저장
//}

export const updateRecipeDao = async (connection,recipe, category, ingredients, steps) =>{
    let sql = `update recipe as r set r.name = '${recipe.name}', r.intro = '${recipe.intro}', r.time = '${recipe.time}', r.review='${review}',
    r.category = (select id from beveragecategory as c where c.name = '${category}');`;
    
    ingredients.forEach(i =>{
        sql += `update ingredient as i set i.name='${i.name}', i.quantity='${i.quantity}' where i.id='${i.id}';`;
    })
    steps.forEach(s =>{
        sql += `update step as s set s.description='${s.description}' where s.id='${s.id}';`;
    })

    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const selectMyRecipes = async (connection, userId)=>{
    const sql = `select Id as recipeId, owner, name, image_url, likes from recipe 
    where recipe.owner = '${userId}'
    order by created_at desc
    limit 12;`
    const result = await connection.query(sql);


    return result;
}

export const selectMyRecipesPaging = async (connection, userId, last)=>{
    const sql = `
    select recipe.Id as recipeId, owner, name, image_url, likes 
    from recipe join banned_recipe on recipe.Id  
    where recipe.owner = '${userId}' and created_at < (select created_at from recipe where id='${last}')
    order by created_at desc
    limit 12;`
    const result = await connection.query(sql);


    return result;
}

export const deleteRecipeDao = async(connection, userId, deleteSubQuery)=>{
    const sql = `delete from recipe where owner = ${userId} and Id in` + deleteSubQuery + ';'

    console.log(sql)
    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const insertChallengeTable = async(connection, userId, recipeId)=>{
    const sql = `insert into challenge (owner, target_recipe, status) value('${userId}', '${recipeId}', 'challenging');`

    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const updateChallengeTable = async(connection, userId, recipeId)=>{
    const sql = `update challenge as c set c.status='complete' where c.owner='${userId}' and c.target_recipe='${recipeId}';`

    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const deleteChallengeTable = async(connection, userId, recipeId)=>{
    const sql = `delete from challenge where owner='${userId}' and target_recipe='${recipeId}';`

    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const updateLikes = async(connection, recipeId)=>{
    const sql = `update recipe set likes= likes+1 where id = '${recipeId}';`;

    const result = await connection.query(sql);

    return result;
}

export const insertScrap = async(connection, userId,recipeId) =>{
    const sql = `insert into scrap (owner, target_recipe) value(${userId}, ${recipeId});`;

    const result = await connection.query(sql);

    return result;
}

export const selectChallenge = async(connection,userId, recipeId) =>{
    const sql = `select status from challenge where owner = ${userId} and target_recipe = ${recipeId};`
    const selectResult = await connection.query(sql)
    return selectResult[0]
}

export const selectLikes = async(connection, recipeId) =>{
    const sql = `select likes from recipe where Id = ${recipeId};`
    const result = await connection.query(sql)

    return result[0]
}

export const selectRecipeInfo = async(connection, recipeId) =>{
    const sql = `select u.nickname, recipe.Id as recipeId, owner,recipe.name, image_url, likes, recipe.created_at, intro, take_time, review from recipe inner join user u on recipe.owner = u.Id where recipe.Id = ${recipeId};`
    const result = await connection.query(sql)
    return result[0]
}

export const selectIngredients = async(connection, recipeId) =>{
    const sql = `select name, quantity from ingredient where target_recipe = ${recipeId};`
    const result = await connection.query(sql)
    return result[0]
}

export const selectMethods = async(connection, recipeId) =>{
    const sql = `select step, step_description, step_image_url from method where target_recipe = ${recipeId};`
    const result = await connection.query(sql)
    return result[0]
}

export const selectAllOficial = async(connection, last,userId) =>{
    let sql = ``
    if (last != null)
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 1 and is_temp != 1 and created_at < (select created_at from recipe where Id= ${last}) 
        and recipe.id not in (select blocked from banned_recipe where owner =${userId}) 
        and recipe.owner not in (select blocked from blocked_user where owner=${userId})
        order by created_at desc limit 12;`
    else
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 1 and is_temp != 1 and recipe.id not in (select blocked from banned_recipe where owner =${userId})
        and recipe.owner not in (select blocked from blocked_user where owner=${userId})
        order by created_at desc limit 12;`
    console.log(sql)
    const result = await connection.query(sql)
    return result[0]
}

export const selectAllUsers = async(connection,last,userId) =>{
    let sql = ``
    if (last)
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 0 and is_temp != 1 and created_at < (select created_at from recipe where Id = ${last}) 
        and recipe.Id not in (select blocked from banned_recipe where owner =${userId}) 
        and recipe.owner not in (select blocked from blocked_user where owner=${userId})
        order by created_at desc limit 12;`
    else
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 0 and is_temp != 1 
        and recipe.Id not in (select blocked from banned_recipe where owner =${userId}) 
        and recipe.owner not in (select blocked from blocked_user where owner=${userId})
        order by created_at desc limit 12;`
    const result = await connection.query(sql)
    console.log(result[0])
    return result[0]
}

export const selectLikeByUser = async(connection, userId, recipeId) =>{
    const sql = `select Id from likes where owner = ${userId} and target_recipe = ${recipeId};`
    const selectResult = await connection.query(sql)
    return selectResult[0]
}

export const insertLike = async(connection, userId, recipeId) =>{
    const sql = `insert into likes (owner, target_recipe) values (${userId}, ${recipeId});`
    const result = await connection.query(sql)
    return result
}

export const minusLike = async(connection, userId, recipeId) =>{
    const sql = `update recipe set likes= likes - 1 where id = '${recipeId}';`
    const result = connection.query(sql)
    return result
}

export const deleteLikes = async(connection, userId, recipeId) =>{
    const sql = `delete from likes where owner = ${userId} and target_recipe = ${recipeId};`
    const result = connection.query(sql)
    return result
}

export const selectTempByUser = async(connection, userId) =>{
    const sql = `select target_recipe from temp where owner = ${userId};`
    const result = await connection.query(sql)
    return result[0]
}

export const selectStepSize = async(connection, targetRecipeId)=>{
    const sql = `select count(*) as step_size from method where target_recipe=${targetRecipeId};`
    const result = await connection.query(sql)
    return result[0]
}

export const deleteTemp = async(connection, targetId) =>{
    const tempDeleteSql = `delete from temp where target_recipe=${targetId};`
    const tempDeleteResult = await connection.query(tempDeleteSql)

    const RecipeDeletesql = `delete from recipe where Id= ${targetId};`
    const recipeDeleteResult = await connection.query(RecipeDeletesql)
    return { recipeDelete : recipeDeleteResult,
    tempDelete : tempDeleteResult}
}

export const insertRecipe = async(connection, userId, recipe, ingredient, steps) => {
    const recipeSql = `insert into recipe (owner, is_official, category, name, intro, review, take_time, image_url) values (${userId},0,?,?,?,?,?,?);`

    const {category, name, intro, review, take_time, image_url, step_size, ingredient_size} = recipe
    const recipeParam = [category, name, intro, review, take_time, image_url]
    const recipeResult = await connection.query(recipeSql, recipeParam);

    console.log("레시피 insert 결과 : ", recipeResult[0])
    console.log("in recipe", recipe)
    console.log(ingredient)
    console.log(steps)

    const getReipceIdSql = `select Id from recipe where owner=${userId} order by created_at desc limit 1;`
    let newRecipeId = await connection.query(getReipceIdSql);
    newRecipeId = newRecipeId[0][0].Id
    console.log("새로 생성된 recipe Id : ", newRecipeId);
    
    for(let i =0; i < ingredient_size; i++) {
        const ingredientSql = `insert into ingredient (target_recipe, name, quantity) values (${newRecipeId}, "${ingredient[i].name}", "${ingredient[i].quantity}");`
        const ingredientResult = await connection.query(ingredientSql);
        console.log("재료 insert 결과 : ", ingredientResult[0])
        console.log('i : ', i)
    }


    for(let s=0; s < step_size; s++){
        const stepSql = `insert into method (target_recipe, step, step_description, step_image_url) values (${newRecipeId}, ${steps[s].step}, "${steps[s].detail}", "${steps[s].step_image_url}");`
        const stepResult = await connection.query(stepSql);
        console.log("step insert 결과 : ", stepResult[0]);
    } 
    return newRecipeId;
}

export const insertTempRecipe = async(connection, userId, newRecipeId)=>{
    const newTempSaveTableSql = `insert into temp (owner, target_recipe) values (${userId}, ${newRecipeId});`
    const tempSaveResult = await connection.query(newTempSaveTableSql);

    console.log(tempSaveResult);
    return tempSaveResult;
    ingredient.forEach((i) => console.log(i))
}

export const getChallenger = async(connection, recipeId) =>{
    const sql = `select count(*) as challenger from challenge where target_recipe =  ${recipeId} and (status = 'challenging' or status = 'complete');`
    const result = await connection.query(sql);
    return result[0][0].challenger
}

export const getScrap = async(connection, recipeId) =>{
    const sql = `select count(*) as scraps from scrap where target_recipe = ${recipeId};`
    const result = await connection.query(sql)
    return result[0][0].scraps
}

export const getComment = async(connection, recipeId) =>{
    const sql = `select count(*) as comments from comment where target_recipe = ${recipeId};`
    const result = await connection.query(sql)
    return result[0][0].comments
}


export const insertRecipePicture = async(connection, param) =>{
    const sql = `insert into recipe(owner, is_official, image_url, is_temp) values (?,0,?,1);`
    const result = await connection.query(sql, param)
    return result[0].affectedRows
}

export const selectLastInserted = async(connection, userId) =>{
    const sql = `select Id from recipe where owner = ${userId} order by created_at desc limit 1;`
    const result = await connection.query(sql)
    return result[0]
}

export const saveStepPicture = async(connection,target, step,picture) =>{
    const sql = `insert into method(target_recipe,step,step_image_url) values (?,?,?);`
    let param = []
    param.push(target)
    param.push(step)
    param.push(picture)
    const result = await connection.query(sql,param)
    return result[0].affectedRows
}

export const insertTemp = async(connection, userId, target) =>{
    const sql = `insert into temp(owner, target_recipe) values (${userId},${target});`
    const result = await connection.query(sql)
    return result[0].affectedRows
}

export const selectThumb = async(connection, recipeId) =>{
    const sql = `select image_url from recipe where Id = ${recipeId};`
    const result = await  connection.query(sql)
    return result[0]
}

export const selectStepPicture = async(connection, recipeId) =>{
    const sql = `select step_image_url as image from method where target_recipe = ${recipeId};`
    const result = await connection.query(sql)
    return result[0]
}

export const selectAllMyRecipes = async(connection, userId) =>{

    const sql = `select Id as recipeId, name ,likes, image_url as image from recipe where owner = ${userId} and is_temp != 1 order by created_at desc`;

    const result = await connection.query(sql)
    return result
}


export const reportRecipeDao = async(connection,repoter, target, crime) =>{
    const sql = `insert into reported_recipe(repoter,target,crime) values (${repoter},${target},${crime});`
    const result = await connection.query(sql)
    return result
}

export const banRecipeDao = async(connection,owner, blocked) =>{
    const sql = `insert into banned_recipe(owner,blocked) values (${owner},${blocked});`
    const result = await connection.query(sql)
    return result
}

export const checkExistCrimeDao = async(connection, crime)=>{
    const sql = `select id from reason_for_report where id='${crime}';`
    const result = await connection.query(sql);
    return result[0];
}

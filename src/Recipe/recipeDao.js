
export const getCategoryList = async(connection, categoryId, is_official) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=${categoryId} and is_official = ${is_official}
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}

export const getMainCategoryList = async(connection, categoryId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url as image, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=?
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}

export const getThumbCategoryList = async(connection, categoryId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url as image, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.category=${categoryId} 
    order by created_at desc
    limit 2
    ;`;
    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}

export const getCategoryPagingList = async(connection, categoryId, last, isOfficial) =>{
    let selectCategorryQuery = `` 
    if (isOfficial == null)
        selectCategorryQuery = 
        `SELECT recipe.id, beveragecategory.name, recipe.name, image_url as image, likes 
        FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
        where recipe.category=${categoryId} and created_at < ( select created_at from recipe where id=${last} )
        order by created_at desc
        limit 12
        ;`;
    else
    selectCategorryQuery =  
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url as image, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.category=${categoryId} and recipe.is_official=${isOfficial} and created_at < ( select created_at from recipe where id=${last} )
    order by created_at desc
    limit 12
    ;`;
    const categoryList = await connection.query(selectCategorryQuery);
    return categoryList[0];
}

export const getRecipesList = async(connection, is_official) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url, likes 
    from recipe inner join beveragecategory on recipe.category = beveragecategory.id

    WHERE recipe.is_official = ?
    order by created_at desc
    limit 12
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, is_official);
    return categoryList[0];
}


export const getViewPaging = async(connection, is_official, last) =>{
    const AllViewPagingQuery = 
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.is_official=${is_official} and created_at < ( select created_at from recipe where id=${last} )
    order by created_at desc
    limit 12
    ;`;
    const AllViewPagingData = await connection.query(AllViewPagingQuery, is_official, last);
    return AllViewPagingData[0];
}


export const searchKeywordList = async(connection, keyword, category) =>{
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
        `
        select distinct id, image_url, name, likes from recipe where name like '${splited[i]}%' and category = '${category}';
        `;

        const categoryList = await connection.query(searchQuery, splited[i]);
        //console.log(categoryList[0]);
        //result[i]=categoryList[0];
        result.push(categoryList[0]);
/* 검색 결과 나중에 테스트 해보기
        const categoryList = await connection.query(searchQuery);
        // console.log("categoryList",categoryList[0][0]);

        for (let j = 0; j < categoryList[0].length; j++)
            result.push(categoryList[0][j])
        // console.log("categoryList", categoryList[0])
        // result[i] = categoryList[0]
*/
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
    console.log(result[0])
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

export const insertTempRecipe = async(connection, recipe, category,ingredients)=>{
    //모든 table을 새로 생성해서 저장
}

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
    const sql = `select Id as recipeId, owner, name, image_url, likes from recipe 
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
    const sql = `select Id as recipeId, owner,name, image_url, likes, created_at, intro, take_time, review from recipe where Id = ${recipeId};`
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

export const selectAllOficial = async(connection, last) =>{
    let sql = ``
    if (last)
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 1 and created_at < (select created_at from recipe where Id= ${last}) order by created_at desc limit 12;`
    else
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 1 order by created_at desc limit 12;`
    const result = await connection.query(sql)
    return result[0]
}

export const selectAllUsers = async(connection,last) =>{
    let sql = ``
    if (last)
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 0 and created_at < (select created_at from recipe where Id = ${last})order by created_at desc limit 12;`
    else
        sql = `select Id as recipeId, likes, image_url, name from recipe where is_official = 0 order by created_at desc limit 12;`
    const result = await connection.query(sql)
    console.log(result[0])
    return result[0]
}
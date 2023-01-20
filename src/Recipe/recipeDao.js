export const deleteTempSavedInfo = async(connection, tempSavedId)=>{
    const deleteTempSavedInfo = `DELETE FROM TEMP WHERE id='${tempSavedId}';`;
    await connection.query(deleteTempSavedInfo);

    return "기존 임시저장 정보 삭제";
}

export const getTempSavedInfos = async(connection, recipeId)=>{
    /*
    조인으로 만들까 생각하다가 내가 원하는 방식으로 result에 예쁘게 담기는 그림이 안나와서 일단 이렇게 노가다로 진행
    혹시 좋은 아이디어 있으면 추천 부탁
    */

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

export const checkRecipeExistsDao = async(connection, recipeId)=>{
    const sql = `select id from recipe where id='${recipeId}';`
    const result = await connection.query(sql);

    return result;
}

export const checkUserExistsDao = async(connection,userId)=>{
    const sql = `select owner from recipe where owner='${owner}';`
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

export const checkRelatedTablesExist = async (connection, recipeId) =>{
    const sql = `select r.category as categoryId, i.id as ingredientId, s.id as stepId from recipe as r
    inner join ingredient as i inner join step as s on r.id = i.target_recipe = s.target=recipe where r.id = '${recipeId}';`
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
    const sql = `select name, img_url, likes from recipe 
    where recipe.owner = '${userId}'
    order by created_at desc
    limit 8;`
    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const selectMyRecipesPaging = async (connection, userId, last)=>{
    const sql = `select id, name, img_url, likes from recipe 
    where recipe.owner = '${userId}' and created_at < (select created_at from recipe where id='${last}')
    order by created_at desc
    limit 8;`
    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const deleteRecipeDao = async(connection, userId, target)=>{
    const sql = `delete recipe, beveragecategory, ingredient, step from recipe
    inner join ingredient inner join step on recipe.id = ingredient.target_recipe = step.target_recipe
    inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.id in ${target} and recipe.owner = '${userId}';`

    const result = await connection.query(sql);

    console.log(result);

    return result;
}

export const insertChallengeTable = async(connection, userId, recipeId)=>{
    const sql = `insert into challenge (owner, target_recipe, status) value('${userId}', '${recipeId}', 'challenge');`

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
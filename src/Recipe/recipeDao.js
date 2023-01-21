
export const getCategoryList = async(connection, categoryId, is_official) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=${categoryId} and is_official = ${is_official}
    order by created_at desc
    limit 8
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}

export const getMainCategoryList = async(connection, categoryId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.Id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=?
    order by created_at desc
    limit 8
    ;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}

export const getThumbCategoryList = async(connection, categoryId) =>{

    const selectCategorryQuery = 
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.category=${categoryId} 
    order by created_at desc
    limit 2
    ;`;
    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}

export const getCategoryPagingList = async(connection, categoryId, last) =>{
    const selectCategorryQuery = 
    `SELECT recipe.id, beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    where recipe.category=${categoryId} and created_at < ( select created_at from recipe where id=${last} )
    order by created_at desc
    limit 8
    ;`;
    const categoryList = await connection.query(selectCategorryQuery, categoryId, last);
    return categoryList[0];
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
    let result = new Array(splited.length);
    while (i<splited.length) {
        const searchQuery = 
        `
        select distinct id, image_url, name, likes from recipe where name like '${splited[i]}%' and category = '${category}';
        `;
        const categoryList = await connection.query(searchQuery, splited[i]);
        console.log(categoryList[0]);
        result[i]=categoryList[0];
        i=i+1;

    }
    return result;
}
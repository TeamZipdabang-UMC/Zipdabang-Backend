
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

export const getCategoryList = async(connection, categoryId) =>{

    const selectCategorryQuery = 
    `SELECT beveragecategory.name, recipe.name, image_url, likes 
    FROM recipe inner join beveragecategory on recipe.category = beveragecategory.id
    WHERE recipe.category=?;`;

    const categoryList = await connection.query(selectCategorryQuery, categoryId);
    return categoryList[0];
}
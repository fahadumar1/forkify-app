import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE,KEY } from './config';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page:1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks:[]

};

const  createRecipeObject = function(data){
    const { recipe } = data.data;
    return {
      recipe: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      featuredImage: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      cookingIngredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key})
    };
}
export const loadRecipe = async function (recipeId) {
  try {
    const data = await AJAX(`${API_URL}/${recipeId}?KEY=${KEY}`);
    state.recipe = createRecipeObject(data)
    if(state.bookmarks.length >= 1) {
     const bookMarkedRecipe =  state.bookmarks.some(bookmark =>{
        return bookmark.recipe === recipeId
       });
       state.recipe.bookmarked = bookMarkedRecipe
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (searchQuery) {
  try {
    state.search.query = searchQuery;
    const data = await AJAX(`${API_URL}?search=${searchQuery}&KEY=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        recipe: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        featuredImage: rec.image_url,
        ...(rec.key && {key: rec.key})
        
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage =  function(page = state.search.page){
    state.search.page  = page
    const startingValue = (page - 1) * state.search.resultPerPage;
    const endingValue  = page * state.search.resultPerPage;
    return  state.search.results.slice(startingValue,endingValue)
}  

export const updateServings = function(newServings){
    state.recipe.cookingIngredients.forEach(ing => {
      ing.quantity = ing.quantity * newServings / state.recipe.servings
    });
    state.recipe.servings = Number(newServings)
}

export const addBookmark = function(recipe){
  state.bookmarks.push(recipe);
  if(recipe.id === state.recipe.id){
    state.recipe.bookmarked = true
  }
  presitBookmarks()
}
export const removeBookmark = function(recipeId){
   const index= state.bookmarks.findIndex(el => el.recipe === recipeId);
   state.bookmarks.splice(index,1);
   if(recipeId === state.recipe.recipe){
     state.recipe.bookmarked = false
   }
   presitBookmarks()
}

const presitBookmarks = function(){
  localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
}

const init = function(){
  const storage = localStorage.getItem('bookmarks');
  if(storage){
    state.bookmarks = JSON.parse(storage);
  }
}

init();

export const uploadRecipe = async function(newRecipe){
  try{
  const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
    const  ingArr = ing[1].replaceAll(' ', '').split(',');
    if(ingArr.length < 3) throw new Error('Wrong ingredient format! Please use the correct format :)')
    const [quantity,unit,description] = ingArr;
    return {
      quantity: quantity ? Number(quantity) : null,
      unit,
      description
    }
  });
  const recipe = {
        title:newRecipe.title,
        source_url:newRecipe.sourceUrl,
        image_url:newRecipe.image,
        publisher:newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings:+newRecipe.servings,
        ingredients
  }
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe =  createRecipeObject(data);
  addBookmark(state.recipe);
  }catch(erro){
    throw Error(erro)
  }
}
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import  * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import pagnationView from './views/pagnationView.js';
import bookmarkView  from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';
const controlRecipe = async function(){
  try{
      const urlHash = window.location.hash.slice(1);
      if(!urlHash) return
      recipeView.renderSpinner();

      // Loading Recipe
      await model.loadRecipe(urlHash);
            
      // Rendering Recipe
      recipeView.render(model.state.recipe);

      // Update result view to mark selected serach result
      resultView.update(model.getSearchResultsPage())

      //
      bookmarkView.update(model.state.bookmarks)

  }catch (error){
    recipeView.renderError(error)
  }
};


const controlSearchResults =  async function () {
   try{ 
   const query = searchView.getQuery();
   resultView.renderSpinner();
   if(!query) return;
   await model.loadSearchResults(query);
   if(model.state.search.results.length === 0){
      throw new Error ('Recipe you trying to search does not exist.Please try to search something else ')
   }
   resultView.render(model.getSearchResultsPage(1));
   // Render Pagnation Button
   pagnationView.render(model.state.search);
   }catch (error){
     resultView.renderError(error)
   }
}

const controlPagnation = function(goToPage){
  resultView.render(model.getSearchResultsPage(goToPage));
   pagnationView.render(model.state.search);
}

const controlServings = function(newServings){
  // Update the recipe serving (in state)
  model.updateServings(newServings)

  // Update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function(){
  // Bookmark the recipe
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
    bookmarkView.render(model.state.bookmarks)
  } 
   // UnBookmark the recipe
  else{
    model.removeBookmark(model.state.recipe.recipe);
    bookmarkView.render(model.state.bookmarks)
  }
  // Update the Recipe View
  recipeView.update(model.state.recipe);
}

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
   addRecipeView.renderSpinner();
   await model.uploadRecipe(newRecipe);
   // Render the Recipe to Recipe View
   recipeView.render(model.state.recipe);
   // Render the Recipe to bookmark
   bookmarkView.render(model.state.recipe);
   // Change the ID In the URL
   window.history.pushState(null,'',`#${model.state.recipe.id}`)

   setTimeout(function(){
    addRecipeView.toggleWindow();
   },MODEL_CLOSE_SEC * 1000)
  }catch(error){
   console.log(error);

  }
}
// Public-Subcriber

const init = function(){
   bookmarkView.addHandlerRender(controlBookmarks)
   recipeView.addHandlerRender(controlRecipe);
   recipeView.addHandlerUpdateServings(controlServings)
   recipeView.addHandlerAddBookmark(controlAddBookmark)
   searchView.addHandlerSearch(controlSearchResults);
   pagnationView.addHandlerClick(controlPagnation);
   addRecipeView.addHandlerSubmission(controlAddRecipe)
}
init();
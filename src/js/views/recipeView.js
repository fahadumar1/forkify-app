import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
import View from './view.js';

class recipeView extends View {
  _parentElement = document.querySelector('.recipe');
  //
  addHandlerRender(handler){
    ['hashchange','load'].forEach(ev => {
      window.addEventListener(ev,handler);
    });
  }
  //
  addHandlerUpdateServings(handler){
    this._parentElement.addEventListener('click',function(e){
      const updateServingsBtn = e.target.closest('.btn--tiny');
      if(!updateServingsBtn) return
      const btnVal = updateServingsBtn.dataset.updateTo;
      btnVal > 0 ? handler(btnVal) : '';
    });
  }

addHandlerAddBookmark(handler){
  this._parentElement.addEventListener('click',function(e){
    const bookmarkBtn = e.target.closest('.btn--bookmark');
    console.log(bookmarkBtn);
    if(!bookmarkBtn) return;
    handler()
  });
}
  _generateMarkup() {
    return `<figure class="recipe__fig">
          <img src="${this._data.featuredImage}" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes"> ${this._data.cookingTime} </span>
            <span class="recipe__info-text"> minutes </span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people"> ${this._data.servings} </span>
            <span class="recipe__info-text"> servings </span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}"> 
           <svg>
            <use href="${icons}#icons-user"> </use>
           </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data?.bookmarked ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">_data ingredients</h2>
          <ul class="recipe__ingredient-list">
           ${this._data.cookingIngredients
             .map(this.#generateMarkupIngredient)
             .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This _data was carefully designed and tested by
            <span class="_data__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank" >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
  //
  #generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
                <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity) : ''}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.quantity ? 'g' : ''}</span>
                  ${ing.description}
                </div>
            </li>`;
  }
}

export default new recipeView();

// Public-Subscriber
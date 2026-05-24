import View from './view.js';
import icons from 'url:../../img/icons.svg';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(data) {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
            <a class="preview__link ${id === data.recipe ? 'preview__link--active' : ''}" href="#${data.recipe}">
              <figure class="preview__fig">
                <img src="${data.featuredImage}" alt="${data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${data.title}</h4>
                <p class="preview__publisher">${data.publisher}</p>
                 <div class="recipe__user-generated ${data.key ? '' : 'hidden'}"> 
                  <svg>
                    <use href="${icons}#icons-user"> </use>
                    </svg>
                </div>              
              </div>
            </a>
          </li>`;
  }
}

export default new ResultView();

import View from './view.js'
import icons from 'url:../../img/icons.svg';

class PagnationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup(){
    const numPages = Math.ceil(this._data.results.length / this._data.resultPerPage);

    // Page 1 and there other pages
    if(this._data.page === 1 && numPages > 1){
        return this.#generateMarkupButton('next');
    }
    // First and Last Page
    if(this._data.page === numPages && numPages > 1){
         return this.#generateMarkupButton('prev');
    }
    // Other Page
    if(this._data.page < numPages){
        return this.#generateMarkupButton('both');
    }
    // Only First Page
    return ''
  }
 addHandlerClick(handler){
  this._parentElement.addEventListener('click',function(e){
   const btn = e.target.closest('.btn--inline');
   if(!btn) return
   const goToPage = Number(btn.dataset.goto);
   handler(goToPage);
  });
 }
 #generateMarkupButton(type) {
    const nextBtn = `
      <button  data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;

    const prevBtn = `
      <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>`;

    if (type === 'next') return nextBtn;
    if (type === 'prev') return prevBtn;
    if (type === 'both') return nextBtn + prevBtn;
  }
}

export default new PagnationView();
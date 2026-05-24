import icons from 'url:../../img/icons.svg';

export default class view {
  _data;
  //
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be render(e.g recipe) 
   */
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //
  _clear() {
    this._parentElement.innerHTML = '';
  }
  //
  renderSpinner() {
    const spinnerMarkup = `<div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }
  // Render Error View
  renderError(errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${errorMessage}</p>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const updatedMarkup = this._generateMarkup();
    const newDOM = document
      .createRange()
      .createContextualFragment(updatedMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach(function (newEle, i) {
      // Update the Content Only
      const currEle = currElements[i];
      if (
        !newEle.isEqualNode(currEle) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        currEle.textContent = newEle.textContent;
      }
      // Update the Attribute
      if (!newEle.isEqualNode(currEle)) {
        Array.from(newEle.attributes).forEach(function (attr) {
          currEle.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
}

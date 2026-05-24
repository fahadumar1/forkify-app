import View from './view.js'
import icons from 'url:../../img/icons.svg';

class RecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  __btnOpen = document.querySelector('.nav__btn--add-recipe');
  __btnClose = document.querySelector('.btn--close-modal');

  constructor(){
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  //
  toggleWindow(){
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  //
  _addHandlerShowWindow(){
   this.__btnOpen.addEventListener('click', () =>{
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
   });
  }
  //
  _addHandlerHideWindow(){
   this.__btnClose.addEventListener('click', () =>{
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden')
   });
  }
  //
  addHandlerSubmission(handler){
    this._parentElement.addEventListener('submit',function(e){
       e.preventDefault();
       const dataArr = [...new FormData(this)];
       const data = Object.fromEntries(dataArr)
       handler(data)
    });
  }
  _generateMarkup(){

  }

}

export default new RecipeView();
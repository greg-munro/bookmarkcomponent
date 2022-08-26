/*
global
Bookmark
include
*/

/* global Bookmark */ 
class Bookmark {
  constructor (elementId, options) {
    this.elementId = elementId
    const DEFAULTS = {
    }
    this.options = Object.assign({}, DEFAULTS, options)
    const el = document.getElementById(this.elementId)
    if (el) {
      el.addEventListener('click', this.handleClick.bind(this))
      let html =
      `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
        <title>Bookmark</title>
        <path d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z" fill="none" stroke="currentColor"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
        </svg>`
      el.innerHTML = html
    }    
  }
  handleClick (event) {  
    if (this.options.onClick) {
      this.options.onClick(event)
      // if (myForm.style.display = 'block') {
      //   closeForm() 
      // } 
      // else {
      //   openForm()
      // }
    } 
  }
}

const myForm = document.getElementById('myForm')

function openForm () {
  if (myForm) { 
    myForm.style.display = 'block'
  }
}
function closeForm () {
  myForm.style.display = 'none'
}

const createNew = document.getElementById('createForm')

function createNewBookmark () {
  createNew.style.display = 'block'
}


const bookmarkTest = new Bookmark('websy-bookmark')

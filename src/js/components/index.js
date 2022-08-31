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
      let html = `<div>
      <svg xmlns='http://www.w3.org/2000/svg' class='bookmarkBtn' viewBox='0 0 512 512'>
        <title>Bookmark</title>
        <path d='M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z' fill='none' stroke='currentColor'
          stroke-linecap='round' stroke-linejoin='round' stroke-width='32' />
        </svg>
        <div class='bookmarkPopup' id='bookmarkPopup'></div>
        <div class='bookmarkContainer' id='bookmarkContainer'>
          <div class='bookmark-topline'>
            <span>Bookmarks</span><button class='createNew'>Create new bookmark</button>
          </div>
          <div class='btn'>
          </div>
          <div>
            <svg class='search-icon' xmlns='http://www.w3.org/2000/svg' viewbox='0 0 512 512'>
              <title>Search</title>
              <path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' fill='none'
                stroke='currentColor' stroke-miterlimit='10' stroke-width='32' />
              <path fill='none' stroke='currentColor' stroke-linecap='round' stroke-miterlimit='10' stroke-width='32'
                d='M338.29 338.29L448 448' />
            </svg>
            <input class='search' type='search'>
          </div>
          <hr>
          <div class='public'>
            <svg class='caret' xmlns='http://www.w3.org/2000/svg' viewbox='0 0 512 512'>
              <title>Caret Down</title>
              <path
                d='M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z' />
            </svg>
            <h4>Public bookmarks <span id="publicCount">(0)</span></h4>
            <div id="public-placeholder"><p class='public-text'>You have no public bookmarks</p>
            <p class='public-text'>Right-click on a bookmark and select 'Make public'.</p>
            </div>
          </div>
          <div class='my-bookmarks'>
            <svg class='caret' xmlns='http://www.w3.org/2000/svg' viewbox='0 0 512 512'>
              <title>Caret Down</title>
              <path
                d='M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z' />
            </svg>
            <h4>My bookmarks <span id="myBookmarkCount">(0)</span></>
            <div id="mybookmarks-placeholder"><p class='public-text'>You have no public bookmarks</p>
            <p class='public-text'>Right-click on a bookmark and select 'Make public'.</p>
            </div>
          </div>
        </div>
      </div>
      <div class='createNewPopup' id='createForm'>
    <div class='createTopline'>
      <h2>Create bookmark</h2>
      <hr>
      <svg xmlns='http://www.w3.org/2000/svg' class='closeCreate' viewbox='0 0 512 512'>
        <title>Close</title>
        <path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'
          d='M368 368L144 144M368 144L144 368' />
      </svg><br>
    </div>
    <div>
    <label for='bookmarkName'>Title</label><br>
      <input type='text' id='bookmarkName' name='bookmarkName'>
      <label for='bookmarkDescription'>Description <span class='optional'>(optional)</span></label><br>
      <input type='text' id='bookmarkDescription' name='bookmarkDescription'>
      <button class='createSubmit' id='createSubmit'>Create</button>
    </div>
  </div>
    `
      el.innerHTML = html
      this.render()
    }    
  }
  
  render () {
    const bookmarkTitle = document.getElementById('bookmarkName')
    const bookmarkDescription = document.getElementById('bookmarkDescription')
    let publicCount = document.getElementById('publicCount')
    let publicBookmarks = []
    let myBookmarksCount = document.getElementById('myBookmarkCount')
    let myBookmarks = []
    this.options.app.createSessionObject(
      {
        'qInfo': {
          'qId': 'BookmarkList',
          'qType': 'BookmarkList'
        },
        'qBookmarkListDef': {
          'qType': 'bookmark',
          'qData': {
            'title': '/qMetaDef/title',
            'description': '/qMetaDef/description',
            'sheetId': '/sheetId',
            'selectionFields': '/selectionFields',
            'creationDate': '/creationDate'
          }
        }
      }
    )
      .then((model) => {
        model.getLayout().then(layout => {
          console.log(layout)
          layout.qBookmarkList.qItems.forEach(d => {
            if (d.qMeta.published === true) {
              publicBookmarks.push(d)
            } 
            else {
              myBookmarks.push(d)
            }
          })
          let publicHtml = ''
          publicBookmarks.forEach(bookmark => {
            publicHtml += `
            <div>
              <h6>${bookmark.qMeta.title}</h6>
              <hr>
            </div>`
          })
          let bookmarkHtml = ''
          myBookmarks.forEach(bookmark => {
            bookmarkHtml += `
              <div>
               <h6>${bookmarkTitle.value}</h6>
               <p>${bookmarkDescription.value}</p>
              </div>
              `
          })
          const publicPlaceholder = document.getElementById('public-placeholder')
          publicPlaceholder.innerHTML = publicHtml
          const myBookmarksPlaceholder = document.getElementById('mybookmarks-placeholder')
          myBookmarksPlaceholder.innerHTML = bookmarkHtml 
          publicCount.textContent = `(` + publicBookmarks.length + `)`
        })
      })
  }

  handleClick (event) {  
    const bookmarkTitle = document.getElementById('bookmarkName')
    const bookmarkDescription = document.getElementById('bookmarkDescription')
    if (event.target.classList.contains('bookmarkBtn')) {
      openForm() 
    } 
    if (event.target.classList.contains('bookmarkPopup')) {
      closeForm() 
    } 
    if (event.target.classList.contains('createNew')) {
      createNewBookmark()
    }
    if (event.target.classList.contains('closeCreate')) {
      closeBookmark()
    }
    if (event.target.classList.contains('createSubmit')) {
      this.options.app.createBookmark(
        {
          qInfo: {
            qType: 'bookmark'
          },
          qMetaDef: {
            title: `${bookmarkTitle.value}`,
            description: `${bookmarkDescription.value}`
          }
        }
      )
      closeBookmark()
    }
  }
}

function openForm () {
  const myForm = document.getElementById('bookmarkPopup')
  if (myForm) { 
    myForm.style.display = 'block'
  }
  const bookmarkContainer = document.getElementById('bookmarkContainer')
  if (bookmarkContainer) { 
    bookmarkContainer.style.display = 'block'
  }
}
function closeForm () {
  const myForm = document.getElementById('bookmarkPopup')
  myForm.style.display = 'none'
  const bookmarkContainer = document.getElementById('bookmarkContainer')
  if (bookmarkContainer) { 
    bookmarkContainer.style.display = 'none'
  }
}

function createNewBookmark () {
  const createNew = document.getElementById('createForm')
  createNew.style.display = 'flex' 
}

function closeBookmark () {
  const createNew = document.getElementById('createForm')
  createNew.style.display = 'none'
}

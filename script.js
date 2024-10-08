// selectors
const $ = (selector) => document.querySelector(selector);
// - main
const booksContainer = $('[data-books-container]');
const addBookButton = $('[data-add-book-button]');
const overlay = $('.overlay');
const nullStateContainer = $('[data-null-state-container]')
// - modal
const addBookModal = $('[data-add-book-modal]');
const titleInput = $('[data-title-input]');
const authorInput = $('[data-author-input]');
const numOfPagesInput = $('[data-num-of-pages-input]');
const formTextInputs = [titleInput, authorInput, numOfPagesInput];
const readRadioOptions = document.querySelectorAll('[data-read-indicator]');
const defaultSelectedRadioButton = $('input#no');
const submitBookButton = $('[data-submit-book-button]');
const closeModalButton = $('[data-close-button]');

// functions
// - object
function Book(title, author, numOfPages, haveRead) {
  this.title = title;
  this.author = author;
  this.numOfPages = numOfPages;
  this.haveRead = haveRead;
}

Book.prototype.addToReadingList = function (readingListName) {
  readingListName.unshift(this);
  console.log('reading list!!')
  console.log({ readingListName })
}

Book.prototype.toggleReadStatus = function () {
  this.haveRead = !this.haveRead;
}

// - data
const createBookObject = () => {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const numOfPages = numOfPagesInput.value.trim();
  const haveRead = Array.from(readRadioOptions).some(radio => radio.checked);

  if (validateForm()) {
    const newBook = new Book(title, author, numOfPages, haveRead);
    newBook.addToReadingList(myReadingList);
  }
}

const createBookListing = (book, index) => {
  // create book div
  const bookDiv = document.createElement('div');
  bookDiv.className = 'book';

  bookDiv.setAttribute('data-index', index);

  bookDiv.innerHTML = `
    <p class='title'>${book.title}</p>
    <p class='author'>${book.author}</p>
    <div class='read-label'><span class='checkmark'>&#x2714;</span>  Read</div>
    <div class='book-options-menu'>
      <button class='toggle-read-button'>Toggle read status</button>
      <button class='delete-book-button'>Delete book</button>
    </div>
    <div class='book-footer'>
      <p class='num-of-pages'>${book.numOfPages} pages</p>
      <button class='book-options-icon'>&#8943;</button>
    </div>
  `

  const readLabel = bookDiv.querySelector('.read-label');

  if (book.haveRead) {
    readLabel.classList.add('active');
  }

  return bookDiv;
}

const renderBooksContainer = () => {
  toggleNullState(false);
  booksContainer.innerHTML = '';

  const fragment = document.createDocumentFragment();

  myReadingList.forEach((book, index) => {
    let bookDiv = createBookListing(book, index);
    console.dir(bookDiv);
    fragment.appendChild(bookDiv);
  })

  const allOptionsMenus = fragment.querySelectorAll('.book-options-menu');

  fragment.childNodes.forEach((bookDiv, index) => {
    const optionsButton = bookDiv.querySelector('.book-options-icon');
    const bookFooter = optionsButton.parentElement;
    const optionsMenu = bookFooter.previousElementSibling;

    const toggleReadButton = bookDiv.querySelector('.toggle-read-button');
    const deleteBookButton = bookDiv.querySelector('.delete-book-button');

    optionsButton.addEventListener('click', (e) => {
      e.stopPropagation();

      console.log('button clicked.');
      allOptionsMenus.forEach((menu) => {
        if (menu !== optionsMenu) {
          menu.classList.remove('active')
        } else {
          optionsMenu.classList.toggle('active')
          activeOptionsMenu = optionsMenu.classList.contains('active');
        }
      })
    })

    toggleReadButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('toggle read clicked.')
      myReadingList[index].toggleReadStatus();
      console.log('myReadingList[index].toggleReadStatus ran');
      renderBooksContainer();
    })

    deleteBookButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('delete book clicked.')
      myReadingList.splice(index, 1);
      console.log('myReadingList.splice ran')
      console.log(myReadingList);
      renderBooksContainer();
      displayMainContent();
    })

    document.addEventListener('click', () => {
      if (activeOptionsMenu) {
        allOptionsMenus.forEach((menu) => {
          menu.classList.remove('active');
        })
      }
    })
  })

  booksContainer.appendChild(fragment);
  booksContainer.classList.add('active');

  toggleModal(false);
}

const updateError = (inputField, message, errorOccurred) => {
  const formGroup = inputField.parentElement;
  const errorDisplay = formGroup.querySelector('[data-error-message]');

  formGroup.classList.toggle('error', errorOccurred);
  errorDisplay.textContent = errorOccurred ? message : '';
}

const validateField = (inputField, errorMessage) => {
  const isEmpty = inputField.value.trim() === '';
  updateError(inputField, errorMessage, isEmpty);

  return !isEmpty; // true indicates valid field
}

const validateForm = () => {
  const titleValid = validateField(titleInput, 'Please enter a title.');
  const authorValid = validateField(authorInput, 'Please enter an author.');
  const numOfPagesValid = validateField(numOfPagesInput, 'Please enter number of pages.');

  return titleValid && authorValid && numOfPagesValid;
}

// - UI
const toggleModal = (isActive) => {
  addBookModal.classList.toggle('active', isActive);
  overlay.classList.toggle('active', isActive);
  formTextInputs.forEach((input) => {
    updateError(input, '', false);
  })

  resetModalInputs();
}

const resetInput = (inputName) => {
  inputName.value = ''
}

const resetModalInputs = () => {
  resetInput(titleInput);
  resetInput(authorInput);
  resetInput(numOfPagesInput);
  defaultSelectedRadioButton.checked = true;
}

const toggleNullState = (isVisible) => {
  nullStateContainer.classList.toggle('active', isVisible);
}

const toggleBooksContainer = (isVisible) => {
  booksContainer.classList.toggle('active', isVisible);
}

// flow
// - data
const myReadingList = [
  // books for testing purposes

  // new Book('Salt, Fat, Acid, Heat', 'Samin Nosrat', 480),
  // new Book('The Omnivore’s Dilemma', 'Michael Pollan', 450),
  // new Book('Kitchen Confidential', 'Anthony Bourdain', 320),
  // new Book('The Joy of Cooking', 'Irma S. Rombauer', 1152),
  // new Book('The Art of Simple Food', 'Alice Waters', 416),
  // new Book('On Food and Cooking: The Science and Lore of the Kitchen', 'Harold McGee', 896),
  // new Book('Mastering the Art of French Cooking', 'Julia Child', 684),
  // new Book('How to Cook Everything', 'Mark Bittman', 1056),
  // new Book('Animal, Vegetable, Miracle', 'Barbara Kingsolver', 384),
  // new Book('The Flavor Bible', 'Karen Page, Andrew Dornenburg', 392)
];

let activeOptionsMenu = null;

// - interactions
addBookButton.addEventListener('click', () => toggleModal(true));

submitBookButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (validateForm()) {
    createBookObject();
    renderBooksContainer();
  }
})

overlay.addEventListener('click', () => { toggleModal(false); });

closeModalButton.addEventListener('click', () => { toggleModal(false); });

const displayMainContent = () => {
  myReadingList.length === 0 ? toggleNullState(true) : renderBooksContainer();
}

// - page load
displayMainContent();
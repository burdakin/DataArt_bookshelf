var queryObj = null;
var idArray = [];
var pageIndex = 1;
var selectedBook = null;

document.addEventListener('DOMContentLoaded', footerLogic);
document.addEventListener('DOMContentLoaded',renderList);

class Input {
    constructor() {
        this.input = document.getElementById('search-input').value.toString().toLowerCase();
    }
}

class BookTitle {
    constructor(title) {
        this.title = title;
    }
}

async function getQuery(query, page) {
    let url = `https://openlibrary.org/search.json?q=${query}&page=${page}`;
    let result = await fetch(url);
    return await result.json();
}

async function getList() {
    this.page = pageIndex;
    let query = new Input().input;
    let data = await getQuery(query, page);
    queryObj = await data;
    await console.log(data);
    await renderTitle();
}

function renderTitle() {
    idArray = [];
    for (let i = 0; i < queryObj.docs.length; i++) {
        let title = new BookTitle(queryObj.docs[i].title);
        let identificator = queryObj.docs[i].key.toString(); //
        idArray.push(identificator);
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', `title${i}`);
        document.getElementById('search-results').appendChild(titleElement);
        let newTitle = `<input type="radio" class="title-text" id="title-text${i}" name="titles" value="${identificator}">
            <label for="title-text${i}">${title.title}</label>`;
        document.getElementById(`title${i}`).innerHTML = newTitle;
    }
    document.getElementById('found').innerHTML = `${queryObj.numFound} books were found`;
    document.getElementById('search-results').addEventListener('click', eventRadioHandler);
}

function footerLogic() {
    document.getElementById('back').addEventListener('click', () => {
        if (pageIndex <= 1) {
            alert('Already first page')
        } else {
            pageIndex--
            getList()
                .then(() => {
                    pageIndex = pageIndex;
                })
        }
        ;
    })
    document.getElementById('fwd').addEventListener('click', () => {
        pageIndex++
        getList()
            .then(() => {
                pageIndex = pageIndex;
            })
    });
}

function eventRadioHandler(event) {
    if (event.target.checked === true) {
        if (document.getElementById('container') !== null) {
            document.getElementById('container').remove();
        }
        let value = event.target.defaultValue;
        let index = null;
        for (let comparison of idArray) {
            if (value == comparison) {
                index = idArray.indexOf(comparison);
            }
        }
        let book = queryObj.docs[index];
        let publishDate = () => {
            if (book.publish_date !== undefined) {
                return book.publish_date
            } else {
                return 'No information'
            }
        }
        let bookToDisplay = new Book(book.title, book.subtitle, book.author_name, book.language, book.has_fulltext, publishDate(), book.publish_year);
        selectedBook = bookToDisplay;
        console.log(selectedBook);
        bookToDisplay.render();
    }
}

class Book {
    constructor(title, subtitle, author, langs, fText, firstPublished, yrsPublished) {
        this.title = title;
        this.subtitle = subtitle;
        this.author = author;
        this.langs = langs;
        this.fText = fText;
        this.firstPublished = firstPublished;
        this.yrsPublished = yrsPublished;
    }

    render() { //переделать через цикл и массив
        let parentDiv = document.createElement('section');
        parentDiv.setAttribute('id', 'container');
        document.getElementById('select').appendChild(parentDiv)


        let renderTitle = document.createElement('div');
        renderTitle.setAttribute('id', 'selected_title');
        renderTitle.setAttribute('class', 'selected_title');
        document.getElementById('container').appendChild(renderTitle);
        renderTitle.innerHTML = `Title: ${this.title}`;

        if (this.subtitle !== undefined) {
            let renderSub = document.createElement('div');
            renderSub.setAttribute('id', 'selected_sub');
            renderSub.setAttribute('class', 'selected_sub');
            document.getElementById('container').appendChild(renderSub);
            renderSub.innerHTML = `Subtitle: ${this.subtitle}`;
        }

        let renderAuthor = document.createElement('div');
        renderAuthor.setAttribute('id', 'selected_auth');
        renderAuthor.setAttribute('class', 'selected_auth');
        document.getElementById('container').appendChild(renderAuthor);
        renderAuthor.innerHTML = `Author: ${this.author}`;

        if (this.langs !== undefined) {
            let renderLangs = document.createElement('div');
            renderLangs.setAttribute('id', 'selected_langs');
            renderLangs.setAttribute('class', 'selected_langs');
            document.getElementById('container').appendChild(renderLangs);
            renderLangs.innerHTML = `This book is available in following languages: ${this.langs}`;
        }

        let renderText = document.createElement('div');
        renderText.setAttribute('id', 'selected_text');
        renderText.setAttribute('class', 'selected_text');
        document.getElementById('container').appendChild(renderText);
        if (this.fText == true) {
            renderText.innerHTML = 'Full text is available';
        } else if (this.fText == false) {
            renderText.innerHTML = 'Full text is unavailable';
        }
        ;

        if (this.firstPublished !== null || undefined) {
            let renderFP = document.createElement('div');
            renderFP.setAttribute('id', 'selected_fp');
            renderFP.setAttribute('class', 'selected_fp');
            document.getElementById('container').appendChild(renderFP);
            renderFP.innerHTML = `First published: ${this.firstPublished}`;
        }

        if (this.yrsPublished !== null || undefined) {
            let renderYrs = document.createElement('div');
            renderYrs.setAttribute('id', 'selected_yrs');
            renderYrs.setAttribute('class', 'selected_yrs');
            document.getElementById('container').appendChild(renderYrs);
            renderYrs.innerHTML = `Was published in ${this.yrsPublished}`;
        }

        let addToReadList = document.createElement('button');
        addToReadList.setAttribute('id', 'add-btn');
        addToReadList.setAttribute('class', 'add-btn');
        document.getElementById('container').appendChild(addToReadList);
        addToReadList.innerHTML = 'Add to read list';
        addToReadList.addEventListener('click', addBtn);
    }
}

// ----------------------------------------------- ТУТ ПОШЛА ЧАСТЬ ПРО ТУРИДЛИСТ --------------------------------------

var localIndex = localStorage.length;

function addToReadList() {
    selectedBook.read = false;
    localStorage.setItem(localStorage.length.toString(), JSON.stringify(selectedBook));
    renderList();
    localIndex++;
}

function addBtn() {
    if (localStorage.length == 0) {
        localIndex = 0;
        addToReadList();
    } else if (localIndex > 0) {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let parse = JSON.parse(localStorage[i]);
            if (parse.title == selectedBook.title) {
                count++;
            }
        }
        if (count == 0) {
            addToReadList();
        }
    }
}

function renderList() {
    for (let i=0; i<localStorage.length;i++) {
        if (JSON.parse(localStorage[i]).read == false) {
            renderWishes(i);
        } else if (localStorage[i].read== true) {
            renderRead(i)
        }
    }
}

function renderWishes(index) {
    let wishBook = document.createElement('div');
    wishBook.setAttribute('id',`wish${index}`);
    wishBook.setAttribute('class','wish');
    wishBook.innerHTML = `
    <p class='wish-title'>${JSON.parse(localStorage[index]).title} (${JSON.parse(localStorage[index]).langs})</p>
    <p class='subtitle'>${JSON.parse(localStorage[index]).subtitle}</p>
    <p class='author'>By ${JSON.parse(localStorage[index]).author}</p>
    <button id='mark' class="button">Mark as read</button>
    <button id='del' class="button">Remove from list</button>
    `;
    document.getElementById('wishlist').appendChild(wishBook);

}

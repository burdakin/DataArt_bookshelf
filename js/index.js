var queryObj = null;
var idArray = [];
var pageIndex = 1;
var selectedBook = null;

document.addEventListener('DOMContentLoaded', footerLogic);
document.addEventListener('DOMContentLoaded', renderList);
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            document.getElementById('search-btn').click();
        }
    })
});

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
    let query = () => {
        if (new Input().input == '') {
            alert('Type something to start searching:)');
            return '';
        } else {
            return new Input().input;
        }
    };
    let data = await getQuery(query(), this.page);
    queryObj = await data;
    await console.log(data);
    await renderTitle();
}

function renderTitle() {
    idArray = [];
    if (document.getElementById('search-results') !== '') {
        document.getElementById('search-results').innerHTML = ''
    };
    for (let i = 0; i < queryObj.docs.length; i++) {
        let title = new BookTitle(queryObj.docs[i].title);
        let lang = () => {
            if (queryObj.docs[i].language !== undefined) {
                return `(${queryObj.docs[i].language.toString()})`;
            } else {
                return '';
            };
        }

        let identificator = queryObj.docs[i].key.toString(); //
        idArray.push(identificator);
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', `title${i}`);
        titleElement.setAttribute('class', 'title-item');
        document.getElementById('search-results').appendChild(titleElement);
        let newTitle = `<input type="radio" class="title-text" id="title-text${i}" name="titles" value="${identificator}">
            <label for="title-text${i}"><p>${title.title} ${lang()}</p></label>`;
        document.getElementById(`title${i}`).innerHTML = newTitle;
    }
    document.getElementById('found').innerHTML = `${queryObj.numFound} books were found`;
    document.getElementById('search-results').addEventListener('click', eventRadioHandler);
    document.getElementById('footer-btns').style.display = 'flex';
    if (pageIndex == 1) {
        document.getElementById('back').style.opacity = '30%';
        document.getElementById('back').style.pointerEvents = 'none';
    } else {
        document.getElementById('back').style.opacity = '100%';
        document.getElementById('back').style.pointerEvents = 'auto';
    }
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

    render() {
        let parentDiv = document.createElement('section');
        parentDiv.setAttribute('id', 'container');
        document.getElementById('select').appendChild(parentDiv)


        let renderTitle = document.createElement('div');
        renderTitle.setAttribute('id', 'selected_title');
        renderTitle.setAttribute('class', 'selected_title');
        document.getElementById('container').appendChild(renderTitle);
        renderTitle.innerHTML = `<p>${this.title}</p>`;

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

var localIndex = () => {
    let max = 0;
    for (let key in localStorage) {
        if (max < Number(key)) {
            max = Number(key);
        }
    }
    return max + 1;
};

function addToReadList() {
    selectedBook.read = false;
    localStorage.setItem(localIndex().toString(), JSON.stringify(selectedBook));
    renderList();
}

function addBtn() {
    if (localStorage.length == 0) {
        addToReadList();
    } else if (localIndex() > 0) {
        let count = 0;
        for (let i in localStorage) {
            if (localStorage.hasOwnProperty(i)) {
                let parse = JSON.parse(localStorage[i]);
                if (parse.title == selectedBook.title) {
                    count++;
                }
            }
        }
        if (count == 0) {
            addToReadList();
        }
    }
}

function renderList() {
    clearList();
    for (let key in localStorage) {
        if (JSON.parse(localStorage[key]).read == false) {
            renderWishes(key);
        } else if (JSON.parse(localStorage[key]).read == true) {
            renderRead(key)
        }
    }
}


function renderWishes(index) {
    let wishBook = document.createElement('div');
    wishBook.setAttribute('id', `wish${index}`);
    wishBook.setAttribute('class', 'wish');
    wishBook.innerHTML = `
    <p class='wish-title'>${JSON.parse(localStorage[index]).title} (${JSON.parse(localStorage[index]).langs})</p>
    <p class='subtitle'>${JSON.parse(localStorage[index]).subtitle}</p>
    <p class='author'>By ${JSON.parse(localStorage[index]).author}</p>
    <button id= mark${index} data-id=${index} class="button">Mark as read</button>
    <button id= del${index} data-id=${index} class="button">Remove from list</button>
    `;
    document.getElementById('wishlist').appendChild(wishBook);
    document.getElementById('wishlist').addEventListener('click', (e) => {
        if (e.target.innerHTML == 'Mark as read') {
            index = e.target.dataset.id;
            markRead(index);
        }
    });
    document.getElementById('wishlist').addEventListener('click', (e) => {
        if (e.target.innerHTML == 'Remove from list') {
            index = e.target.dataset.id;
            deleteBook(index);
        }
    });
}

function clearList() {
    let read = document.getElementById('read');
    let wish = document.getElementById('wishlist');
    if (wish !== null || read !== null) {
        wish.remove();
        read.remove();
    }
    let newRead = document.createElement('div');
    newRead.setAttribute('class', 'read');
    newRead.setAttribute('id', 'read');
    document.getElementById('done').appendChild(newRead);

    let newWish = document.createElement('div');
    newWish.setAttribute('class', 'wishlist');
    newWish.setAttribute('id', 'wishlist');
    document.getElementById('wish').appendChild(newWish);

}

function renderRead(index) {
    let readBook = document.createElement('div');
    readBook.setAttribute('id', `readItem${index}`);
    readBook.setAttribute('class', 'readItem');
    readBook.innerHTML = `
    <p class='read-title'>${JSON.parse(localStorage[index]).title} (${JSON.parse(localStorage[index]).langs})</p>
    <p class='read-author'>By ${JSON.parse(localStorage[index]).author}</p>
    `;
    document.getElementById('read').appendChild(readBook);
}

function markRead(index) {
    let obj = JSON.parse(localStorage[index]);
    obj.read = true;
    localStorage.setItem(index.toString(), JSON.stringify(obj));
    renderList();
}

function deleteBook(index) {
    localStorage.removeItem(index);
    renderList();
};

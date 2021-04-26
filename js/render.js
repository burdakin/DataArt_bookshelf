import {addBtn} from "./wishlist.js";
import {loader, loaderColor, removeLoader} from "./loader.js";
import {getQuery} from "./api.js";

var idArray = [];
export var selectedBook = null;
export var queryObj = null;
var pageIndex = 1;

class Input {
    constructor() {
        this.input = document.getElementById('search-input').value.toString().toLowerCase();
    }
}

export class BookTitle {
    constructor(title) {
        this.title = title;
    }
}

export async function getList() {
    loader();
    var timer = setInterval(function () {
        document.getElementById('load').style.backgroundColor = 'rgba(' + loaderColor() + ',' + loaderColor() + ',' + loaderColor() + ',0.5)';
    }, 300);
    let query = () => {
        if (new Input().input == '') {
            alert('Type something to start searching:)');
            return '';
        } else {
            return new Input().input;
        }
    };
    let data = await getQuery(query(), pageIndex);
    queryObj = await data;
    await console.log(data);
    removeLoader();
    clearInterval(timer)
    await renderTitle();
}

export function footerLogic() {
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

export function renderTitle() {
    idArray = [];
    if (document.getElementById('search-results') !== '') {
        document.getElementById('search-results').innerHTML = '';
    }
    ;
    for (let i = 0; i < queryObj.docs.length; i++) {
        let title = new BookTitle(queryObj.docs[i].title);
        let lang = () => {
            if (queryObj.docs[i].language !== undefined) {
                return `(${queryObj.docs[i].language.toString()})`;
            } else {
                return '';
            }
            ;
        }

        let identificator = queryObj.docs[i].key.toString(); //
        idArray.push(identificator);
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', `title${i}`);
        titleElement.setAttribute('class', 'titles__title-item');
        document.getElementById('search-results').appendChild(titleElement);
        let newTitle = `<input type="radio" class="titles__title-text" id="title-text${i}" name="titles" value="${identificator}">
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

        function renderField(id, cls, idToAppend, element, innerH) {
            if (selectedBook[element] !== undefined) {
                let elem = document.createElement('div');
                elem.setAttribute('id', id);
                elem.setAttribute('class', cls);
                document.getElementById(idToAppend).appendChild(elem);
                elem.innerHTML = innerH;
            }
        }

        renderField('selected_title', 'select__selected_title',  'container', 'title', `<p>${this.title}</p>`);
        renderField('selected_sub', 'select__selected_sub', 'container', 'subtitle', `Subtitle: ${this.subtitle}`);
        renderField('selected_auth','select__selected_auth', 'container', 'author', `Author: ${this.author}`);
        renderField('selected_langs', 'select__selected_langs', 'container', 'langs', `This book is available in following languages: ${this.langs}`);

        let renderText = document.createElement('div');
        renderText.setAttribute('id', 'selected_text');
        renderText.setAttribute('class', 'select__selected_text');
        document.getElementById('container').appendChild(renderText);
        if (this.fText == true) {
            renderText.innerHTML = 'Full text is available';
        } else if (this.fText == false) {
            renderText.innerHTML = 'Full text is unavailable';
        }
        ;

        renderField('selected_fp','select__selected_fp', 'container', 'firstPublished', `First published: ${this.firstPublished}`);
        renderField('selected_yrs','select__selected_yrs', 'container', 'yrsPublished', `Was published in ${this.yrsPublished}`);

        let addToReadList = document.createElement('button');
        addToReadList.setAttribute('id', 'add-btn');
        addToReadList.setAttribute('class', 'select__add-btn');
        document.getElementById('container').appendChild(addToReadList);
        addToReadList.innerHTML = 'Add to read list';
        addToReadList.addEventListener('click', addBtn);
    }
}
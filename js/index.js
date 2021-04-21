var queryObj = null;
var idArray = [];

document.addEventListener('DOMContentLoaded', footerLogic);

class Input {
    constructor() {
        this.input = document.getElementById('search-input').value.toString().toLowerCase();
    }
}

async function getQuery(query, page) {
    let url = `https://openlibrary.org/search.json?q=${query}&page=${page}`;
    let result = await fetch(url);
    return await result.json();
}

async function getList(page) {
    this.page = page;
    let query = new Input().input;
    let data = await getQuery(query, page);
    queryObj = await data;
    await console.log(data);
    await renderTitle();
}


class BookTitle {
    constructor(title) {
        this.title = title;
    }
}

function renderTitle() {
    for (let i = 0; i < queryObj.docs.length; i++) {
        let title = new BookTitle(queryObj.docs[i].title);
        let identificator = queryObj.docs[i].edition_key[0];
        idArray.push(identificator);
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', `title${i}`);
        document.getElementById('search-results').appendChild(titleElement);
        let newTitle = `<input type="radio" class="title-text" id="title-text${i}" name="titles" value="${identificator}">
            <label for="title-text${i}">${title.title}</label>`;
        document.getElementById(`title${i}`).innerHTML = newTitle;
    }
    let found = queryObj.numFound;
    document.getElementById('found').innerHTML = `${found} books were found`;
    document.getElementById('search-results').addEventListener('click', eventRadioHandler);
}

function footerLogic() {
    document.getElementById('back').addEventListener('click', () => {
        if (getList().page > 2) {
            getList(this.page - 1)
                .then(() => {
                    this.page -= 1
                })
        } else {
            alert('Already first page')
        }
        ;
    });
    document.getElementById('fwd').addEventListener('click', () => {
        getList(page + 1)
            .then(() => {
                this.page += 1
            })
    });
}

function eventRadioHandler(event) {
    if (event.target.checked === true) {
        let value = event.target.defaultValue;
        let index = null;
        for (let comparison of idArray) {
            if (value == comparison) {
                index = idArray.indexOf(comparison);
            }
        }

        // тут вызов нового конструктора и его отрисовка

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
}
var queryObj = null;

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
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', `title${i}`);
        document.getElementById('search-results').appendChild(titleElement);
        let newTitle = `<input type="radio" class="title-text" id="title-text${i}" name="titles" value="${queryObj.docs[i].edition_key}">
            <label for="title-text${i}">${title.title}</label>`;
        document.getElementById(`title${i}`).innerHTML = newTitle;
    }
    let found = queryObj.numFound;
    document.getElementById('found').innerHTML = `${found} books were found`;
}

function footerLogic() {
    document.getElementById('back').addEventListener('click', () => {
        if (getList().page > 2) {
            getList(this.page - 1)
                .then(() => {
                    this.page -= 1
                })
        } else {alert('Already first page')};
    });
    document.getElementById('fwd').addEventListener('click', () => {
        getList(page + 1)
            .then(() => {
                this.page += 1
            })
    });
}


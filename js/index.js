var queryObj = null;

async function getQuery(query, page) {
    let url = `https://openlibrary.org/search.json?q=${query}&page=${page}`;
    let result = await fetch(url);
    return await result.json();
}

async function test() {
    let query = document.getElementById('search-input').value.toString().toLowerCase();
    let data = await getQuery(query, 1);
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
}

function addFooterButtons (/*текущая страница*/) {
    //Функция добавления кнопок следующей и предыдущей страницы в футере результатов
}

var queryObj = null;

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
    addFooterButtons();
}

function addFooterButtons() {
    let page = (queryObj.start / 100) - 1;
    let back = document.createElement('button');
    back.setAttribute('id', 'back');
    back.setAttribute('class', 'back-btn');
    document.getElementById('search-footer').appendChild(back);
    document.getElementById('back').innerHTML = 'Вперед';

    document.getElementById('search-footer').addEventListener('click', (e) => {
        console.log(e);

        if (e.target.id == 'back') {
            getList(page + 1).then();
        }
    })

}

/*
TODO - Проверить все кавычки;

 */
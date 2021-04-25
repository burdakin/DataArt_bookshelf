import {selectedBook} from "./render.js";

export var localIndex = () => {
    let max = 0;
    for (let key in localStorage) {
        if (max < Number(key)) {
            max = Number(key);
        }
    }
    return max + 1;
};

export function addToReadList() {
    selectedBook.read = false;
    localStorage.setItem(localIndex().toString(), JSON.stringify(selectedBook));
    renderList();
}

export function addBtn() {
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

export function renderList() {
    clearList();
    for (let key in localStorage) {
        if (JSON.parse(localStorage[key]).read == false) {
            renderWishes(key);
        } else if (JSON.parse(localStorage[key]).read == true) {
            renderRead(key)
        }
    }
};

export function renderWishes(index) {
    let unknown = (element) => {
        if (JSON.parse(localStorage[index])[element] !== undefined) {
            if (element == 'langs') {
                return `(${JSON.parse(localStorage[index]).langs})`;
            } else {
                return JSON.parse(localStorage[index])[element]
            }
        } else {
            return '';
        }
    };
    let wishBook = document.createElement('div');
    wishBook.setAttribute('id', `wish${index}`);
    wishBook.setAttribute('class', 'wish');
    wishBook.innerHTML = `
    <p class='wish-title'>${JSON.parse(localStorage[index]).title} ${unknown('langs')}</p>
    <p class='subtitle'>${unknown('subtitle')}</p>
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

export function renderRead(index) {
    let readBook = document.createElement('div');
    readBook.setAttribute('id', `readItem${index}`);
    readBook.setAttribute('class', 'readItem');
    readBook.innerHTML = `
    <p class='read-title'>${JSON.parse(localStorage[index]).title} (${JSON.parse(localStorage[index]).langs})</p>
    <p class='read-author'>By ${JSON.parse(localStorage[index]).author}</p>
    `;
    document.getElementById('read').appendChild(readBook);
}

export function markRead(index) {
    let obj = JSON.parse(localStorage[index]);
    obj.read = true;
    localStorage.setItem(index.toString(), JSON.stringify(obj));
    renderList();
}

export function deleteBook(index) {
    localStorage.removeItem(index);
    renderList();
};

export function clearList() {
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

export function clearWishList() {
    if ((document.getElementById('wishlist') !== undefined) || (document.getElementById('read')) !== undefined) {
        let answer = window.confirm('Are you sure?');
        if (answer == true) {
            localStorage.clear();
            renderList();
        }
    }
}
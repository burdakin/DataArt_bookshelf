import {footerLogic, getList} from "./render.js";
import {clearWishList, renderList} from "./wishlist.js";

(function listener() {
    document.addEventListener('DOMContentLoaded', () => {
        (function get () {
            document.getElementById('search-btn').addEventListener('click', getList);
        })();
        (function () {
            document.getElementById('search-input').addEventListener('keyup', (e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    document.getElementById('search-btn').click();
                }
            })
        })();
        (function () {
            if (localStorage.length == 0) {
                document.getElementById('clear-btn').style.opacity = '60%';
                document.getElementById('clear-btn').style.pointerEvents = 'none';
            } else {
                document.getElementById('clear-btn').style.opacity = '100%';
                document.getElementById('clear-btn').style.pointerEvents = 'auto';
            }
            document.getElementById('clear-btn').addEventListener('click', clearWishList);
        })();
        footerLogic();
        renderList();
    });
})();


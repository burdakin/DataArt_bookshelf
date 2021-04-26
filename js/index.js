import {footerLogic, getList} from "./render.js";
import {clearWishList, renderList, clearBtnStyle} from "./wishlist.js";

(function listener() {
    document.addEventListener("DOMContentLoaded", () => {
        (function get() {
            document.getElementById("search-btn").addEventListener("click", getList);
        })();
        (function () {
            document.getElementById("search-input").addEventListener("keyup", (e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    document.getElementById("search-btn").click();
                }
            })
        })();
        (function () {
            clearBtnStyle();
            document.getElementById("clear-btn").addEventListener("click", clearWishList);
        })();
        footerLogic();
        renderList();
    });
})();


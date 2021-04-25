export function loader() {
    let loaderSection = document.createElement('div');
    loaderSection.setAttribute('id', 'load');
    loaderSection.setAttribute('class', 'load');
    loaderSection.innerHTML = 'Wait for it';
    document.getElementById('app').appendChild(loaderSection);
    let loader = document.getElementById('load');
    loader.style.display = 'block';
    loader.innerHTML = '<p class="load--text" id="load-text">Wait for it!</p>';
    document.getElementById("body").style.zIndex = "-2";
    document.getElementById("body").style.opacity = "60%";
}

export function removeLoader() {
    document.getElementById('load').remove();
    document.getElementById("body").style.zIndex = "1";
    document.getElementById("body").style.opacity = "100%";
}

export function loaderColor() {
    let n = Math.floor((Math.random() * 254) + 1);
    return n;
}
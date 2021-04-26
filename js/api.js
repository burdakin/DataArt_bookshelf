export async function getQuery(query, page) {
    try {
        let url = `https://openlibrary.org/search.json?q=${query}&page=${page}`;
        let result = await fetch(url);
        return await result.json();
    } catch (e) {
        alert("Oops! Something went wrong:( \nCheck your connection and try again");
        console.log(e);
    }
}
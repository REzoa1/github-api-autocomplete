import {
  handleError,
  getData,
  catchErr,
  fillFragment,
  debounce,
} from "./helpers.js";

const dropdown = document.querySelector(".drop");
const container = document.querySelector(".list");
const input = document.querySelector(".search-form");

const loader = document.createElement("div");
loader.classList.add("loader");

let data = [];
let currVal = "";

const dropdownListener = (e) => {
  if (e.target.className === "drop__item" && data.length) {
    dropdown.textContent = "";
    input.value = "";
    currVal = "";

    const { name, owner, stargazers_count, id } = data[e.target.id];
    const liExists = document.getElementById(id);

    if (liExists) {
      container.insertAdjacentElement("afterbegin", liExists);
      return;
    }

    const html = `<div class="list__item" id="${id}">
                      <div class="list__inner">
                        <div class="list__el">Name: ${name}</div>
                        <div class="list__el">Owner: ${owner.login}</div>
                        <div class="list__el">Stars: ${stargazers_count}</div>
                      </div>
                      <button class="list__del-btn"></button>
                    </div>`;

    container.insertAdjacentHTML("afterbegin", html);
  }
};

const contaierListener = (e) => {
  if (e.target.className === "list__del-btn") {
    e.target.closest(".list__item").remove();
  }
};

const setData = ({ items, total_count }, value) => {
  data = [];
  if (total_count === 0) {
    handleError(`There are no repositories named ${value}.`);
  }

  data.push(...items);
  const fragment = fillFragment(items);

  dropdown.append(fragment);
};

const fetchData = (url, value) => {
  fetch(url, {
    method: "GET",
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  })
    .then(getData)
    .then((data) => setData(data, value))
    .catch(catchErr)
    .finally(() => loader.remove());
};

const searchListener = (e) => {
  if (currVal === e.target.value) {
    return;
  }

  currVal = e.target.value;
  dropdown.textContent = "";
  loader.remove();

  if (!currVal.trim()) {
    return;
  }

  dropdown.insertAdjacentElement("beforebegin", loader);

  const url = `https://api.github.com/search/repositories?q=${currVal}&per_page=5`;

  fetchData(url, currVal);
};

const onChange = debounce(searchListener, 700);

dropdown.addEventListener("click", dropdownListener);
container.addEventListener("click", contaierListener);
input.addEventListener("keyup", onChange);

import {
  createDiv,
  handleError,
  getData,
  catchErr,
  fillFragment,
} from "/helpers.js";

const dropdown = document.querySelector(".drop");
const container = document.querySelector(".list");
const input = document.querySelector(".search-form");

const loader = document.createElement("div");
loader.classList.add("loader");

let timer;
let data = [];
let currVal = "";

const dropdownListener = (e) => {
  if (e.target.className === "drop__item" && data) {
    dropdown.textContent = "";
    input.value = "";
    currVal = "";

    const { name, owner, stargazers_count, id } = data[e.target.id];
    const el = document.getElementById(id);

    if (el) {
      container.insertAdjacentElement("afterbegin", el);
      return;
    }

    const liEl = document.createElement("li");
    liEl.classList.add("list__item");
    liEl.id = id;

    const inner = createDiv(null, "list__inner");
    const nameWrap = createDiv(`Name: ${name}`, "list__el");
    const ownerWrap = createDiv(`Owner: ${owner.login}`, "list__el");
    const starsWrap = createDiv(`Stars: ${stargazers_count}`, "list__el");

    const btn = document.createElement("button");
    btn.classList.add("list__btn");
    btn.textContent = "✕";

    inner.append(nameWrap);
    inner.append(ownerWrap);
    inner.append(starsWrap);
    liEl.append(inner);
    liEl.append(btn);

    container.insertAdjacentElement("afterbegin", liEl);
  }
};

const contaierListener = (e) => {
  if (e.target.className === "list__btn") {
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

  if (!currVal.trim() || value !== currVal) {
    return;
  }

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
  clearTimeout(timer);

  if (!currVal.trim()) {
    return;
  }

  dropdown.insertAdjacentElement("beforebegin", loader);

  const url = `https://api.github.com/search/repositories?q=${currVal}&per_page=5`;

  timer = setTimeout(() => fetchData(url, currVal), 900);
};

dropdown.addEventListener("click", dropdownListener);
container.addEventListener("click", contaierListener);
input.addEventListener("keyup", searchListener);

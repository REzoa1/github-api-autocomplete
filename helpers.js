const dropdown = document.querySelector(".drop");

const createDiv = (text, ...classes) => {
  const div = document.createElement("div");
  if (text) {
    div.textContent = text;
  }

  if (classes) {
    div.classList.add(...classes);
  }

  return div;
};

const handleError = (text) => {
  const errContainer = document.createElement("div");
  errContainer.classList.add("err-wrap");
  errContainer.textContent = text;
  dropdown.append(errContainer);
  return;
};

const getData = (res) => {
  if (res.ok) {
    return res.json();
  }
  const error = new Error("Something went wrong.");
  error.code = res.status;
  throw error;
};

const catchErr = (err) => handleError(`${err.message} Err code: ${err.code}`);

const fillFragment = (items) => {
  const fragment = document.createDocumentFragment();
  items.forEach((item, i) => {
    const dropItem = document.createElement("button");
    dropItem.classList.add("drop__item");
    dropItem.dataset.owner = item.owner.login;
    dropItem.textContent = item.name;
    dropItem.id = i;

    fragment.append(dropItem);
  });
  return fragment;
};

export { createDiv, handleError, getData, catchErr, fillFragment };

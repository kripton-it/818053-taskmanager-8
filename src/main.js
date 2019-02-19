'use strict';

// пункты 3 и 5

const mainFilterElement = document.querySelector(`.main__filter`);

const getRandomInteger = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

const getFilterElement = (caption, amount, isDisabled = false, isChecked = false) => {
  const checkedAttribute = isChecked ? ` checked` : ``;
  const disabledAttribute = isDisabled ? ` disabled` : ``;
  const idAttribute = `filter__${caption.toLowerCase()}`;
  const labelClassAttribute = `${idAttribute}-count`;
  return `
    <input
      type="radio"
      id="${idAttribute}"
      class="filter__input visually-hidden"
      name="filter"
      ${checkedAttribute}
      ${disabledAttribute}
    />
    <label for="${idAttribute}" class="filter__label">
    ${caption.toUpperCase()} <span class="${labelClassAttribute}">${amount}</span></label>
    <br />
  `;
};

const renderFilterElement = (caption, amount, isDisabled = false, isChecked = false) => {
  mainFilterElement.insertAdjacentHTML(`beforeend`, getFilterElement(caption, amount, isDisabled, isChecked));
};

renderFilterElement(`All`, getRandomInteger(20, 40), false, true);
renderFilterElement(`Overdue`, getRandomInteger(0, 5), true);
renderFilterElement(`Today`, getRandomInteger(0, 5), true);
renderFilterElement(`Favorites`, getRandomInteger(0, 10));
renderFilterElement(`Repeating`, getRandomInteger(0, 5));
renderFilterElement(`Tags`, getRandomInteger(5, 10));
renderFilterElement(`Archive`, getRandomInteger(100, 200));

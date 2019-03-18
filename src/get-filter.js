/**
  * Функция для получения шаблонной строки фильтра.
  * @param {Object} объект с данными
  * @return  {string} шаблонная строка
  */
export default ({caption, amount, isDisabled = false, isChecked = false}) => {
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
`;
};


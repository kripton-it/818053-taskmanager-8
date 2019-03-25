import Component from './component.js';

/**
  * Класс фильтра.
  */
export default class Filter extends Component {
  /**
   * Создает экземпляр Filter.
   *
   * @constructor
   * @param {Object} filter - объект с данными фильтра
   * @this  {Filter}
   */
  constructor(filter) {
    super();
    this._caption = filter.caption;
    this._amount = filter.amount;
    this._state.isDisabled = filter.isDisabled;
    this._state.isChecked = filter.isChecked;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * Метод-обработчик нажатия на фильтр.
   * @param {Object} evt - объект события Event
   */
  _onFilterClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  /**
   * Сеттер для передачи колбэка при выборе фильтра.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Геттер для получения шаблонной строки фильтра.
   *
   * @return  {string} шаблонная строка
   */
  get template() {
    const checkedAttribute = this._state.isChecked ? ` checked` : ``;
    const disabledAttribute = this._state.isDisabled ? ` disabled` : ``;
    const idAttribute = `filter__${this._caption.toLowerCase()}`;
    const labelClassAttribute = `${idAttribute}-count`;
    return `<div>
      <input
        type="radio"
        id="${idAttribute}"
        class="filter__input visually-hidden"
        name="filter"
        ${checkedAttribute}
        ${disabledAttribute}
      />
      <label for="${idAttribute}" class="filter__label">
      ${this._caption.toUpperCase()} <span class="${labelClassAttribute}">${this._amount}</span></label>
    </div>`;
  }

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}

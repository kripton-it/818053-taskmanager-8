import Component from './Component.js';
import moment from 'moment';
export default class Task extends Component {
  constructor(task) {
    super();
    this._title = task.title;
    this._dueDate = task.hasOwnProperty(`dueDate`) ? task.dueDate : null;
    this._tags = task.tags;
    this._picture = task.picture;
    this._repeatingDays = task.repeatingDays;
    this._color = task.hasOwnProperty(`color`) ? task.color : `black`;
    this._isFavorite = task.isFavorite;
    this._isDone = task.isDone;
    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._state.isDate = task.hasOwnProperty(`dueDate`);
    this._state.isRepeating = this._isRepeating();
    this._state.isOverdue = this._state.isDate && Date.now() > this._dueDate;
  }

  _onEditButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _isRepeating() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  get template() {
    const repeatingClass = this._state.isRepeating ? ` card--repeat` : ``;
    const overdueClass = (this._state.isDate && this._state.isOverdue) ? ` card--deadline` : ``;

    const cardControl = `<div class="card__control">
      <button type="button" class="card__btn card__btn--edit">
        edit
      </button>
      <button type="button" class="card__btn card__btn--archive">
        archive
      </button>
      <button
        type="button"
        class="card__btn card__btn--favorites card__btn--disabled"
      >
        favorites
      </button>
    </div>`;

    const cardColorBar = `<div class="card__color-bar">
      <svg class="card__color-bar-wave" width="100%" height="10">
        <use xlink:href="#wave"></use>
      </svg>
    </div>`;

    const cardTextArea = `<div class="card__textarea-wrap">
      <label>
        <textarea
          class="card__text"
          placeholder="Start typing your text here..."
          name="text"
        >${this._title}</textarea>
      </label>
    </div>`;

    const hashtags = [...this._tags].map((tag) => `
      <span class="card__hashtag-inner">
        <input
          type="hidden"
          name="hashtag"
          value="${tag}"
          class="card__hashtag-hidden-input"
        />
        <button type="button" class="card__hashtag-name">
          #${tag}
        </button>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>
      `.trim()).join(``);

    const cardDates = `<div class="card__dates">
      ${this._state.isDate ? moment(this._dueDate).format(`DD MMMM hh:mm`) : ``}
    </div>`;

    const cardDetails = `<div class="card__details">
    ${cardDates}
    <div class="card__hashtag">
        <div class="card__hashtag-list">
          ${hashtags}
        </div>
      </div>
    </div>`;

    return `<article class="card card--${this._color}${repeatingClass}${overdueClass}">
      <div class="card__inner">
        ${cardControl}

        ${cardColorBar}

        ${cardTextArea}

        <div class="card__settings">
          ${cardDetails}
        </div>
      </div>
    </article>
  `.trim();
  }

  createListeners() {
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this._onEditButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.card__btn--edit`)
        .removeEventListener(`click`, this._onEditButtonClick);
  }

  /*
  Задача метода update – перезаписать в компонент обновленные данные. Независимо от того, откуда они придут.
  */
  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
  }
}

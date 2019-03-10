import {getDate, getTime, identity, Colors} from './utils.js';
import Component from './Component.js';
export default class Task extends Component {
  constructor(task, index) {
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
    this._index = index;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
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

  get template() {
    const isRepeating = Object.values(this._repeatingDays).some(identity);
    const isOverdue = this._dueDate && Date.now() > this._dueDate;
    const dueDate = this._dueDate ? new Date(this._dueDate) : null;
    const repeatingClass = isRepeating ? ` card--repeat` : ``;
    const overdueClass = (this._dueDate && isOverdue) ? ` card--deadline` : ``;
    const repeatingDays = Object.keys(this._repeatingDays);

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

    const cardDateDeadline = dueDate ? `<fieldset class="card__date-deadline" disabled>
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          value="${getDate(dueDate)}"
          name="date"
        />
      </label>
      <label class="card__input-deadline-wrap">
        <input
          class="card__time"
          type="text"
          value="${getTime(dueDate)}"
          name="time"
        />
      </label>
    </fieldset>` : ``;

    const cardRepeatInputs = repeatingDays.map((day) => `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day.toLowerCase()}-${this._index}"
      name="repeat"
      value="${day.toLowerCase()}"
      ${this._repeatingDays[day] ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${day.toLowerCase()}-${this._index}"
      >${day.toLowerCase()}</label
    >`).join(``);

    const cardRepeatDays = `<fieldset class="card__repeat-days" disabled>
      <div class="card__repeat-days-inner">
        ${cardRepeatInputs}
      </div>
    </fieldset>`;

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
      `).join(``);

    const colorInputs = Colors.map((color) => `<input
      type="radio"
      id="color-${color}-${this._index}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${this._color === color ? `checked` : ``}
    />
    <label
      for="color-${color}-${this._index}"
      class="card__color card__color--${color}"
      >${color}</label
    >`).join(``);

    const cardDates = `<div class="card__dates">
      <button class="card__date-deadline-toggle" type="button">
        date: <span class="card__date-status">${dueDate ? `yes` : `no`}</span>
      </button>

      ${cardDateDeadline}

      <button class="card__repeat-toggle" type="button">
        repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
      </button>

      ${cardRepeatDays}
    </div>`;

    const cardDetails = `<div class="card__details">
      ${cardDates}

      <div class="card__hashtag">
        <div class="card__hashtag-list">
          ${hashtags}
        </div>
      </div>
    </div>`;

    const cardImgWrap = `<label class="card__img-wrap card__img-wrap--empty">
      <input
        type="file"
        class="card__img-input visually-hidden"
        name="img"
      />
      <img
        src="${this._picture}"
        alt="task picture"
        class="card__img"
      />
    </label>`;


    return `<article class="card card--${this._color}${repeatingClass}${overdueClass}">
  <form class="card__form" method="get">
    <div class="card__inner">
      ${cardControl}

      ${cardColorBar}

      ${cardTextArea}

      <div class="card__settings">
        ${cardDetails}

        ${cardImgWrap}

        <div class="card__colors-inner">
          <h3 class="card__colors-title">Color</h3>
          <div class="card__colors-wrap">
            ${colorInputs}
          </div>
        </div>
      </div>

      <div class="card__status-btns">
        <button class="card__save" type="submit">save</button>
        <button class="card__delete" type="button">delete</button>
      </div>
    </div>
  </form>
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
}

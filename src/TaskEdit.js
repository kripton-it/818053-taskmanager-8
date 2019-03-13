import {getDate, getTime, Colors} from './utils.js';
import Component from './Component.js';
import flatpickr from "flatpickr";
export default class TaskEdit extends Component {
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
    this._onSubmit = null;
    this._onChangeDate = null;
    this._onChangeRepeating = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onToggleDate = this._onToggleDate.bind(this);
    this._onToggleRepeating = this._onToggleRepeating.bind(this);
    this._state.isDate = task.hasOwnProperty(`dueDate`);
    this._state.isRepeating = this._isRepeating();
    this._state.isOverdue = this._state.isDate && Date.now() > this._dueDate;
  }

  _onToggleDate() {
    // переключаем флаг
    this._state.isDate = !this._state.isDate;
    // убираем обработчики
    this.removeListeners();

    // забираем данные из формы (массив массивов [поле, значение]),
    const formData = new FormData(this._element.querySelector(`.card__form`));

    // но имена полей формы из разметки не всегда совпадают с соответствующими полями компонента,
    // поэтому нужен вспомогательный метод _processForm
    // для конвертации информации из формы в формат, понятный компоненту
    const newData = this._processForm(formData);
    if (typeof this._onChangeDate === `function`) {
      this._onChangeDate(newData);
    }

    // передаём информацию из формы в понятном для компонента формате в метод update
    this.update(newData);

    // обновляем из шаблона
    this._partialUpdate();
    // навешиваем обработчики
    this.createListeners();
  }

  _onToggleRepeating() {
    // переключаем флаг
    this._state.isRepeating = !this._state.isRepeating;
    // убираем обработчики
    this.removeListeners();

    // забираем данные из формы (массив массивов [поле, значение]),
    const formData = new FormData(this._element.querySelector(`.card__form`));

    // но имена полей формы из разметки не всегда совпадают с соответствующими полями компонента,
    // поэтому нужен вспомогательный метод _processForm
    // для конвертации информации из формы в формат, понятный компоненту
    const newData = this._processForm(formData);
    if (typeof this._onChangeRepeating === `function`) {
      this._onChangeRepeating(newData);
    }

    // передаём информацию из формы в понятном для компонента формате в метод update
    this.update(newData);

    // обновляем из шаблона
    this._partialUpdate();
    // навешиваем обработчики
    this.createListeners();
  }

  _isRepeating() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    // забираем данные из формы (массив массивов [поле, значение]),
    const formData = new FormData(this._element.querySelector(`.card__form`));

    // но имена полей формы из разметки не всегда совпадают с соответствующими полями компонента,
    // поэтому нужен вспомогательный метод _processForm
    // для конвертации информации из формы в формат, понятный компоненту
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    // передаём информацию из формы в понятном для компонента формате в метод update
    this.update(newData);
  }

  _processForm(formData) {
    // новый пустой объект, в который будет записана информация из формы
    // (пока что создаётся вручную)
    // formData - массив массивов [поле, значение]
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      // dueDate: Date.now(),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    // вызываем статический метод для генерации маппера
    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      // для каждого массива [поле, значение] деструктурируем его в отдельные переменные,
      // и вызываем (если существует) соответствующую функцию из маппера
      const [property, value] = pair;
      if (taskEditMapper.hasOwnProperty(property)) {
        taskEditMapper[property](value);
      }
    }

    // возвращаем модифицированный объект
    return entry;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onChangeDate(fn) {
    this._onChangeDate = fn;
  }

  set onChangeRepeating(fn) {
    this._onChangeRepeating = fn;
  }

  get template() {
    // const isOverdue = this._dueDate && Date.now() > this._dueDate;
    const dueDate = this._state.isDate ? new Date(this._dueDate) : null;
    const repeatingClass = this._isRepeating() ? ` card--repeat` : ``;
    const overdueClass = (this._state.isDate && this._state.isOverdue) ? ` card--deadline` : ``;
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
        >${this._title}</textarea
        >
      </label>
    </div>`;

    const cardDateDeadline = `
      <fieldset class="card__date-deadline" ${!this._state.isDate && `disabled`}>
        <label class="card__input-deadline-wrap">
          <input class="card__date" type="text" placeholder="23 September" value="${this._state.isDate ? getDate(dueDate) : ``}" name="date" />
        </label>

        <label class="card__input-deadline-wrap">
          <input class="card__time" type="text" placeholder="11:15 PM" value="${this._state.isDate ? getTime(dueDate) : ``}" name="time" />
        </label>
      </fieldset>
    `.trim();

    const cardRepeatInputs = repeatingDays.map((day) => `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day.toLowerCase()}"
      name="repeat"
      value="${day.toLowerCase()}"
      ${this._repeatingDays[day] && `checked`}
    />
    <label class="card__repeat-day" for="repeat-${day.toLowerCase()}"
      >${day.toLowerCase()}</label
    >`).join(``);

    const cardRepeatDays = `<fieldset class="card__repeat-days" ${!this._state.isRepeating && `disabled`}>
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
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${this._color === color && `checked`}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >${color}</label
    >`).join(``);

    const cardDates = `<div class="card__dates">
      <button class="card__date-deadline-toggle" type="button">
        date: <span class="card__date-status">${this._state.isDate ? `yes` : `no`}</span>
      </button>

      ${cardDateDeadline}

      <button class="card__repeat-toggle" type="button">
        repeat:<span class="card__repeat-status">${this._state.isRepeating ? `yes` : `no`}</span>
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


    return `<article class="card card--edit card--${this._color}${repeatingClass}${overdueClass}">
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
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onToggleDate);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onToggleRepeating);

    if (this._state.isDate) {
      flatpickr(`.card__date`, {altInput: true, altFormat: `j F`, dateFormat: `j F`});
      flatpickr(`.card__time`, {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `h:i K`});
    }
  }

  removeListeners() {
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onToggleDate);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onToggleRepeating);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  // статический метод для преобразования данных;
  // его задача - сопоставить поля формы с полями структуры и записать в них полученные значения;
  // возвращает новый объект, поля которого - это функции для преобразования значений из соответствующих полей формы
  // именно здесь можно регулировать, какие поля в структуре обновлять (и как)
  static createMapper(target) {
    return {
      hashtag: (value) => target.tags.add(value),
      text: (value) => (target.title = value),
      color: (value) => (target.color = value),
      repeat: (value) => (target.repeatingDays[value] = true),
      date: (value) => (target.dueDate = Date.parse(`${value}, 2019`)),
    };
  }
}

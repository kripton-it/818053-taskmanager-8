import {TASK_COLORS} from './utils.js';
import Component from './component.js';
import moment from 'moment';
import flatpickr from 'flatpickr';

/**
  * Класс задачи в режиме редактирования.
  */
export default class TaskEdit extends Component {
  /**
   * Создает экземпляр TaskEdit.
   *
   * @constructor
   * @param {Object} task - объект с данными задачи
   * @this  {TaskEdit}
   */
  constructor(task) {
    super();
    this._id = task.id;
    this._title = task.title;
    this._dueDate = task.hasOwnProperty(`dueDate`) ? task.dueDate : null;
    this._tags = task.tags;
    this._picture = task.picture;
    this._repeatingDays = task.repeatingDays;
    this._color = task.hasOwnProperty(`color`) ? task.color : `black`;
    this._isFavorite = task.isFavorite;
    this._isDone = task.isDone;
    this._onSubmit = null;
    this._onChangeRepeating = null;
    this._onDelete = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onToggleDate = this._onToggleDate.bind(this);
    this._onToggleRepeating = this._onToggleRepeating.bind(this);
    this._state.isDate = task.hasOwnProperty(`dueDate`);
    this._state.isRepeating = this._isRepeating();
    this._state.isOverdue = this._state.isDate && Date.now() > this._dueDate;
  }

  /**
   * Метод-обработчик для добавления/удаления даты дедлайна для задачи.
   * @param {Object} evt - объект события Event
   */
  _onToggleDate(evt) {
    evt.preventDefault();
    // переключаем флаг
    this._state.isDate = !this._state.isDate;
    // убираем обработчики
    this._removeListeners();

    // обновляем из шаблона
    this._partialUpdate();
    // навешиваем обработчики
    this._createListeners();
  }

  /**
   * Метод-обработчик для добавления/удаления повторяющихся дней для задачи.
   */
  _onToggleRepeating() {
    // переключаем флаг
    this._state.isRepeating = !this._state.isRepeating;
    // убираем обработчики
    this._removeListeners();

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
    this._createListeners();
  }

  /**
   * Метод для определения, заданы ли дни повтора для задачи.
   * @return {boolean}
   */
  _isRepeating() {
    return Object.values(this._repeatingDays).some((day) => day);
  }

  /**
   * Метод-обработчик нажатия на кнопку Save.
   * @param {Object} evt - объект события Event
   */
  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    /**
     * забираем данные из формы (массив массивов [поле, значение]),
     */
    const formData = new FormData(this._element.querySelector(`.card__form`));

    /**
     * но имена полей формы из разметки не всегда совпадают
     * с соответствующими полями компонента,
     * поэтому нужен вспомогательный метод _processForm
     * для конвертации информации из формы в формат, понятный компоненту
     */
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    /**
     * передаём информацию из формы в понятном для компонента формате в метод update
     */
    this.update(newData);
  }

  /**
   * Метод-обработчик нажатия на кнопку Delete.
   * @param {Object} evt - объект события Event
   */
  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  /**
   * Вспомогательный метод для конвертации информации из формы в формат, понятный компоненту.
   * @param {Array} formData - данные из формы (массив массивов [поле, значение])
   * @return {Object} - объект, в который записана информация из формы
   */
  _processForm(formData) {
    /**
     * заготовка объекта, в который будет записана информация из формы
     * (пока что создаётся вручную)
     */
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
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

    /**
     * вызываем статический метод для генерации маппера
     */
    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      /**
       * для каждого массива [поле, значение] деструктурируем его в отдельные переменные,
       * и вызываем (если существует) соответствующую функцию из маппера
       */
      const [property, value] = pair;
      if (taskEditMapper.hasOwnProperty(property)) {
        taskEditMapper[property](value);
      }
    }

    /**
     * возвращаем модифицированный объект
     */
    return entry;
  }

  /**
   * Сеттер для передачи колбэка по нажатию на кнопку Save.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Сеттер для передачи колбэка по нажатию на кнопку включения/выключения режима повтора.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onChangeRepeating(fn) {
    this._onChangeRepeating = fn;
  }

  /**
   * Сеттер для передачи колбэка по нажатию на кнопку Delete.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onDelete(fn) {
    this._onDelete = fn;
  }

  get isDate() {
    return this._state.isDate;
  }

  set isDate(isDate) {
    this._state.isDate = isDate;
  }

  /**
   * Геттер для получения шаблонной строки задачи.
   *
   * @return  {string} шаблонная строка
   */
  get template() {
    const repeatingClass = this._state.isRepeating ? ` card--repeat` : ``;
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
      <fieldset class="card__date-deadline" ${this._state.isDate ? `` : `disabled`}>
        <label class="card__input-deadline-wrap">
          <input class="card__date" type="text" placeholder="23 September" value="${this._state.isDate && this._dueDate ? moment(this._dueDate).format(`DD MMMM`) : moment().format(`DD MMMM`)}" name="date" />
        </label>

        <label class="card__input-deadline-wrap">
          <input class="card__time" type="text" placeholder="15:00" value="${this._state.isDate && this._dueDate ? moment(this._dueDate).format(`HH:mm`) : moment().format(`HH:mm`)}" name="time" />
        </label>
      </fieldset>
    `.trim();

    const cardRepeatInputs = repeatingDays.map((day) => `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day.toLowerCase()}-${this._id}"
      name="repeat"
      value="${day.toLowerCase()}"
      ${this._repeatingDays[day] && `checked`}
    />
    <label class="card__repeat-day" for="repeat-${day.toLowerCase()}-${this._id}"
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

    const colorInputs = TASK_COLORS.map((color) => `<input
      type="radio"
      id="color-${color}-${this._id}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${this._color === color && `checked`}
    />
    <label
      for="color-${color}-${this._id}"
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

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onToggleDate);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onToggleRepeating);
    this._element.querySelector(`.card__delete`).addEventListener(`click`, this._onDeleteButtonClick);

    if (this._state.isDate) {
      flatpickr(`.card__date`, {altInput: true, altFormat: `j F`, dateFormat: `j F`});
      flatpickr(`.card__time`, {enableTime: true, noCalendar: true, altInput: true, altFormat: `H:i`, dateFormat: `H:i`});
    }
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onToggleDate);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onToggleRepeating);
    this._element.querySelector(`.card__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
  }

  /**
    * Метод для частичного обновления.
    */
  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  /**
    * Метод для обновления данных.
    * @param {Object} data - объект с данными для обновления.
    */
  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  /**
    * Статический метод для преобразования данных.
    * Его задача - сопоставить поля формы с полями структуры и записать в них полученные значения.
    * @param {Object} target - объект, в который будет записан результат преобразования.
    * @return {Object} - новый объект, поля которого - это функции для преобразования значений из соответствующих полей формы и записи результата в target.
    */
  static createMapper(target) {
    return {
      hashtag: (value) => target.tags.add(value),
      text: (value) => (target.title = value),
      color: (value) => (target.color = value),
      repeat: (value) => (target.repeatingDays[value] = true),
      date: (value) => (target.dueDate = Date.parse(`${value}, 2019`)),
      time: (value) => {
        const [hours, minutes] = value.split(`:`);
        target.dueDate += 1000 * 60 * (+hours * 60 + +minutes);
      },
    };
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }
}

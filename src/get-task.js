import {getDate, Colors} from './utils.js';

export default (task, index) => {
  const isRepeating = Object.values(task.repeatingDays).some((item) => item);
  const isOverdue = Date.now() > task.dueDate;
  const dueDate = new Date(task.dueDate);
  const repeatingClass = isRepeating ? ` card--repeat` : ``;
  const overdueClass = isOverdue ? ` card--deadline` : ``;
  const repeatingDays = Object.keys(task.repeatingDays);

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
    >
      ${task.title}</textarea
    >
  </label>
</div>`;

  const cardDateDeadline = `<fieldset class="card__date-deadline" disabled>
  <label class="card__input-deadline-wrap">
    <input
      class="card__date"
      type="text"
      placeholder="${getDate(dueDate)}"
      name="date"
    />
  </label>
  <label class="card__input-deadline-wrap">
    <input
      class="card__time"
      type="text"
      placeholder="11:15 PM"
      name="time"
    />
  </label>
</fieldset>`;

  const cardRepeatInputs = repeatingDays.map((day) => `<input
  class="visually-hidden card__repeat-day-input"
  type="checkbox"
  id="repeat-${day.toLowerCase()}-${index}"
  name="repeat"
  value="${day.toLowerCase()}"
  ${task.repeatingDays[day] ? `checked` : ``}
/>
<label class="card__repeat-day" for="repeat-${day.toLowerCase()}-${index}"
  >${day.toLowerCase()}</label
>`).join(``);

  const cardRepeatDays = `<fieldset class="card__repeat-days" disabled>
  <div class="card__repeat-days-inner">
    ${cardRepeatInputs}
  </div>
</fieldset>`;

  const hashtags = [...task.tags].map((tag) => `
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
  id="color-${color}-${index}"
  class="card__color-input card__color-input--${color} visually-hidden"
  name="color"
  value="${color}"
  ${task.color === color ? `checked` : ``}
/>
<label
  for="color-${color}-${index}"
  class="card__color card__color--${color}"
  >${color}</label
>`).join(``);

  const cardDates = `<div class="card__dates">
  <button class="card__date-deadline-toggle" type="button">
    date: <span class="card__date-status">${task.dueDate ? `yes` : `no`}</span>
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
    src="${task.picture}"
    alt="task picture"
    class="card__img"
  />
</label>`;

  return `<article class="card card--${task.color}${repeatingClass}${overdueClass}">
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
  `;
};



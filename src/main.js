import {getRandomInteger} from './utils.js';
import getFilter from './get-filter.js';
import getTask from './get-task.js';
import {generateTask} from './data.js';

const filters = [
  {
    caption: `All`,
    amount: getRandomInteger(20, 40),
    isChecked: true,
  },
  {
    caption: `Overdue`,
    amount: getRandomInteger(0, 5),
    isDisabled: true,
  },
  {
    caption: `Today`,
    amount: getRandomInteger(0, 5),
    isDisabled: true,
  },
  {
    caption: `Favorites`,
    amount: getRandomInteger(0, 10),
  },
  {
    caption: `Repeating`,
    amount: getRandomInteger(0, 5),
  },
  {
    caption: `Tags`,
    amount: getRandomInteger(5, 10),
  },
  {
    caption: `Archive`,
    amount: getRandomInteger(100, 200),
  },
];
const tasksNumber = 7;
const boardTasksElement = document.querySelector(`.board__tasks`);
const mainFilterElement = document.querySelector(`.main__filter`);

// отрисовка фильтров
mainFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

// отрисовка карточек
const fillBoard = (number) => {
  boardTasksElement.insertAdjacentHTML(`beforeend`, (new Array(number)).fill(``).map((item, index) => getTask(generateTask(), index + 1)).join(``));
};
fillBoard(tasksNumber);

// обработка кликов по фильтрам
const mainFilterClickHandler = (evt) => {
  evt.preventDefault();
  boardTasksElement.innerHTML = ``;
  fillBoard(getRandomInteger(1, 8));
};
mainFilterElement.addEventListener(`click`, mainFilterClickHandler);


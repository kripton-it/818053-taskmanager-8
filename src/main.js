import {getRandomInteger} from './utils.js';
import getFilter from './get-filter.js';
import generateTasks from './generate-tasks.js';
import Task from './Task.js';
import TaskEdit from './TaskEdit.js';

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
const TASKS_NUMBER = 7;
const boardTasksElement = document.querySelector(`.board__tasks`);
const mainFilterElement = document.querySelector(`.main__filter`);

// отрисовка фильтров
mainFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

// отрисовка массива карточек
const renderTasks = (tasks, container) => {
  const fragment = document.createDocumentFragment();
  tasks.forEach((item) => {
    const index = fragment.children.length + 1;
    const task = new Task(item, index);
    const editTask = new TaskEdit(item, index);
    task.onEdit = () => {
      editTask.render();
      container.replaceChild(editTask.element, task.element);
      task.unrender();
    };
    editTask.onSubmit = () => {
      task.render();
      container.replaceChild(task.element, editTask.element);
      editTask.unrender();
    };
    task.render();
    fragment.appendChild(task.element);
  });
  container.appendChild(fragment);
};

renderTasks(generateTasks(TASKS_NUMBER), boardTasksElement);

// обработка кликов по фильтрам
const mainFilterClickHandler = (evt) => {
  evt.preventDefault();
  boardTasksElement.innerHTML = ``;
  renderTasks(generateTasks(getRandomInteger(1, 8)), boardTasksElement);
};

mainFilterElement.addEventListener(`click`, mainFilterClickHandler);


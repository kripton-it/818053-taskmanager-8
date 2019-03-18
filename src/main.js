import {getRandomInteger} from './utils.js';
import getFilter from './get-filter.js';
import generateTasks from './generate-tasks.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';

const TASKS_NUMBER = 7;
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
const boardTasksElement = document.querySelector(`.board__tasks`);
const mainFilterElement = document.querySelector(`.main__filter`);

/**
 * отрисовка фильтров
 */
mainFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

/**
 * функция для отрисовка массива карточек с задачами
 * @param {Array} tasks - массив с данными
 * @param {Object} container - DOM-элемент, в который нужно отрисовать карточки с задачами
 */
const renderTasks = (tasks, container) => {
  const fragment = document.createDocumentFragment();
  tasks.forEach((item) => {
    const task = new Task(item);
    /**
     * колбэк для перехода в режим редактирования
     */
    task.onEdit = () => {
      const editTask = new TaskEdit(item);
      /**
       * колбэк для выхода из режима редактирования
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      const onSubmit = (newObject) => {
        item.title = newObject.title;
        item.tags = newObject.tags;
        item.color = newObject.color;
        item.repeatingDays = newObject.repeatingDays;
        if (newObject.hasOwnProperty(`dueDate`)) {
          item.dueDate = newObject.dueDate;
        }

        task.update(item);
        task.render();
        container.replaceChild(task.element, editTask.element);
        editTask.unrender();
      };
      /**
       * колбэк для добавления/удаления даты дедлайна и для включения/выключения дней повтора
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      const onChange = (newObject) => {
        item.title = newObject.title;
        item.tags = newObject.tags;
        item.color = newObject.color;
        item.repeatingDays = newObject.repeatingDays;
        item.dueDate = newObject.dueDate;

        const oldElem = editTask.element;
        editTask.update(item);
        const newElem = editTask.render();
        container.replaceChild(newElem, oldElem);
      };
      editTask.render();
      container.replaceChild(editTask.element, task.element);
      task.unrender();
      /**
       * передача колбэков
       */
      editTask.onSubmit = onSubmit;
      editTask.onChangeDate = onChange;
      editTask.onChangeRepeating = onChange;
    };
    task.render();
    fragment.appendChild(task.element);
  });
  container.appendChild(fragment);
};

renderTasks(generateTasks(TASKS_NUMBER), boardTasksElement);

/**
 * обработчик кликов по фильтрам
 * @param {Object} evt - объект события Event
 */
const mainFilterClickHandler = (evt) => {
  evt.preventDefault();
  boardTasksElement.innerHTML = ``;
  renderTasks(generateTasks(getRandomInteger(1, 8)), boardTasksElement);
};

mainFilterElement.addEventListener(`click`, mainFilterClickHandler);


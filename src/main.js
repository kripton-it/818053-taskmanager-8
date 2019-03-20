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
const initialTasks = generateTasks(TASKS_NUMBER);

/**
 * отрисовка фильтров
 */
mainFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

/**
 * функция для замены одного объекта с данными в массиве объектов на другой
 * @param {Array} tasks - массив с данными
 * @param {Object} taskToUpdate - объект, который надо заменить
 * @param {Object} newTask - новый объект
 * @return {Object} новый объект
 */
const updateTask = (tasks, taskToUpdate, newTask) => {
  const index = tasks.findIndex((it) => it === taskToUpdate);
  tasks[index] = Object.assign({}, taskToUpdate, newTask);
  return tasks[index];
};

/**
 * функция для удаления одного объекта с данными в массиве объектов
 * @param {Array} tasks - массив с данными
 * @param {Object} tasktoDelete - объект, который надо удалить
 * @return {Array} массив с удалённым объектом
 */
const deleteTask = (tasks, tasktoDelete) => {
  const index = tasks.findIndex((it) => it === tasktoDelete);
  tasks.splice(index, 1);
  return tasks;
};

/**
 * функция для отрисовки массива карточек с задачами
 * @param {Array} tasks - массив с данными
 * @param {Object} container - DOM-элемент, в который нужно отрисовать карточки с задачами
 */
const renderTasks = (tasks, container) => {
  const fragment = document.createDocumentFragment();
  tasks.forEach((task, index) => {
    const taskComponent = new Task(task);
    /**
     * колбэк для перехода в режим редактирования
     */
    taskComponent.onEdit = () => {
      const editTaskComponent = new TaskEdit(task, index);
      /**
       * колбэк для выхода из режима редактирования
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      const onSubmit = (newObject) => {
        const updatedTask = updateTask(tasks, task, newObject);

        taskComponent.update(updatedTask);
        taskComponent.render();
        container.replaceChild(taskComponent.element, editTaskComponent.element);
        editTaskComponent.unrender();
      };
      /**
       * колбэк для добавления/удаления даты дедлайна и для включения/выключения дней повтора
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      const onChange = (newObject) => {
        const updatedTask = updateTask(tasks, task, newObject);

        const oldElem = editTaskComponent.element;
        editTaskComponent.update(updatedTask);
        const newElem = editTaskComponent.render();
        container.replaceChild(newElem, oldElem);
      };
      /**
       * колбэк для нажатия на кнопку Delete
       */
      const onDelete = () => {
        deleteTask(tasks, task);
        container.removeChild(editTaskComponent.element);
        editTaskComponent.unrender();
      };
      editTaskComponent.render();
      container.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
      /**
       * передача колбэков
       */
      editTaskComponent.onSubmit = onSubmit;
      editTaskComponent.onChangeDate = onChange;
      editTaskComponent.onChangeRepeating = onChange;
      editTaskComponent.onDelete = onDelete;
    };
    taskComponent.render();
    fragment.appendChild(taskComponent.element);
  });
  container.appendChild(fragment);
};

renderTasks(initialTasks, boardTasksElement);

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


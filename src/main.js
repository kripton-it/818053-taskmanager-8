import {STAT_COLORS, getRandomInteger, getMixedArray} from './utils.js';
// import getFilter from './get-filter.js';
import generateTasks from './generate-tasks.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import './stat.js';
import {renderChart, getDataForChart} from './stat.js';

const TASKS_NUMBER = 7;
const FILTERS = [
  {
    caption: `All`,
    amount: getRandomInteger(20, 40),
    isChecked: true,
  },
  {
    caption: `Overdue`,
    amount: getRandomInteger(0, 5),
  },
  {
    caption: `Today`,
    amount: getRandomInteger(0, 5),
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
    isDisabled: true,
  },
  {
    caption: `Archive`,
    amount: getRandomInteger(100, 200),
    isDisabled: true,
  },
];
const boardTasksElement = document.querySelector(`.board__tasks`);
const mainFilterElement = document.querySelector(`.main__filter`);
const initialTasks = generateTasks(TASKS_NUMBER);
const tags = getDataForChart(initialTasks, `tags`);
const colors = getDataForChart(initialTasks, `color`);
const tagsConfig = {
  target: document.querySelector(`.statistic__tags`),
  type: `tags`,
  labels: tags.map((tag) => `#${tag.value}`),
  dataSet: tags.map((tag) => tag.count),
  colors: getMixedArray(STAT_COLORS).slice(0, tags.length)
};
const colorsConfig = {
  target: document.querySelector(`.statistic__colors`),
  type: `colors`,
  labels: colors.map((color) => color.value),
  dataSet: colors.map((color) => color.count),
  colors: colors.map((color) => color.value)
};

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
  container.innerHTML = ``;
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

/**
 * функция для проверки, относится ли заданный момент времени к сегодня
 * @param {number} timestamp - время в мс
 * @return {Boolean}
 */
const isToday = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

/**
 * функция для фильтрации массива объектов
 * @param {Array} tasks - массив с данными
 * @param {string} filterName - имя фильтра
 * @return {Array} отфильтрованный массив
 */
const filterTasks = (tasks, filterName) => {
  let result;
  switch (filterName) {
    case `filter__all`:
      result = tasks;
      break;

    case `filter__overdue`:
      result = tasks.filter((it) => it.dueDate && it.dueDate < Date.now());
      break;

    case `filter__today`:
      result = tasks.filter((it) => it.dueDate && isToday(it.dueDate));
      break;

    case `filter__repeating`:
      result = tasks.filter((it) => [...Object.entries(it.repeatingDays)]
          .some((rec) => rec[1]));
      break;
  }
  return result;
};

/**
 * функция для отрисовки фильтров
 * @param {Array} filters - массив объектов с данными о фильтрах
 * @param {Object} container - DOM-элемент, в который нужно отрисовать фильтры
 */
const renderFilters = (filters, container) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  filters.forEach((filter) => {
    const filterComponent = new Filter(filter);
    /**
     * колбэк для клика по фильтру
     * @param {Object} evt - объект события Event
     */
    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id || evt.target.htmlFor;
      const filteredTasks = filterTasks(initialTasks, filterName);
      renderTasks(filteredTasks, boardTasksElement);
    };
    filterComponent.render();
    fragment.appendChild(filterComponent.element);
  });
  container.appendChild(fragment);
};

renderTasks(initialTasks, boardTasksElement);
renderFilters(FILTERS, mainFilterElement);
renderChart(tagsConfig);
renderChart(colorsConfig);



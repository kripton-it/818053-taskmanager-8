import {getRandomInteger} from './utils.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import FiltersContainer from './filters-container.js';
import './header.js';
import {setTasks} from './stat.js';
import API from './api.js';

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
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const noTasksElement = document.querySelector(`.board__no-tasks`);

/**
 * функция для отрисовки массива карточек с задачами
 * @param {Array} tasks - массив с данными
 * @param {Object} container - DOM-элемент, в который нужно отрисовать карточки с задачами
 */
const renderTasks = (tasks, container) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  tasks.forEach((task) => {
    const taskComponent = new Task(task);
    /**
     * колбэк для перехода в режим редактирования
     */
    taskComponent.onEdit = () => {
      const editTaskComponent = new TaskEdit(task);

      /**
     * функция для ререндеринга пришедшего с сервера таска
     * @param {Object} newTask - пришедший с сервера таск
     */
      const rerender = (newTask) => {
        taskComponent.update(newTask);
        taskComponent.isDate = editTaskComponent.isDate;
        taskComponent.render();
        container.replaceChild(taskComponent.element, editTaskComponent.element);
        editTaskComponent.unrender();
        task = newTask;
      };

      /**
       * колбэк для выхода из режима редактирования
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      const onSubmit = (newObject) => {
        editTaskComponent.element.querySelector(`.card__inner`).style.borderColor = `#000000`;

        for (const key in newObject) {
          if (newObject[key]) {
            task[key] = newObject[key];
          }
        }

        block();
        saveButton.textContent = `Saving...`;

        api.updateTask({id: task.id, data: task.toRAW()})
        .then((newTask) => {
          unblock();
          rerender(newTask);
        })
        .catch(() => {
          unblock();
          editTaskComponent.shake();
          saveButton.textContent = `Save`;
          editTaskComponent.element.querySelector(`.card__inner`).style.borderColor = `red`;
        });
      };

      /**
       * колбэк для нажатия на кнопку Delete
       */
      const onDelete = ({id}) => {
        editTaskComponent.element.querySelector(`.card__inner`).style.borderColor = `#000000`;
        block();
        deleteButton.textContent = `Deleting...`;
        api.deleteTask({id})
          .then(() => api.getTasks())
          .then((data) => renderTasks(data, container))
          .catch(() => {
            unblock();
            editTaskComponent.shake();
            deleteButton.textContent = `Delete`;
            editTaskComponent.element.querySelector(`.card__inner`).style.borderColor = `red`;
          });
      };
      editTaskComponent.render();
      const saveButton = editTaskComponent.element.querySelector(`.card__save`);
      const deleteButton = editTaskComponent.element.querySelector(`.card__delete`);

      /**
       * блокировка формы
       */
      const block = () => {
        saveButton.disabled = true;
        deleteButton.disabled = true;
      };

      /**
       * разблокировка формы
       */
      const unblock = () => {
        saveButton.disabled = false;
        deleteButton.disabled = false;
      };

      container.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
      /**
       * передача колбэков
       */
      editTaskComponent.onSubmit = onSubmit;
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
 * @param {Array} tasks - фильтруемый массив объектов с данными о тасках
 * @param {Array} filters - массив объектов с данными о фильтрах
 * @param {Object} container - DOM-элемент, в который нужно отрисовать фильтры
 */
const renderFilters = (tasks, filters, container) => {
  container.innerHTML = ``;
  const filtersContainerComponent = new FiltersContainer(filters);
  /**
    * колбэк для клика по фильтру
    * @param {Object} evt - объект события Event
    */
  filtersContainerComponent.onFilter = (evt) => {
    const filterName = evt.target.id || evt.target.htmlFor;
    const filteredTasks = filterTasks(tasks, filterName);
    renderTasks(filteredTasks, boardTasksElement);
  };
  filtersContainerComponent.render(container);
};

noTasksElement.textContent = `Loading tasks...`;
noTasksElement.classList.remove(`visually-hidden`);
boardTasksElement.classList.add(`visually-hidden`);

/**
 * функция для отрисовки полученных с сервера тасков
 * @param {Array} tasks - массив объектов ModelTask с данными
 */
const render = (tasks) => {
  noTasksElement.classList.add(`visually-hidden`);
  boardTasksElement.classList.remove(`visually-hidden`);
  renderFilters(tasks, FILTERS, mainFilterElement);
  renderTasks(tasks, boardTasksElement);
  setTasks(tasks.filter((task) => task.isDone));
};

api.getTasks()
  .then(render)
  .catch(() => {
    noTasksElement.textContent = `Something went wrong while loading your tasks. Check your connection or try again later`;
  });

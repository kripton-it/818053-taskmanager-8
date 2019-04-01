import {renderStatistic} from './stat.js';
const header = document.querySelector(`.control__btn-wrap`);
const headerInputs = header.querySelectorAll(`input`);
const tasksContainer = document.querySelector(`.board`);
const statisticContainer = document.querySelector(`.statistic`);
const searchResultsContainer = document.querySelector(`.search`);

const showTasks = () => {
  statisticContainer.classList.add(`visually-hidden`);
  searchResultsContainer.classList.add(`visually-hidden`);
  tasksContainer.classList.remove(`visually-hidden`);
};

const showNewTask = () => {

};

const showStatistic = () => {
  searchResultsContainer.classList.add(`visually-hidden`);
  tasksContainer.classList.add(`visually-hidden`);
  statisticContainer.classList.remove(`visually-hidden`);
  const statPeriodInput = document.querySelector(`.statistic__period-input`);
  renderStatistic();
  const onStatPeriodInputChange = (evt) => {
    if (evt.target.value.includes(` to `)) {
      renderStatistic();
    }
  };
  statPeriodInput.addEventListener(`change`, onStatPeriodInputChange);
};

const showSearch = () => {
  tasksContainer.classList.add(`visually-hidden`);
  statisticContainer.classList.add(`visually-hidden`);
  searchResultsContainer.classList.remove(`visually-hidden`);
};

const map = {
  'control__task': showTasks,
  'control__new-task': showNewTask,
  'control__statistic': showStatistic,
  'control__search': showSearch,
};

const onHeaderChange = (evt) => {
  map[evt.target.id]();
};

headerInputs.forEach((input) => input.addEventListener(`change`, onHeaderChange));

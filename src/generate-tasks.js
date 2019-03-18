import {Colors, getRandomInteger, getRandomElement, getRandomDate, getMixedArray} from './utils.js';

const MAX_TAGS_NUMBER = 3;
const Lots = [true, false, false, false, false];
const Titles = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const Tags = [`homework`, `theory`, `practice`, `intensive`, `keks`, `family`, `health`];

/**
  * Функция для генерации случайного набора тэгов.
  * @param {Array} array - исходный список тэгов.
  * @return {Set} - множество тэгов.
  */
const getTags = (array) => new Set(getMixedArray(array).slice(0, getRandomInteger(MAX_TAGS_NUMBER)));

/**
  * Функция для бросания жребия.
  * Возвращает true/false равновероятно.
  * @return {boolean}
  */
const castLots = () => getRandomInteger(1) === 1;

/**
  * Функция для генерации объекта с данными для одной задачи.
  * @return {Object} объект с данными
  */
const generateTask = () => {
  const task = {
    title: getRandomElement(Titles),
    tags: getTags(Tags),
    picture: `http://picsum.photos/100/100?r=${Math.random()}`,
    color: getRandomElement(Colors),
    repeatingDays: {
      'Mo': getRandomElement(Lots),
      'Tu': getRandomElement(Lots),
      'We': getRandomElement(Lots),
      'Th': getRandomElement(Lots),
      'Fr': getRandomElement(Lots),
      'Sa': getRandomElement(Lots),
      'Su': getRandomElement(Lots),
    },
    isFavorite: castLots(),
    isDone: castLots(),
  };

  if (getRandomInteger(1) === 1) {
    task.dueDate = getRandomDate(1, -1); // плюс-минус неделя от текущей даты
  }

  return task;
};

/**
  * Функция для получения массива заданной длины с данными для задач.
  * @param {number} number - число задач
  * @return {Array} массив объектов
  */
export default (number) => (new Array(number)).fill(``).map(() => generateTask());


import {Colors, getRandomInteger, getRandomElement, getRandomDate, getMixedArray} from './utils.js';

const MAX_TAGS_NUMBER = 3;
const Lots = [true, false, false, false, false];
const Titles = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const Tags = [`homework`, `theory`, `practice`, `intensive`, `keks`, `family`, `health`];

const getTags = (array) => new Set(getMixedArray(array).slice(0, getRandomInteger(MAX_TAGS_NUMBER)));

const castLots = () => getRandomInteger(1) === 1;

export const generateTask = () => {
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


import {Colors, getRandomInteger, getRandomElement, getRandomDate, getMixedArray} from './utils.js';

const maxTagsNumber = 3;
const Titles = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const Tags = [`homework`, `theory`, `practice`, `intensive`, `keks`, `family`, `health`];

const getTags = (array) => new Set(getMixedArray(array).slice(0, getRandomInteger(maxTagsNumber)));

const castLots = () => getRandomInteger(1) ? true : false;

export const generateTask = () => ({
  title: getRandomElement(Titles),
  dueDate: getRandomDate(1, -1), // плюс-минус неделя от текущей даты
  tags: getTags(Tags),
  picture: `http://picsum.photos/100/100?r=${Math.random()}`,
  color: getRandomElement(Colors),
  repeatingDays: {
    'Mo': castLots(),
    'Tu': castLots(),
    'We': castLots(),
    'Th': castLots(),
    'Fr': castLots(),
    'Sa': castLots(),
    'Su': castLots(),
  },
  isFavorite: castLots(),
  isDone: castLots(),
});


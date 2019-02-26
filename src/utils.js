const Unit = {
  week: 7,
  day: 24,
  hour: 60,
  minute: 60,
  second: 1000
};

// перевод числа недель в число часов
const getHourFromWeek = (week) => week * Unit.week * Unit.day * Unit.hour;

// случайное целое число [min; max]
export const getRandomInteger = (max, min = 0) => Math.floor(min + Math.random() * (max - min + 1));

// случайный индекс массива
const getRandomArrayIndex = (array) => getRandomInteger(array.length - 1);

// случайный элемент массива
export const getRandomElement = (array) => array[getRandomArrayIndex(array)];

// перемешанный массив
export const getMixedArray = (array) => {
  const originalArray = array.slice(0);
  const mixedArray = [];
  for (let i = 0; i < array.length; i++) {
    const randomIndex = getRandomArrayIndex(originalArray);
    mixedArray.push(originalArray[randomIndex]);
    originalArray.splice(randomIndex, 1);
  }
  return mixedArray;
};

// рандомная дата в диапазоне [текущая дата + weekFrom недель; текущая дата + weekTo недель] с точностью до часа
export const getRandomDate = (weekTo, weekFrom = 0) => {
  const hourFrom = getHourFromWeek(weekFrom);
  const hourTo = getHourFromWeek(weekTo);
  return Date.now() + getRandomInteger(hourTo, hourFrom) * Unit.minute * Unit.second;
};


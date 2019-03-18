/**
  * Вспомогательные функции.
  */

const Unit = {
  week: 7,
  day: 24,
  hour: 60,
  minute: 60,
  second: 1000
};

const Months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];

const Colors = [`black`, `yellow`, `blue`, `green`, `pink`];

/**
 * Генерирует случайное целое число [min: max]
 *
 * @param  {number} max - Верхняя граница.
 * @param  {number} min - Нижняя граница.
 * @return {number} случайное целое число [min: max].
 */
const getRandomInteger = (max, min = 0) => Math.floor(min + Math.random() * (max - min + 1));

/**
 * Возвращает случайный индекс для заданного массива.
 *
 * @param  {Array} array - массив.
 * @return {number} случайный индекс.
 */
const getRandomArrayIndex = (array) => getRandomInteger(array.length - 1);

/**
 * Возвращает случайный элемент массива.
 *
 * @param  {Array} array - массив.
 * @return {any} случайный элемент.
 */
const getRandomElement = (array) => array[getRandomArrayIndex(array)];

/**
 * Возвращает перемешанный массив.
 *
 * @param  {Array} array - массив.
 * @return {Array} перемешанный массив.
 */
const getMixedArray = (array) => {
  const originalArray = array.slice(0);
  const mixedArray = [];
  for (let i = 0; i < array.length; i++) {
    const randomIndex = getRandomArrayIndex(originalArray);
    mixedArray.push(originalArray[randomIndex]);
    originalArray.splice(randomIndex, 1);
  }
  return mixedArray;
};

/**
 * Возвращает случайную дату в диапазоне [текущая дата + weekFrom недель; текущая дата + weekTo недель] с точностью до дня
 *
 * @param  {number} weekTo - число недель.
 * @param  {number} weekFrom - число недель.
 * @return {timestamp} дата в формате timestamp.
 */
const getRandomDate = (weekTo, weekFrom = 0) => Date.now() + getRandomInteger(weekTo * Unit.week, weekFrom * Unit.week) * Unit.day * Unit.hour * Unit.minute * Unit.second;

/**
 * Возвращает дату в формате `DD MMMM`
 *
 * @param  {timestamp} date - дата.
 * @return {string} строка в формате `DD MMMM` (например, `17 March`)
 */
const getDate = (date) => `${date.getDate()} ${Months[date.getMonth()]}`;

/**
 * Возвращает время в формате `HH:MM AM/PM`
 *
 * @param  {timestamp} date - дата.
 * @return {string} строка в формате `HH:MM AM/PM` (например, `10:00 AM`)
 */
const getTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeOfDay = hours < 12 ? `AM` : `PM`;
  return `${hours % 12 < 10 ? `0${hours % 12}` : hours % 12}:${minutes < 10 ? `0${minutes}` : minutes} ${timeOfDay}`;
};

export {Colors, getRandomInteger, getRandomElement, getMixedArray, getRandomDate, getDate, getTime};



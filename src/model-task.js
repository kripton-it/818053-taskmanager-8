/**
  * Класс-адаптер.
  */
export default class ModelTask {
  /**
   * Создает экземпляр ModelTask.
   *
   * @constructor
   * @param {Object} data - объект с данными, пришедший с сервера
   * @this {ModelTask}
   */
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`title`] || ``;
    this.dueDate = data[`due_date`] || null;
    this.tags = new Set(data[`tags`] || []);
    this.picture = data[`picture`] || ``;
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`] || `black`;
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isDone = Boolean(data[`is_done`]);
  }

  /**
   * Метод для преобразования в формат, понятный серверу.
   * @return {object} - преобразованный объект
   */
  toRAW() {
    return {
      'id': this.id,
      'title': this.title,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'picture': this.picture,
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_done': this.isDone,
    };
  }

  /**
   * Статический метод для преобразования одного таска.
   * @param {Object} data - исходный объект с данными, пришедший с сервера
   * @return {object} - преобразованный объект
   */
  static parseTask(data) {
    return new ModelTask(data);
  }

  /**
   * Статический метод для преобразования массива тасков.
   * @param {Array} data - массив с исходными объектами, пришедший с сервера
   * @return {Array} - массив преобразованных объектов
   */
  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }
}

import ModelTask from './model-task.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

/**
  * Класс для работы с сервером.
  */
export default class API {
  /**
   * Создает экземпляр API.
   *
   * @constructor
   * @param {string} endPoint - URL сервера
   * @param {string} authorization - код авторизации
   * @this {API}
   */
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Метод для получения данных с сервера.
   * @return {Array} - массив объектов класса ModelTask.
   */
  getTasks() {
    return this._load({url: `tasks`}).then(toJSON).then(ModelTask.parseTasks);
  }

  /**
   * Метод для записи нового таска на сервер.
   * @param {object} - таск.
   * @return {Array} - объект класса ModelTask.
   */
  createTask({task}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    }).then(toJSON).then(ModelTask.parseTask);
  }

  /**
   * Метод для обновления таска на сервер.
   * @param {number} id - идентификатор.
   * @param {object} - таск.
   * @return {Array} - объект класса ModelTask.
   */
  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    }).then(toJSON).then(ModelTask.parseTask);
  }

  /**
   * Метод для удаления таска на сервере.
   * @param {number} id - идентификатор.
   * @return {Promise}.
   */
  deleteTask({id}) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  /**
   * Метод для обращения к серверу.
   * @param {Object} объект с параметрами.
   * @return {Promise}.
   */
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        // console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}

export default class Component {
  constructor() {
    // Это точно такой же класс, как все остальные,
    // только инстанцировать самого по себе его нельзя.
    // От него можно только наследоваться.
    // Для этого добавим проверку:
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    // Здесь реализации нет, но у наследников она должна быть обязательно.
    // Чтобы об этом не забыть, в реализации абстрактного класса мы будем бросать ошибку
    throw new Error(`You have to define template.`);
  }

  render() {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = this.template;
    this._element = newElement.firstChild;
    this.createListeners();
    return this._element;
  }

  unrender() {
    this.removeListeners();
    this._element = null;
  }

  createListeners() {
    // Объявляем и оставляем пустой. Переопределим их в наследниках.
    // А если нам потребуется создать компонент без подписки на события,
    // то пустая реализация позволит это сделать.
  }

  removeListeners() {
    // Объявляем и оставляем пустой. Переопределим их в наследниках.
    // А если нам потребуется создать компонент без подписки на события,
    // то пустая реализация позволит это сделать.
  }

  update() {

  }
}

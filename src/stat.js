import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';

/**
  * Модуль отрисовки статистики.
  */

const statControl = document.querySelector(`[for="control__statistic"]`);
const statContainer = document.querySelector(`.statistic`);
const boardTasksElement = document.querySelector(`.board__tasks`);
const statPeriodInput = document.querySelector(`.statistic__period-input`);

/**
 * обработчик нажатия на кнопку Statistic
 * @param {Object} evt - массив объектов с данными о фильтрах
 */
const onStatControlClick = (evt) => {
  evt.preventDefault();
  boardTasksElement.classList.toggle(`visually-hidden`);
  statContainer.classList.toggle(`visually-hidden`);
};

/**
 * функция, генерирующая данные для диаграммы
 * @param {Array} array - массив объектов с данными
 * @param {string} param - параметр для группировки данных (`tags`, `color`)
 * @return {Array} - массив с данными для диаграммы
 */
const getDataForChart = (array, param) => array.reduce((acc, element) => {
  const currentValue = element[param];
  const newAcc = acc;
  switch (param) {
    case `tags`:
      currentValue.forEach((tag) => {
        const target = newAcc.find((item) => item.value === tag);
        if (target) {
          target.count++;
        } else {
          newAcc.push({value: tag, count: 1});
        }
      });
      break;
    case `color`:
      const target = newAcc.find((item) => item.value === currentValue);
      if (target) {
        target.count++;
      } else {
        newAcc.push({value: currentValue, count: 1});
      }
      break;
    default:
      break;
  }
  return newAcc;
}, []);

/**
 * функция для отрисовки диаграммы
 * @param {Object} config - объект с параметрами
 */
const renderChart = (config) => {
  config.target.parentNode.classList.remove(`visually-hidden`);
  const chart = new Chart(config.target, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: config.labels,
      datasets: [{
        data: config.dataSet,
        backgroundColor: config.colors
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: ${config.type.toUpperCase()}`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

statControl.addEventListener(`click`, onStatControlClick);
flatpickr(statPeriodInput, {mode: `range`, altInput: true, altFormat: `j F`, dateFormat: `j F`, defaultDate: [`18 March`, `24 March`], conjunction: ` - `});

export {getDataForChart, renderChart};


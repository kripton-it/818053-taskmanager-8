import {STAT_COLORS, getMixedArray} from './utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';

let originalCharts = [];

const setTasks = (tasks) => {
  originalCharts = tasks;
};
/**
  * Модуль отрисовки статистики.
  */

const statPeriodInput = document.querySelector(`.statistic__period-input`);

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
 * функция для отрисовки одной диаграммы
 * @param {Object} config - объект с параметрами
 * @return {Chart} экземпляр класса Chart с заданными параметрами
 */
const renderChart = (config) => {
  config.target.innerHTML = ``;
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
  return chart;
};

/**
 * функция для отрисовки статистики
 */
const renderStatistic = () => {
  const tags = getDataForChart(originalCharts, `tags`);
  const colors = getDataForChart(originalCharts, `color`);
  // console.log(`render stat`);
  const tagsConfig = {
    target: document.querySelector(`.statistic__tags`),
    type: `tags`,
    labels: tags.map((tag) => `#${tag.value}`),
    dataSet: tags.map((tag) => tag.count),
    colors: getMixedArray(STAT_COLORS).slice(0, tags.length)
  };
  const colorsConfig = {
    target: document.querySelector(`.statistic__colors`),
    type: `colors`,
    labels: colors.map((color) => color.value),
    dataSet: colors.map((color) => color.count),
    colors: colors.map((color) => color.value)
  };
  renderChart(tagsConfig);
  renderChart(colorsConfig);
};

flatpickr(statPeriodInput, {mode: `range`, altInput: true, altFormat: `j F`, dateFormat: `j F`, defaultDate: [`01 April`, `07 April`], conjunction: ` - `});

export {setTasks, renderStatistic};


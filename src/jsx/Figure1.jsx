import React, { useState, useEffect, memo } from 'react';
import '../styles/styles.less';

// Load helpers.
import CSVtoJSON from './helpers/CSVtoJSON.js';
import ChartLine from './components/ChartLine.jsx';

function Figure1() {
  // Data states.
  const [dataFigure, setDataFigure] = useState(false);

  const cleanData = (data) => {
    const tmp_data = [{
      color: '#ffcb05',
      data: [],
      name: 'Africa'
    }, {
      color: '#009edb',
      data: [],
      name: 'Developed'
    }, {
      color: '#eb1f48',
      data: [],
      name: 'Developing Asia and Oceania'
    }, {
      color: '#72bf44',
      data: [],
      name: 'Latin America and the Caribbean'
    }, {
      color: 'transparent',
      data: [],
      name: 'Abs Latin America and the Caribbean',
      showInLegend: false,
      lineWidth: 0
    }, {
      color: 'transparent',
      data: [],
      name: 'Abs Developing Asia and Oceania',
      showInLegend: false,
      lineWidth: 0
    }, {
      color: 'transparent',
      data: [],
      name: 'Abs Developed',
      showInLegend: false,
      lineWidth: 0
    }, {
      color: 'transparent',
      data: [],
      name: 'Abs Africa',
      showInLegend: false,
      lineWidth: 0
    }];
    data.map((el) => {
      if (el.Name === 'Latin America and the Caribbean') {
        tmp_data[3].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
        tmp_data[4].data.push({ x: parseFloat(el.gdp_per_capita_abs), y: parseFloat(el.co2_per_capita_abs), size: parseFloat(el.normalised_size) });
      } else if (el.Name === 'Developing Asia and Oceania') {
        tmp_data[2].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
        tmp_data[5].data.push({ x: parseFloat(el.gdp_per_capita_abs), y: parseFloat(el.co2_per_capita_abs), size: parseFloat(el.normalised_size) });
      } else if (el.Name === 'Developed') {
        tmp_data[1].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
        tmp_data[6].data.push({ x: parseFloat(el.gdp_per_capita_abs), y: parseFloat(el.co2_per_capita_abs), size: parseFloat(el.normalised_size) });
      } else if (el.Name === 'Africa') {
        tmp_data[0].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
        tmp_data[7].data.push({ x: parseFloat(el.gdp_per_capita_abs), y: parseFloat(el.co2_per_capita_abs), size: parseFloat(el.normalised_size) });
      }
      return true;
    });
    return tmp_data;
  };

  useEffect(() => {
    const data_file = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2024-co2emissions/' : (window.location.href.includes('localhost:80')) ? './' : 'https://unctad-infovis.github.io/2024-co2emissions/'}assets/data/2024-co2emissions.csv`;
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setDataFigure(cleanData(CSVtoJSON(body))));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="app">
      {dataFigure && (
      <ChartLine
        data={dataFigure}
        data_decimals={1}
        idx="01"
        note="Gross domestic product (GDP) per capita converted to constant 2011 international dollars using purchasing power parity rates. CO2 per capita in tons. Horizontal axis in logarithmic scale. Size of the bubble shows total yearly CO2 emissions."
        source="UN Global Crisis Responce Group – technical team based on Global Carbon Project and the Maddison Project Database."
        subtitle="Gross domestic product (GDP) versus CO2 per capita, selected country groups, 1952–2022"
        show_only_first_and_last_labels={false}
        suffix=""
        title="The glaring inequality of income and CO2 emissions"
        ylabel=""
      />
      )}
    </div>
  );
}

export default memo(Figure1);

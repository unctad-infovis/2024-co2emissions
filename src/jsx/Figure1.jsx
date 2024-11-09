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
      color: '#72bf44',
      data: [],
      name: 'Latin America and the Caribbean'
    }, {
      color: '#eb1f48',
      data: [],
      name: 'Developing Asia and Oceania'
    }, {
      color: '#009edb',
      data: [],
      name: 'Developed'
    }, {
      color: '#ffcb05',
      data: [],
      name: 'Africa'
    }];
    data.map((el) => {
      if (el.Name === 'Latin America and the Caribbean') {
        tmp_data[0].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
      } else if (el.Name === 'Developing Asia and Oceania') {
        tmp_data[1].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
      } else if (el.Name === 'Developed') {
        tmp_data[2].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
      } else if (el.Name === 'Africa') {
        tmp_data[3].data.push({ x: parseFloat(el.gdp_per_capita), y: parseFloat(el.co2_per_capita), size: parseFloat(el.normalised_size) });
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
        note="X-axis is with logaritmic scale, annual values are handled with local regresison"
        source="UN Trade and Development (UNCTAD)"
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

import React, {
  useEffect, useCallback, useRef, memo, useState
} from 'react';
import PropTypes from 'prop-types';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

// https://www.highcharts.com/
import Highcharts from 'highcharts';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsExportData from 'highcharts/modules/export-data';

// https://d3js.org/
// import * as d3 from 'd3';

// Load helpers.
// import formatNr from '../helpers/FormatNr.js';

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    downloadCSV: 'Download CSV data',
    thousandsSep: ','
  }
});
Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => {
  const path = [
    // Arrow stem
    'M', x + w * 0.5, y,
    'L', x + w * 0.5, y + h * 0.7,
    // Arrow head
    'M', x + w * 0.3, y + h * 0.5,
    'L', x + w * 0.5, y + h * 0.7,
    'L', x + w * 0.7, y + h * 0.5,
    // Box
    'M', x, y + h * 0.9,
    'L', x, y + h,
    'L', x + w, y + h,
    'L', x + w, y + h * 0.9
  ];
  return path;
};

function LineChart({
  data, chart_height, idx, note, source, subtitle, title
}) {
  const btn = useRef();
  const chart = useRef();
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const endYear = 2022;
  const input = useRef();
  const startYear = 1952;
  const [rangeValue, setRangeValue] = useState(startYear);
  const [chartDone, setChartDone] = useState(false);
  const [once, setOnce] = useState(false);

  // 009edb
  // fbaf17
  // eslint-disable-next-line
  const getData = useCallback((year) => {
    let output = JSON.parse(JSON.stringify(data));
    output = output.map(el => {
      el.data = el.data.slice(0, year - startYear + 1);
      return el;
    });
    return output;
  }, [data]);

  const pause = useCallback(() => {
    btn.current.innerHTML = '⏵︎';
    clearTimeout(chart.current.sequenceTimer);
    chart.current.sequenceTimer = undefined;
  }, []);

  const getSubtitle = useCallback(() => `<div class="year">${input.current.value}</div>`, [input]);

  const updateChart = useCallback((current_year_idx) => {
    current_year_idx = parseInt(current_year_idx, 10);
    setRangeValue(current_year_idx);
    const tmp_data = (getData(current_year_idx));

    chart.current.series[0].update({ data: tmp_data[0].data });
    chart.current.series[1].update({ data: tmp_data[1].data });
    chart.current.series[2].update({ data: tmp_data[2].data });
    chart.current.series[3].update({ data: tmp_data[3].data });
    chart.current.series[4].update({ data: tmp_data[4].data });
    chart.current.series[5].update({ data: tmp_data[5].data });
    chart.current.series[6].update({ data: tmp_data[6].data });
    chart.current.series[7].update({ data: tmp_data[7].data });
    // chart.current.setTitle({
    //   text: `${title} in ${current_year_idx}?`
    // });
    document.querySelectorAll('.meta_data_map .values')[0].innerHTML = getSubtitle();
    chart.current.redraw(true);
  }, [getData, getSubtitle]);

  const togglePlay = useCallback(() => {
    const update = (increment) => {
      if (increment) {
        input.current.value = parseInt(input.current.value, 10) + increment;
      }
      if (input.current.value >= endYear) {
        pause(btn);
      }
      setRangeValue(input.current.value);
      updateChart(input.current.value);
    };
    const play = () => {
      btn.current.innerHTML = '⏸︎';
      chart.current.sequenceTimer = setInterval(() => {
        update(3);
      }, 500);
    };
    if (chart.current.sequenceTimer) {
      pause();
    } else {
      if (input.current.value >= endYear) {
        input.current.value = startYear;
      }
      play();
    }
  }, [pause, updateChart]);

  const changeYear = (event) => {
    pause();
    updateChart(event.currentTarget.value);
    setRangeValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (chartDone === true && once === false) {
      togglePlay();
      setOnce(true);
    }
  }, [chartDone, once, togglePlay]);

  const isVisible = useIsVisible(chartRef, { once: true });
  const createChart = useCallback(() => {
    if (once === false) {
      chart.current = Highcharts.chart(`chartIdx${idx}`, {
        caption: {
          align: 'left',
          margin: 15,
          style: {
            color: 'rgba(0, 0.0, 0.0, 0.8)',
            fontSize: '14px'
          },
          text: `<em>Source:</em> ${source} ${note ? (`<br /><em>Note:</em> <span>${note}</span>`) : ''}`,
          useHTML: true,
          verticalAlign: 'bottom',
          widthAdjust: -170,
          x: 0
        },
        chart: {
          animation: false,
          backgroundColor: '#f4f9fd',
          height: chart_height,
          type: 'spline',
          events: {
            load() {
              const chart_this = this;
              chart_this.renderer.image('https://static.dwcdn.net/custom/themes/unctad-2024-rebrand/Blue%20arrow.svg', 20, 20, 44, 43.88).add();
            }
          },
          marginRight: 50,
          resetZoomButton: {
            theme: {
              fill: '#fff',
              r: 0.0,
              areas: {
                hover: {
                  fill: '#0077b8',
                  stroke: 'transparent',
                  style: {
                    color: '#fff'
                  }
                }
              },
              stroke: '#7c7067',
              style: {
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: 400
              }
            }
          },
          style: {
            color: 'rgba(0, 0.0, 0.0, 0.8)',
            fontFamily: 'Inter',
            fontWeight: 400
          }
        },
        colors: ['rgba(0, 73, 135, 0.8)'],
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false,
          buttons: {
            contextButton: {
              menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'separator', 'downloadCSV'],
              symbol: 'download',
              symbolFill: '#000'
            }
          }
        },
        legend: {
          align: 'left',
          enabled: true,
          margin: 30,
          verticalAlign: 'top',
        },
        plotOptions: {
          series: {
            animation: true,
            events: {
              legendItemClick: (e) => {
                e.preventDefault();
              }
            },
            marker: false,
            lineWidth: 6,
            dataLabels: {
              backgroundColor: 'transparent',
              allowOverlap: true,
              enabled: true,
              crop: false,
              overflow: 'allow',
              formatter() {
                const label = this;
                if (label.point.index === label.series.points.length - 1) {
                  if (label.series.name === 'Abs Latin America and the Caribbean') {
                    return ` <img src="https://storage.unctad.org/2024-co2emissions/assets/img/latin_america_and_the_caribbean_map.png" alt="" class="chart_image" style="width: ${40 * label.point.size}px; top: ${20 * label.point.size}px; height: ${40 * label.point.size}px"/><div class="chart_label_text" style="color: #72bf44; left: ${40 * label.point.size}px">Latin America and the Caribbean</div>`;
                  } if (label.series.name === 'Abs Developing Asia and Oceania') {
                    return ` <img src="https://storage.unctad.org/2024-co2emissions/assets/img/asia_and_oceania_map.png" alt="" class="chart_image" style="width: ${40 * label.point.size}px; top: ${20 * label.point.size}px; height: ${40 * label.point.size}px"/><div class="chart_label_text" style="color: #eb1f48; left: ${40 * label.point.size}px">Asia and Oceania</div>`;
                  } if (label.series.name === 'Abs Developed') {
                    return ` <img src="https://storage.unctad.org/2024-co2emissions/assets/img/developed_map.png" alt=""  class="chart_image" style="width: ${40 * label.point.size}px; top: ${20 * label.point.size}px; height: ${40 * label.point.size}px"/><div class="chart_label_text" style="color: #009edb; left: ${40 * label.point.size}px">Developed</div>`;
                  } if (label.series.name === 'Abs Africa') {
                    return ` <img src="https://storage.unctad.org/2024-co2emissions/assets/img/africa_map.png" alt=""  class="chart_image" style="width: ${40 * label.point.size}px; top:${20 * label.point.size}px; height: ${40 * label.point.size}px"/><div class="chart_label_text" style="color: #d67c29; left: ${40 * label.point.size}px">Africa</div>`;
                  }
                }
                return '';
              },
              useHTML: true
            },
            states: {
              inactive: {
                opacity: 1
              }
            }
          },
          line: {
          }
        },
        responsive: {
          rules: [{
            chartOptions: {
              chart: {
                height: 750
              },
              legend: {
                layout: 'horizontal'
              },
              title: {
                margin: 20,
                style: {
                  fontSize: '26px',
                  lineHeight: '30px'
                }
              }
            },
            condition: {
              maxWidth: 500
            }
          }]
        },
        series: getData(startYear),
        subtitle: {
          align: 'left',
          enabled: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '18px'
          },
          text: subtitle,
          widthAdjust: -90,
          x: 64
        },
        title: {
          align: 'left',
          margin: 10,
          style: {
            color: '#000',
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: '34px'
          },
          text: `${title}`,
          widthAdjust: -90,
          x: 64,
          y: 25
        },
        tooltip: {
          enabled: false
        },
        xAxis: {
          allowDecimals: false,
          crosshair: {
            color: '#ccc',
            width: 0
          },
          gridLineColor: 'rgba(124, 112, 103, 0.2)',
          gridLineDashStyle: 'shortdot',
          gridLineWidth: 1,
          labels: {
            enabled: true,
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 400
            },
            useHTML: false,
            y: 30
          },
          // tickInterval: 1000 * 60 * 60 * 24 * 365,
          lineColor: '#ccc',
          lineWidth: 0,
          max: 80000,
          min: 999,
          opposite: false,
          // plotLines: plot_lines,
          tickLength: 5,
          tickWidth: 1,
          type: 'logarithmic',
          title: {
            enabled: true,
            align: 'high',
            y: -60,
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600
            },
            text: 'GDP per capita'
          }
        },
        yAxis: {
          // allowDecimals: allow_decimals,
          gridLineColor: 'rgba(124, 112, 103, 0.2)',
          gridLineDashStyle: 'shortdot',
          gridLineWidth: 1,
          labels: {
            formatter: (el) => `${el.value.toLocaleString('en-US')}`,
            reserveSpace: true,
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 400
            }
          },
          lineColor: 'transparent',
          lineWidth: 0,
          max: 15,
          // min: 0,
          opposite: false,
          // plotLines: false,
          // showFirstLabel: true,
          showLastLabel: true,
          // tickInterval: 5,
          title: {
            enabled: true,
            rotation: 0,
            x: 150,
            y: -5,
            align: 'high',
            reserveSpace: false,
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 600
            },
            text: 'CO2 per capita'
          },
          type: 'linear'
        }
      });
      chartRef.current.querySelector(`#chartIdx${idx}`).style.opacity = 1;
      setChartDone(true);
    }
  }, [chart_height, idx, getData, note, once, source, subtitle, title]);

  useEffect(() => {
    if (isVisible === true && once === false) {
      btn.current = chartContainerRef.current.querySelector('.play_pause_button');
      input.current = chartContainerRef.current.querySelector('.play_range');
      setTimeout(() => {
        createChart();
        document.querySelectorAll('.meta_data_map .values')[0].innerHTML = getSubtitle();
      }, 300);
    }
  }, [createChart, getSubtitle, once, isVisible]);

  return (
    <div className="chart_container" style={{ minHeight: chart_height, maxWidth: '1000px' }} ref={chartContainerRef}>
      <div className="play_controls">
        <button type="button" className="play_pause_button" aria-label="Play Pause" title="play" onClick={(event) => togglePlay(event)}>⏸︎</button>
        <input className="play_range" type="range" aria-label="Range" value={rangeValue} min={startYear} max={endYear} onInput={(event) => changeYear(event)} onChange={(event) => changeYear(event)} />
      </div>
      <div ref={chartRef}>
        {(isVisible) && (<div className="chart" id={`chartIdx${idx}`} />)}
      </div>
      <div className="meta_data_map">
        <div className="values" />
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

LineChart.propTypes = {
  chart_height: PropTypes.number,
  data: PropTypes.instanceOf(Array).isRequired,
  idx: PropTypes.string.isRequired,
  note: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  source: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired
};

LineChart.defaultProps = {
  chart_height: 700,
  note: false,
  subtitle: ''
};

export default memo(LineChart);

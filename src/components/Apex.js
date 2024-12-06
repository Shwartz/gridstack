import React, { useState } from 'react';
import Chart from 'react-apexcharts';

export const ApexChartExample = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        categories: [2015, 2016, 2017, 2018, 2019, 2020, 2021]
      },
      responsive: [{
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }]
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }]
  });

  const updateChart = () => {
    setChartData(prevState => ({
      ...prevState,
      series: [{
        ...prevState.series[0],
        data: prevState.series[0].data.map(() => Math.floor(Math.random() * 100))
      }]
    }));
  };

  return (
    <div>
      <h3>Sales Over Years</h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
      />
      <button className='btn' onClick={updateChart}>Update Data</button>
    </div>
  );
};

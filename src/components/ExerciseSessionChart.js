import React from 'react';
import { Line } from 'react-chartjs-2';

function LineChart(props) {
    const logs = props.logs;
    let dates = [];
    let avg = [];
    let max = [];

    logs && logs.forEach(function(log) {
        dates.push(log.date);
        avg.push(log.averageWeight);
        max.push(log.oneRepMax);
    });

    const data = {
        labels: dates.reverse(),
        datasets: [
            {
                label: 'Average Weight',
                fill: true,
                backgroundColor: "rgba(21, 1, 123, 0.4)",
                borderColor: "#16017B",
                pointBackgroundColor: '#FFFFFF',
                pointStyle: 'circle',
                data: avg.reverse()
            },
            {
                label: 'One Rep Max',
                fill: true,
                backgroundColor: "rgba(35, 152, 235, 0.4)",
                borderColor: "#2399EB",
                pointBackgroundColor: '#FFFFFF',
                data: max.reverse()
            }
        ]
    }

    const options = {
        title: {
            display: true,
            text: 'Your progress'
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }  
            }]
        }
    }

    return <Line data={data} options={options} />
}

export default LineChart;
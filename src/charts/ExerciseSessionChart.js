import React from 'react';
import { Line } from 'react-chartjs-2';
import { LANGUAGE } from '../constants';

function LineChart(props) {
    const logs = props.logs;
    let dates = [];
    let avg = [];
    let max = [];

    let language = sessionStorage.getItem("language");

    logs && logs.forEach(function(log) {
        dates.push(log.date);
        avg.push(log.averageWeight);
        max.push(log.oneRepMax);
    });

    const data = {
        labels: dates.reverse(),
        datasets: [
            {
                label: `${language === LANGUAGE.english ? "Average Weight" : "Średni Ciężar"}`,
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
            text: `${language === LANGUAGE.english ? "Your Progress" : "Twój Progres"}`
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
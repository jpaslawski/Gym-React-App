import React from 'react';
import { Line } from 'react-chartjs-2';

function WeightChart(props) {
    const logs = props.logs;
    let dates = [];
    let weight = [];

    let language = sessionStorage.getItem("language");

    logs && logs.forEach(function(log) {
        dates.push(log.submitDate);
        weight.push(log.currentWeight);
    })

    const data = {
        labels: dates,
        datasets: [
            {
                label: `${language === "EN" ? "Weight" : "Waga"}`,
                fill: true,
                backgroundColor: "rgba(219, 76, 178, 0.4)",
                borderColor: "#DB4CB2",
                pointBackgroundColor: '#FFFFFF',
                pointStyle: 'circle',
                data: weight
            }
        ]
    }

    const options = {
        title: {
            display: true,
            text: `${language === "EN" ? "Weight Chart" : "Wykres Wagi"}`
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

export default WeightChart;
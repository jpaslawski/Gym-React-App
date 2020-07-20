import React, { Component } from "react";
import axios from "axios";
import LineChart from "./ExerciseSessionChart";
import FullPageLoader from "./FullPageLoader";
import Error from "../Error";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

class ExerciseDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            exerciseId: this.props.match.params.exerciseId,
            exercise: undefined,
            logs: undefined,
            reps: undefined,
            weight: undefined,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.transformDate = this.transformDate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addLog = this.addLog.bind(this);
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    addLog() {
        const data = {
            exerciseId: this.state.exerciseId,
            weight: parseFloat(this.state.weight),
            reps: parseInt(this.state.reps, 10)
        }

        axios.post("api/logs", data)
        .then(response => {
            this.setState({
                errorMessage: ""
            })
            this.props.history.push("/exercises/" + this.state.exerciseId);
            window.location.reload();
        })
        .catch(error => {
            this.setState({
                errorMessage: "Ups! Something went wrong..."
            })
        });
    }

    componentDidMount() {
        axios.get("api/exercises/" + this.state.exerciseId)
            .then(response =>
                this.setState({
                    exercise: response.data,
                    isLoaded: true
                }))
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isLoaded: true,
                        errorStatusCode: 522,
                        errorMessage: "Connection lost!"
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        errorStatusCode: error.response.status,
                        errorMessage: error.response.statusText
                    })
                }
            });

        axios.get("api/logs/" + this.state.exerciseId)
            .then(response => this.setState({
                    logs: response.data,
                    isLoaded: true
                }))
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isLoaded: true,
                        errorStatusCode: 522,
                        errorMessage: "Connection lost!"
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        errorStatusCode: error.response.status,
                        errorMessage: error.response.statusText
                    })
                }
            });
    }

    extractCategory(object) {
        if (object == null) {
            return "-";
        }
        let json = JSON.stringify(object);
        return JSON.parse(json).category;
    }

    transformDate(theDate) {
        let newDateFormat;
        let date = new Date(theDate);

        let dayOfWeek = dayNames[date.getDay() - 1];
        let day = date.getUTCDate();

        let month = monthNames[date.getMonth()];
        let year = date.getUTCFullYear();
        
        newDateFormat = dayOfWeek + ", " + day + " " + month + " " + year;

        return newDateFormat;
    }

    render() {
        let { isLoaded, errorStatusCode, exercise, logs } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="card exercise-details">
                        <div className="card-info">
                            <h4 className="category">{this.extractCategory(exercise.exerciseCategory)}</h4>
                            <h4>{exercise.name}</h4>
                            <h5>{exercise.info}</h5>
                        </div>
                    </div>
                    { logs &&      
                    <div className="chart">
                        <LineChart logs = { logs } />
                    </div>}
                    <div className="logs-form">
                        <div className="reps-box">
                            <label>Reps: </label>
                            <input name="reps" type="number" onChange={this.onChange}></input>
                        </div>
                        <div className="weight-box">
                            <label>Weight: </label>
                            <input name="weight" type="number" onChange={this.onChange}></input>
                        </div>
                        <div className="submit-box">
                            <button onClick={this.addLog} disabled={this.state.weight && this.state.reps ? "" : "disabled"}>Add</button>
                        </div>
                    </div>
                    {this.state.logs && this.state.logs.map((log) => (
                        <table className="exercise-details">
                            <tr>
                                <th className="light-blue" colspan="3">{this.transformDate(log.date)}</th>
                            </tr>
                            <tr>
                                <th>#</th>
                                <th>Reps</th>
                                <th>Weight</th>
                            </tr>
                            {log.exerciseLogSet.map((element, i) => (
                                <tr>
                                    <td>{i+1}</td>
                                    <td>{element.reps}</td>
                                    <td>{element.weight}</td>
                                </tr>
                            ))}
                        </table>
                    ))}
                </div>

            );
        }
    }
}

export default ExerciseDetails;
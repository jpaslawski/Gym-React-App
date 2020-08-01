import React, { Component } from "react";
import axios from "axios";
import LineChart from "./ExerciseSessionChart";
import FullPageLoader from "./FullPageLoader";
import Error from "../Error";
import transformDate from "../Helpers";

class ExerciseDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            exerciseId: this.props.match.params.exerciseId,
            exercise: undefined,
            logs: undefined,
            reps: undefined,
            weight: undefined,
            itemCount: 2,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.addLog = this.addLog.bind(this);
        this.incItemLimit = this.incItemLimit.bind(this);
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    incItemLimit() {
        this.setState({
            itemCount: this.state.itemCount + 2
        })
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

    render() {
        let { exercise, logs, itemCount, isLoaded, errorStatusCode } = this.state;

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
                    <div id="#details" className="logs-form exercise">
                            <div className={`inputs email ${this.state.reps ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-sort-numeric-up-alt"></i>
                                </div>
                                <div>
                                    <h5>Reps</h5>
                                    <input type="number" name="reps" onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${this.state.weight ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-weight"></i>
                                </div>
                                <div>
                                    <h5>Weight</h5>
                                    <input type="number" name="weight" onChange={this.onChange} />
                                </div>
                            </div>
                        <div className="submit-box">
                            <button onClick={this.addLog} disabled={this.state.weight && this.state.reps ? "" : "disabled"}>Add</button>
                        </div>
                    </div>
                    {logs && logs.map((log, index) => (
                        index < itemCount && <table className="exercise-details">
                            <thead>
                                <tr key={index++}>
                                    <th className="light-blue" colSpan="3">{transformDate(log.date)}</th>
                                </tr>
                                <tr key={index++}>
                                    <th>#</th>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                            {log.exerciseLogSet.map((element, i) => (
                                <tr key={index + i + 1}>
                                    <td>{index + i + 1}</td>
                                    <td>{element.reps}</td>
                                    <td>{element.weight}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ))}
                    {logs && itemCount < logs.length && <div id="show-more">
                        <button onClick={this.incItemLimit}>Show more</button>
                    </div> }
                </div>

            );
        }
    }
}

export default ExerciseDetails;
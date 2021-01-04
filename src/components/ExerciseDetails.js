import React, { Component } from "react";
import axios from "axios";
import LineChart from "../charts/ExerciseSessionChart";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import Error from "../Error";
import transformDate from "../Helpers";
import { LANGUAGE } from "../constants";
import { Redirect } from "react-router";

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
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.addLog = this.addLog.bind(this);
        this.incItemLimit = this.incItemLimit.bind(this);
    }

    handleOnChange(element) {
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
            exerciseId: parseInt(this.state.exerciseId, 10),
            weight: parseFloat(this.state.weight),
            reps: parseInt(this.state.reps, 10)
        }

        axios.post("api/logs", data)
            .then(response => {
                console.log(response.data);
                this.setState({
                    errorMessage: ""
                })

                this.props.history.push("/exercises/" + this.state.exerciseId);
                window.location.reload();
            })
            .catch(error => {
                console.log(error.message);
                this.setState({
                    errorMessage: "Ups! Something went wrong..."
                })
            });
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        } else {
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
        let language = sessionStorage.getItem("language");

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="card exercise-details">
                        <div className="card-info">
                            <h4 className="category">
                                {(language === LANGUAGE.polish && exercise.exerciseCategory.categoryPL !== "") ? exercise.exerciseCategory.categoryPL : exercise.exerciseCategory.category}
                            </h4>
                            <h4>{(language === LANGUAGE.polish && exercise.namePL !== "") ? exercise.namePL : exercise.name}</h4>
                            <h5>{(language === LANGUAGE.polish && exercise.infoPL !== "") ? exercise.infoPL : exercise.info}</h5>
                        </div>
                    </div>
                    { logs &&
                        <div className="chart">
                            <LineChart logs={logs} />
                        </div>}
                    <div id="#details" className="logs-form" style={{"padding":"10px"}}>
                        <div className={`inputs email ${this.state.reps ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-sort-numeric-up-alt"></i>
                            </div>
                            <div>
                                <h5>{language === LANGUAGE.english ? "Reps" : "Powtórzenia"}</h5>
                                <input type="number" name="reps" onChange={this.handleOnChange} />
                            </div>
                        </div>
                        <div className={`inputs email ${this.state.weight ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-weight"></i>
                            </div>
                            <div>
                                <h5>{language === LANGUAGE.english ? "Weight" : "Ciężar"}</h5>
                                <input type="number" name="weight" onChange={this.handleOnChange} />
                            </div>
                        </div>
                        <div className="submit-box">
                            <button onClick={this.addLog} disabled={this.state.weight && this.state.reps ? "" : "disabled"}>{language === LANGUAGE.english ? "Add" : "Dodaj"}</button>
                        </div>
                    </div>
                    {logs && logs.map(({ id, exerciseLogSet, date }, index) => (
                        index < itemCount && <table className="exercise-details">
                            <thead>
                                <tr key={date}>
                                    <th className="light-blue" colSpan="3">{transformDate(date, language)}</th>
                                </tr>
                                <tr key={id}>
                                    <th>#</th>
                                    <th>{language === LANGUAGE.english ? "Reps" : "Powtórzenia"}</th>
                                    <th>{language === LANGUAGE.english ? "Weight" : "Ciężar"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exerciseLogSet.map(({ reps, weight }, i) => (
                                    <tr key={index + i + 1}>
                                        <td>{index + i + 1}</td>
                                        <td>{reps}</td>
                                        <td>{weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ))}
                    {logs && itemCount < logs.length && <div id="show-more">
                        <button onClick={this.incItemLimit}>{language === LANGUAGE.english ? "Show more" : "Pokaż więcej"}</button>
                    </div>}
                </div>

            );
        }
    }
}

export default ExerciseDetails;
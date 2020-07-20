import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Error from "../Error";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weightResponse: {},
            lastExercise: {},
            weightLog: undefined,
            weightLogSubmitted: false,
            showModal: false,
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
        }

        this.handleModal = this.handleModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addLog = this.addLog.bind(this);
    }

    addLog() {
        const data = {
            currentWeight: parseFloat(this.state.weightLog)
        }
        console.log(data);
        axios.post("api/users/weight", data)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                this.props.history.push("/home");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: "Ups! Something went wrong..."
                })
            });
    }

    handleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        }

        if (!this.state.weightLogSubmitted) {
            axios.get("api/users/checkWeight")
                .then(response => this.setState({
                    weightLogSubmitted: response.data,
                    showModal: !response.data,
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

        axios.get("api/users/currentWeight")
            .then(response => this.setState({
                weightResponse: response.data,
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

        axios.get("api/exercises/last")
            .then(response => this.setState({
                lastExercise: response.data,
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

    render() {
        let { weightResponse, lastExercise, showModal, isLoaded, errorStatusCode, errorMessage } = this.state;

        if (this.state.redirect) {
            return (<Redirect to='sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        }

        return (
            <div className="main-content home">
                <h1>Home</h1>
                <div className="card-container">
                    <div className="card">
                        <div className="card-info">
                            <div className="image green">
                                <i className="fas fa-weight"></i>
                            </div>
                            <div className="general">
                                <h3>{weightResponse.currentWeight}</h3>
                                <h4>Current Weight</h4>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-info">
                            <div className="image red">
                                <i className="fas fa-dumbbell"></i>
                            </div>
                            <div className="general">
                                <h3>{lastExercise.name}</h3>
                                <h4>Last Exercise</h4>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-info">
                            <div className="image yellow">
                                <i class="fas fa-burn"></i>
                            </div>
                            <div className="general">
                                <h3>2500 kcal</h3>
                                <h4>Calories</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={showModal ? "modal-show" : ""} >
                    <div className="modal-container">
                        <a href="#" onClick={this.handleModal}>
                            <i className=" fas fa-times"></i>
                        </a>
                        <h2>Daily weight check</h2>
                        <div className="logs-form">
                            <div className="weight-box">
                                <label>Weight: </label>
                                <input name="weightLog" type="number" onChange={this.onChange}></input>
                            </div>
                            <div className="submit-box">
                                <button onClick={this.addLog} disabled={this.state.weightLog ? "" : "disabled"}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
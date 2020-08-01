import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Error from "../Error";
import ProgressBar from "./ProgressBar";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weightResponse: {},
            userDailyInfo: [],
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
                    showModal: !response.data
                }))
                .catch(error => {
                    if (!error.response) {
                        this.setState({
                            errorStatusCode: 522,
                            errorMessage: "Connection lost!"
                        })
                    } else {
                        this.setState({
                            errorStatusCode: error.response.status,
                            errorMessage: error.response.statusText
                        })
                    }
                });
        }

        axios.get("api/users/details/dailyInfo")
        .then(response => this.setState({
            userDailyInfo: response.data,
            isLoaded: true
        }))
        .catch(error => {
            if (!error.response) {
                this.setState({
                    errorStatusCode: 522,
                    errorMessage: "Connection lost!"
                })
            } else {
                this.setState({
                    errorStatusCode: error.response.status,
                    errorMessage: error.response.statusText
                })
            }
        });
    }

    render() {
        let { userDailyInfo, showModal, isLoaded, errorStatusCode, errorMessage } = this.state;

        if (this.state.redirect) {
            return (<Redirect to='sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content home">
                    <h1>Home</h1>
                    <div className="card-container align-items">
                        <div className="card">
                            <div className="card-info">
                                <div className="image green">
                                    <i className="fas fa-weight"></i>
                                </div>
                                <div className="general">
                                    <h3>{userDailyInfo.currentWeight} kg</h3>
                                    <h4>Current Weight</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-info">
                                <div className="image yellow">
                                    <i className="fas fa-burn"></i>
                                </div>
                                <div className="general">
                                    <h3>{userDailyInfo.currentCalorieBalance} kcal</h3>
                                    <h4>Daily Balance of Calories</h4>
                                </div>
                            </div>
                        </div>
                        <div className="wrapper">
                            <h3>Macronutrients Daily Goal</h3>
                            <div className="progress-container">
                                <label>Protein</label>
                                <ProgressBar percentage={userDailyInfo.proteinPercentage} background="0" />
                                <label>Carbs</label>
                                <ProgressBar percentage={userDailyInfo.carbsPercentage} background="1" />
                                <label>Fat</label>
                                <ProgressBar percentage={userDailyInfo.fatPercentage} background="2" />
                            </div>
                        </div>
                    </div>
                    <div className={showModal ? "modal-show" : ""} >
                        <div className="modal-container home">
                            <a href="/#" onClick={this.handleModal}>
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>Daily weight check</h2>
                            <div className="logs-form" style={{ boxShadow: "none" }}>
                                <div className={`inputs email ${this.state.weightLog ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-weight"></i>
                                    </div>
                                    <div>
                                        <h5>Weight</h5>
                                        <input type="number" name="weightLog" onChange={this.onChange} />
                                    </div>
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
}

export default Home;
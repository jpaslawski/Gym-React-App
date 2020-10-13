import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import ProgressBar from "../animatedComponents/ProgressBar";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weightResponse: {},
            userDailyInfo: [],
            weightLog: undefined,
            weightLogSubmitted: false,
            showModal: true,
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

        axios.post("api/users/weight", data)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                sessionStorage.setItem('WeightLogModalShow', false);
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

        sessionStorage.setItem('WeightLogModalShow', false);
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
                    showModal: (sessionStorage.getItem('WeightLogModalShow') === "false" ? false : true) && !response.data
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
        let language = sessionStorage.getItem("language");

        let progressContainer =  <div className="progress-container">
                                    <label>{language === "EN" ? "Protein" : "Białko"}</label>
                                    <ProgressBar percentage={userDailyInfo.proteinPercentage} background="0" />
                                    <label>{language === "EN" ? "Carbs" : "Węglowodany"}</label>
                                    <ProgressBar percentage={userDailyInfo.carbsPercentage} background="1" />
                                    <label>{language === "EN" ? "Fat" : "Tłuszcze"}</label>
                                    <ProgressBar percentage={userDailyInfo.fatPercentage} background="2" />
                                </div>;

        if (this.state.redirect) {
            return (<Redirect to='sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={language === "EN" ? "Try again later!" : "Spróbuj ponownie później!"} />;
        } else {
            return (
                <div className="main-content home">
                    <div className="pageLabel">
                        <h1>{language === "EN" ? "Home" : "Strona główna"}</h1>
                    </div>
                    <div className="card-container">
                        <div className="card">
                            <div className="card-info">
                                <div className="image green">
                                    <i className="fas fa-weight"></i>
                                </div>
                                <div className="general">
                                    <h3>{userDailyInfo.currentWeight} kg</h3>
                                    <h4>{language === "EN" ? "Current Weight" : "Aktualna waga"}</h4>
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
                                    <h4>{language === "EN" ? "Daily Balance of Calories" : "Dzienny balans kaloryczny"}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="wrapper">
                            <h3>{language === "EN" ? "Macronutrients Daily Goal" : "Dzienne zapotrzebowanie na makroskładniki"}</h3>
                            {(userDailyInfo.proteinPercentage && userDailyInfo.carbsPercentage && userDailyInfo.fatPercentage) ? 
                                progressContainer : <p className="no-content">{language === "EN" ? "You haven' t submitted any meals today..." : "Nie dodałeś dzisiaj żadnych posiłków..."}</p>}
                        </div>
                    </div>
                    <div className={showModal ? "modal-show" : ""} >
                        <div className="modal-container home">
                            <a href="# " onClick={this.handleModal}>
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "Daily weight check" : "Codzienne sprawdzenie wagi"}</h2>
                            <div className="logs-form" style={{ boxShadow: "none" }}>
                                <div className={`inputs email ${this.state.weightLog ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-weight"></i>
                                    </div>
                                    <div>
                                        <h5>{language === "EN" ? "Weight" : "Waga"}</h5>
                                        <input type="number" name="weightLog" onChange={this.onChange} />
                                    </div>
                                </div>
                                <div className="submit-box">
                                    <button onClick={this.addLog} disabled={this.state.weightLog ? "" : "disabled"}>{language === "EN" ? "Update" : "Aktualizuj"}</button>
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
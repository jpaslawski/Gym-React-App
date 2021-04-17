import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import ProfileImage from '../assets/profile.jpg';
import WeightChart from "../charts/WeightChart";
import Slider from '@material-ui/core/Slider';
import DatePicker from "react-datepicker";
import { LANGUAGE } from "../constants";
import { Redirect } from "react-router";

import "react-datepicker/dist/react-datepicker.css";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            username: undefined,
            email: undefined,
            password: undefined,
            date: new Date(),
            weight: undefined,
            height: undefined,
            gender: undefined,
            proteinSlider: undefined,
            carbsSlider: undefined,
            fatSlider: undefined,
            dietGoal: undefined,
            calorieDiff: undefined,
            exerciseLevel: undefined,
            weightLogs: [],
            dietDetails: [],
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnChangeDate = this.handleOnChangeDate.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.openModalProfile = this.openModalProfile.bind(this);

        this.updateUser = this.updateUser.bind(this);
        this.updateUserDiet = this.updateUserDiet.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    handleOnChangeDate(selectedDate) {
        this.setState({
            date: selectedDate
        })
    }

    handleSliderChange = name => (e, value) => {
        let { proteinSlider, carbsSlider, fatSlider } = this.state;
        let diff = 0;
        if (name === "proteinSlider") {
            diff = value - proteinSlider;
            if (carbsSlider - diff >= 0 && carbsSlider - diff <= 100) carbsSlider -= diff;
            else {
                fatSlider -= diff - carbsSlider;
                carbsSlider = carbsSlider - diff >= 100 ? 100 : 0;
            }

            this.setState({
                [name]: value,
                carbsSlider: carbsSlider,
                fatSlider: fatSlider
            });
        }

        if (name === "carbsSlider") {
            diff = value - carbsSlider;
            if (fatSlider - diff >= 0 && fatSlider - diff <= 100) fatSlider -= diff;
            else {
                proteinSlider -= diff - fatSlider;
                fatSlider = fatSlider - diff >= 100 ? 100 : 0;
            }

            this.setState({
                [name]: value,
                proteinSlider: proteinSlider,
                fatSlider: fatSlider
            });
        }

        if (name === "fatSlider") {
            diff = value - fatSlider;
            if (proteinSlider - diff >= 0 && proteinSlider - diff <= 100) proteinSlider -= diff;
            else {
                carbsSlider -= diff - proteinSlider;
                proteinSlider = proteinSlider - diff >= 100 ? 100 : 0;
            }
            this.setState({
                [name]: value,
                proteinSlider: proteinSlider,
                carbsSlider: carbsSlider
            });
        }
    }

    openModalProfile() {
    this.setState({
            username: this.state.user.username,
            date: new Date(this.state.user.dateOfBirth),
            weight: this.state.user.weight,
            height: this.state.user.height,
            gender: this.state.user.gender,
            exerciseLevel: this.state.user.exerciseLevel
        });
    }

    updateUser() {
        const data = {
            id: this.state.user.id,
            email: this.state.user.email,
            password: this.state.user.password,
            username: this.state.username,
            dateOfBirth: this.state.date,
            height: this.state.height,
            weight: this.state.weight,
            gender: this.state.gender === "Undefined" ? "Male" : this.state.gender,
            exerciseLevel: this.state.exerciseLevel
        }

        axios.put("api/users", data)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                this.props.history.push("profile");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: "Ups! Something went wrong..."
                })
            });
    }

    updateUserDiet() {
        const data = {
            id: this.state.dietDetails.id,
            proteinPercentage: this.state.proteinSlider,
            carbsPercentage: this.state.carbsSlider,
            fatPercentage: this.state.fatSlider,
            calorieDiff: this.state.calorieDiff * this.state.dietGoal,
            totalCalories: this.state.dietDetails.totalCalories
        }

        axios.post("api/users/diet", data)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                this.props.history.push("profile");
                window.location.reload();
            })
            .catch(error => {
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
            axios.get("api/users/details")
                .then(response => this.setState({
                    user: response.data
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

            axios.get("api/users/weight")
                .then(response => this.setState({
                    weightLogs: response.data
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

            axios.get("api/users/diet")
                .then(response => this.setState({
                    dietDetails: response.data,
                    proteinSlider: response.data.proteinPercentage,
                    carbsSlider: response.data.carbsPercentage,
                    fatSlider: response.data.fatPercentage,
                    dietGoal: Math.sign(response.data.calorieDiff),
                    calorieDiff: response.data.calorieDiff,
                    isLoaded: true
                }))
                .catch(error => {
                    if (!error.response) {
                        this.setState({
                            isLoaded: true,
                            errorStatusCode: 522,
                            errorMessage: "Connection lost!"
                        })
                    } else if (error.response.status === 400) {
                        this.setState({
                            dietDetails: {},
                            isLoaded: true
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

    render() {
        let { user, username, weight, height, gender, exerciseLevel, weightLogs, isLoaded, errorStatusCode, errorMessage } = this.state;
        let { dietDetails, proteinSlider, carbsSlider, fatSlider, dietGoal, calorieDiff } = this.state;

        const language = sessionStorage.getItem("language");

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="profile">
                        <div className="profile-main">
                            <div className="center-content">
                                <img alt="profile" src={ProfileImage} />
                            </div>
                            <h3>{user.username}</h3>
                            <h4>{user.email}</h4>
                        </div>
                        <div className="profile-details">
                            <div className="section-label">{language === LANGUAGE.english ? "User Details" : "Szczegółowe informacje"}</div>
                            <div className="user-info">
                                <div className="item-label">{language === LANGUAGE.english ? "Date of Birth" : "Data urodzenia"}:</div>
                                <div className="item-content">{user.dateOfBirth}</div>

                                <div className="item-label">{language === LANGUAGE.english ? "Height" : "Wzrost"}:</div>
                                <div className="item-content">{user.height} cm</div>

                                <div className="item-label">{language === LANGUAGE.english ? "Weight" : "Waga"}:</div>
                                <div className="item-content">{user.weight} kg</div>

                                <div className="item-label">{language === LANGUAGE.english ? "Gender" : "Płeć"}:</div>
                                <div className="item-content">
                                    {user.gender === "Undefined" ? "-" : (language === LANGUAGE.english ? user.gender : ( user.gender === "Male" ? "Mężczyzna" : "Kobieta"))}
                                </div>

                                <div className="item-label">{language === LANGUAGE.english ? "Exercise Level Ratio" : "Współczynnik wysiłku fizycznego"}:</div>
                                <div className="item-content">{user.exerciseLevel}</div>
                            </div>
                            <div className="center-content"><a href="#modal-profile">
                                <button onClick={this.openModalProfile}>{language === LANGUAGE.english ? "Update your profile" : "Zaktualizuj profil"}</button>
                            </a>
                            </div>
                            <div className="section-label">{language === LANGUAGE.english ? "Diet Details" : "Szczegóły Diety"}</div>
                            <div className="user-info">
                                <div className="item-label">{language === LANGUAGE.english ? "Protein Percentage" : "Procent Białka"}:</div>
                                <div className="item-content">{dietDetails.proteinPercentage} %</div>

                                <div className="item-label">{language === LANGUAGE.english ? "Carbs Percentage" : "Procent Węglowodanów"}:</div>
                                <div className="item-content">{dietDetails.carbsPercentage} %</div>

                                <div className="item-label">{language === LANGUAGE.english ? "Fat Percentage" : "Procent Tłuszczy"}:</div>
                                <div className="item-content">{dietDetails.fatPercentage} %</div>

                                <div className="item-label">{language === LANGUAGE.english ? "Total Calories" : "Całkowita ilość kalorii"}:</div>
                                <div className="item-content">{dietDetails.totalCalories + dietDetails.calorieDiff}</div>
                            </div>
                            <div className="center-content"><a href="#modal-diet">
                                <button>{language === LANGUAGE.english ? "Change your diet" : "Zmień dietę"}</button>
                            </a>
                            </div>
                        </div>
                    </div>
                    {weightLogs && <div className="chart">
                        <WeightChart logs={weightLogs} />
                    </div>}

                    <div className="modal" id="modal-profile">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Update you profile" : "Zaktualizuj profil"}</h2>
                            <form>
                                <div className={`inputs email ${username ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <h5>{language === LANGUAGE.english ? "Username" : "Nazwa użytkownika"}</h5>
                                        <input type="text" name="username" onChange={this.handleOnChange} value={username || ""} />
                                    </div>
                                </div>
                                <div className="inputs email focus">
                                    <div className="i">
                                        <i className="fas fa-calendar"></i>
                                    </div>
                                    <DatePicker selected={this.state.date}
                                                onChange={this.handleOnChangeDate} />
                                </div>

                                <div className={`inputs pass ${(weight || weight === 0) ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-weight"></i>
                                    </div>
                                    <div>
                                        <h5>{language === LANGUAGE.english ? "Weight" : "Waga"}</h5>
                                        <input type="number" name="weight" onChange={this.handleOnChange} value={weight || ""} />
                                    </div>
                                </div>
                                <div className={`inputs pass ${(height || height === 0) ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-arrows-alt-v"></i>
                                    </div>
                                    <div>
                                        <h5>{language === LANGUAGE.english ? "Height" : "Wzrost"}</h5>
                                        <input type="number" name="height" onChange={this.handleOnChange} value={height || ""} />
                                    </div>
                                </div>
                                <div className={`inputs pass ${gender ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-venus-mars"></i>
                                    </div>
                                    <div>
                                        <h5>{language === LANGUAGE.english ? "Gender" : "Płeć"}</h5>
                                        <select name="gender" onChange={this.handleOnChange} value={gender === "Undefined" ? "Male" : gender}>
                                            <option value="Male">{language === LANGUAGE.english ? "Male" : "Mężczyzna"}</option>
                                            <option value="Female">{language === LANGUAGE.english ? "Female" : "Kobieta"}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`inputs pass ${exerciseLevel ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-signal"></i>
                                    </div>
                                    <div>
                                        <h5>{language === LANGUAGE.english ? "Exercise Level" : "Poziom wysiłku fizycznego"}</h5>
                                        <select name="exerciseLevel" onChange={this.handleOnChange} value={exerciseLevel}>
                                            <option value="1.2">{language === LANGUAGE.english ? "Little to no exercise" : "Mały wysiłek lub jego brak"}</option>
                                            <option value="1.375">{language === LANGUAGE.english ? "Light exercise (1 - 3 days per week)" : "Lekki trening (1 - 3 dni w tygodniu)"}</option>
                                            <option value="1.55">{language === LANGUAGE.english ? "Moderate exercise (3 - 5 days per week)" : "Umiarkowany trening (3 - 5 dni w tygodniu)"}</option>
                                            <option value="1.725">{language === LANGUAGE.english ? "Heavy exercise (6 - 7 days per week)" : "Ciężki trening (6 - 7 dni w tygodniu)"}</option>
                                            <option value="1.9">{language === LANGUAGE.english ? "Very heavy exercise (twice per day)" : "Bardzo ciężki trening (2 razy dziennie)"}</option>
                                        </select>
                                    </div>
                                </div>
                                <p className="error-message ">{this.state.errorMessage}</p>
                                <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Update" : "Zaktualizuj"} disabled={!(username && weight > 0 && height > 0)} onClick={this.updateUser} />
                            </form>
                        </div>
                    </div>
                    <div className="modal" id="modal-diet">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Change your diet parameters" : "Zmień parametry diety"}</h2>
                            <div className="slider-container">
                                <label>{language === LANGUAGE.english ? "Protein Percentage" : "Procent Białka"}</label>
                                <Slider
                                    className="protein"
                                    value={proteinSlider}
                                    track={false}
                                    valueLabelDisplay="on"
                                    onChange={this.handleSliderChange("proteinSlider")} />
                                <label>{language === LANGUAGE.english ? "Carbs Percentage" : "Procent Węglowodanów"}</label>
                                <Slider
                                    className="carbs"
                                    value={carbsSlider}
                                    track={false}
                                    aria-labelledby="carbsSlider"
                                    valueLabelDisplay="on"
                                    onChange={this.handleSliderChange("carbsSlider")} />
                                <label>{language === LANGUAGE.english ? "Fat Percentage" : "Procent Tłuszczy"}</label>
                                <Slider
                                    className="fat"
                                    value={fatSlider}
                                    track={false}
                                    aria-labelledby="fatSlider"
                                    valueLabelDisplay="on"
                                    onChange={this.handleSliderChange("fatSlider")} />
                            </div>
                            <div className="inputs focus">
                                <div className="i">
                                    <i className="fas fa-bullseye"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Diet goal" : "Cel Diety"}</h5>
                                    <select name="dietGoal" onChange={this.handleOnChange} value={dietGoal}>
                                        <option value="-1">{language === LANGUAGE.english ? "Lose Weight" : "Utrata wagi"}</option>
                                        <option value="0">{language === LANGUAGE.english ? "Keep current Weight" : "Utrzymanie aktualnej wagi"}</option>
                                        <option value="1">{language === LANGUAGE.english ? "Gain Weight" : "Przybranie wagi"}</option>
                                    </select>
                                </div>
                            </div>
                            {dietGoal !== 0 &&
                                <div className={`inputs pass ${(calorieDiff || calorieDiff === 0) ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-weight"></i>
                                    </div>
                                    <div>
                                        <h5>{dietGoal < 0 ? `${language === LANGUAGE.english ? "Calorie Deficit" : "Deficyt Kaloryczny"}` : `${language === LANGUAGE.english ? "Calorie Surplus" : "Nadwyżka Kaloryczna"}`}</h5>
                                        <input type="number" name="calorieDiff" onChange={this.handleOnChange} value={Math.abs(calorieDiff)} />
                                    </div>
                                </div>}
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Update" : "Zaktualizuj"} onClick={this.updateUserDiet} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Profile;
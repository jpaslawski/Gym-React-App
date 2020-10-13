import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import ProfileImage from '../assets/profile.jpg';
import WeightChart from "../charts/WeightChart";
import Slider from '@material-ui/core/Slider';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            username: undefined,
            email: undefined,
            password: undefined,
            day: undefined,
            month: undefined,
            year: undefined,
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
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.openModalProfile = this.openModalProfile.bind(this);
        this.handleDateFormat = this.handleDateFormat.bind(this);

        this.updateUser = this.updateUser.bind(this);
        this.updateUserDiet = this.updateUserDiet.bind(this);
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    handleSliderChange = name => (e, value) => {
        let { proteinSlider, carbsSlider, fatSlider } = this.state;
        let diff = 0;
        if (name === "proteinSlider") {
            diff = value - proteinSlider;
            if( carbsSlider - diff >= 0 && carbsSlider - diff <= 100) carbsSlider -= diff;
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
            if( fatSlider - diff >= 0 && fatSlider - diff <= 100) fatSlider -= diff;
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
            if( proteinSlider - diff >= 0 && proteinSlider  - diff <= 100) proteinSlider -= diff;
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
        let dateOfBirth = new Date(this.state.user.dateOfBirth);

        this.setState({
            username: this.state.user.username,
            day: dateOfBirth.getDate(),
            month: parseInt(dateOfBirth.getMonth() + 1, 10),
            year: dateOfBirth.getFullYear(),
            weight: this.state.user.weight,
            height: this.state.user.height,
            gender: this.state.user.gender,
            exerciseLevel: this.state.user.exerciseLevel
        });
    }

    handleDateFormat(day, month, year) {
        day = ("0" + day).slice(-2);
        month = ("0" + month).slice(-2);

        let date = year + "-" + month + "-" + day;
        return date;
    }

    updateUser() {
        const data = {
            id: this.state.user.id,
            email: this.state.user.email,
            password: this.state.user.password,
            username: this.state.username,
            dateOfBirth: this.handleDateFormat(this.state.day, this.state.month, this.state.year),
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
        let { user, username, day, month, year, weight, height, gender, exerciseLevel, weightLogs, isLoaded, errorStatusCode, errorMessage } = this.state;
        let { dietDetails, proteinSlider, carbsSlider, fatSlider, dietGoal, calorieDiff } = this.state;

        const days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let language = sessionStorage.getItem("language");
        let years = [];
        let currentYear = new Date().getFullYear();
        for (let year = currentYear; year > currentYear - 100; year--) {
            years.push(year);
        }

        if (!isLoaded) {
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
                            <div className="section-label">{language === "EN" ? "User Details" : "Szczegóły informacje"}</div>
                            <div className="user-info">
                                <div className="item-label">{language === "EN" ? "Date of Birth" : "Data urodzenia"}:</div>
                                <div className="item-content">{user.dateOfBirth}</div>

                                <div className="item-label">{language === "EN" ? "Height" : "Wzrost"}:</div>
                                <div className="item-content">{user.height} cm</div>

                                <div className="item-label">{language === "EN" ? "Weight" : "Waga"}:</div>
                                <div className="item-content">{user.weight} kg</div>

                                <div className="item-label">{language === "EN" ? "Gender" : "Płeć"}:</div>
                                <div className="item-content">{user.gender}</div>

                                <div className="item-label">{language === "EN" ? "Exercise Level Ratio" : "Współczynnik wysiłku fizycznego"}:</div>
                                <div className="item-content">{user.exerciseLevel}</div>
                            </div>
                            <div className="center-content"><a href="#modal-profile">
                                <button onClick={this.openModalProfile}>{language === "EN" ? "Update your profile" : "Zaktualizuj profil"}</button>
                            </a>
                            </div>
                            <div className="section-label">{language === "EN" ? "Diet Details" : "Szczegóły Diety"}</div>
                            <div className="user-info">
                                <div className="item-label">{language === "EN" ? "Protein Percentage" : "Procent Białka"}:</div>
                                <div className="item-content">{dietDetails.proteinPercentage} %</div>

                                <div className="item-label">{language === "EN" ? "Carbs Percentage" : "Procent Węglowodanów"}:</div>
                                <div className="item-content">{dietDetails.carbsPercentage} %</div>

                                <div className="item-label">{language === "EN" ? "Fat Percentage" : "Procent Tłuszczy"}:</div>
                                <div className="item-content">{dietDetails.fatPercentage} %</div>

                                <div className="item-label">{language === "EN" ? "Total Calories" : "Całkowita ilość kalorii"}:</div>
                                <div className="item-content">{dietDetails.totalCalories + dietDetails.calorieDiff}</div>
                            </div>
                            <div className="center-content"><a href="#modal-diet">
                                <button>{language === "EN" ? "Change your diet" : "Zmień dietę"}</button>
                            </a>
                            </div>
                        </div>
                    </div>
                    <div className="chart">
                        {weightLogs && <WeightChart logs={weightLogs} />}
                    </div>

                    <div className="modal" id="modal-profile">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "Update you profile" : "Zaktualizuj profil"}</h2>
                            <form>
                                <div className={`inputs email ${username ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <h5>{language === "EN" ? "Username" : "Nazwa użytkownika"}</h5>
                                        <input type="text" name="username" onChange={this.onChange} value={username || ""} />
                                    </div>
                                </div>
                                <div className="input-calendar">
                                    <div className="i">
                                        <i className="fas fa-calendar"></i>
                                    </div>
                                    <div className="input-group">
                                        <div className="day">
                                            <h5>{language === "EN" ? "Day" : "Dzień"}</h5>
                                            <select name="day" onChange={this.onChange} value={day}>
                                                {days.map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="month">
                                            <h5>{language === "EN" ? "Month" : "Miesiąc"}</h5>
                                            <select name="month" onChange={this.onChange} value={month}>
                                                {months.map((m, index) => (
                                                    <option key={m} value={index + 1}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="year">
                                            <h5>{language === "EN" ? "Year" : "Rok"}</h5>
                                            <select name="year" onChange={this.onChange} value={year}>
                                                {years.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className={`inputs pass ${(weight || weight === 0) ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-weight"></i>
                                    </div>
                                    <div>
                                        <h5>{language === "EN" ? "Weight" : "Waga"}</h5>
                                        <input type="number" name="weight" onChange={this.onChange} value={weight || ""} />
                                    </div>
                                </div>
                                <div className={`inputs pass ${(height || height === 0) ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-arrows-alt-v"></i>
                                    </div>
                                    <div>
                                        <h5>{language === "EN" ? "Height" : "Wzrost"}</h5>
                                        <input type="number" name="height" onChange={this.onChange} value={height || ""} />
                                    </div>
                                </div>
                                <div className={`inputs pass ${gender ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-venus-mars"></i>
                                    </div>
                                    <div>
                                        <h5>{language === "EN" ? "Gender" : "Płeć"}</h5>
                                        <select name="gender" onChange={this.onChange} value={gender === "Undefined" ? "Male" : gender}>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`inputs pass ${exerciseLevel ? "focus" : ""}`}>
                                    <div className="i">
                                        <i className="fas fa-signal"></i>
                                    </div>
                                    <div>
                                        <h5>{language === "EN" ? "Exercise Level" : "Poziom wysiłku fizycznego"}</h5>
                                        <select name="exerciseLevel" onChange={this.onChange} value={exerciseLevel}>
                                            <option value="1.2">{language === "EN" ? "Little to no exercise" : "Mały wysiłek lub jego brak"}</option>
                                            <option value="1.375">{language === "EN" ? "Light exercise (1 - 3 days per week)" : "Lekki trening (1 - 3 dni w tygodniu)"}</option>
                                            <option value="1.55">{language === "EN" ? "Moderate exercise (3 - 5 days per week)" : "Umiarkowany trening (3 - 5 dni w tygodniu)"}</option>
                                            <option value="1.725">{language === "EN" ? "Heavy exercise (6 - 7 days per week)" : "Ciężki trening (6 - 7 dni w tygodniu)"}</option>
                                            <option value="1.9">{language === "EN" ? "Very heavy exercise (twice per day)" : "Bardzo ciężki trening (2 razy dziennie)"}</option>
                                        </select>
                                    </div>
                                </div>
                                <p className="error-message ">{this.state.errorMessage}</p>
                                <input type="button" className="btn" value={language === "EN" ? "Update" : "Zaktualizuj"} disabled={!(username && weight > 0 && height > 0)} onClick={this.updateUser} />
                            </form>
                        </div>
                    </div>
                    <div className="modal" id="modal-diet">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "Change your diet parameters" : "Zmień parametry diety"}</h2>
                            <div className="slider-container">
                                <label>{language === "EN" ? "Protein Percentage" : "Procent Białka"}</label>
                                    <Slider
                                        className="protein"
                                        value={proteinSlider}
                                        track={false}
                                        valueLabelDisplay="on"
                                        onChange={this.handleSliderChange("proteinSlider")} />
                                <label>{language === "EN" ? "Carbs Percentage" : "Procent Węglowodanów"}</label>
                                    <Slider
                                        className="carbs"
                                        value={carbsSlider}
                                        track={false}
                                        aria-labelledby="carbsSlider"
                                        valueLabelDisplay="on"
                                        onChange={this.handleSliderChange("carbsSlider")} />
                                <label>{language === "EN" ? "Fat Percentage" : "Procent Tłuszczy"}</label>
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
                                    <h5>{language === "EN" ? "Diet goal" : "Cel Diety"}</h5>
                                    <select name="dietGoal" onChange={this.onChange} value={dietGoal}>
                                        <option value="-1">{language === "EN" ? "Lose Weight" : "Utrata wagi"}</option>
                                        <option value="0">{language === "EN" ? "Keep current Weight" : "Utrzymanie aktualnej wagi"}</option>
                                        <option value="1">{language === "EN" ? "Gain Weight" : "Przybranie wagi"}</option>
                                    </select>
                                </div>
                            </div>
                            {dietGoal !== 0 && 
                            <div className={`inputs pass ${ (calorieDiff || calorieDiff === 0) ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-weight"></i>
                                </div>
                                <div>
                                    <h5>{ dietGoal < 0 ? `${language === "EN" ? "Calorie Deficit" : "Deficyt Kaloryczny"}` : `${language === "EN" ? "Calorie Surplus" : "Nadwyżka Kaloryczna"}`}</h5>
                                    <input type="number" name="calorieDiff" onChange={this.onChange} value={ Math.abs(calorieDiff) } />
                                </div>
                            </div>}
                            <p className="error-message ">{this.state.errorMessage}</p>
                                <input type="button" className="btn" value={language === "EN" ? "Update" : "Zaktualizuj"} onClick={this.updateUserDiet} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Profile;
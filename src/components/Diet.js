import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import transformDate from "../Helpers";
import { LANGUAGE } from "../constants";
import { Redirect } from "react-router";

class Diet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mealName: "",
            meals: [],
            mealsToDisplay: [],
            mealLogsSet: [],
            currentLogsSet: {},
            currentIndex: undefined,
            mealToAdd: {},
            portionCount: 1,
            itemCount: 6,
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnChangePortionCount = this.handleOnChangePortionCount.bind(this);
        this.addMealLog = this.addMealLog.bind(this);
        this.incLogSetIndex = this.incLogSetIndex.bind(this);
        this.decLogSetIndex = this.decLogSetIndex.bind(this);
        this.incItemLimit = this.incItemLimit.bind(this);
    }

    handleOnChange(element) {
        let newArray = [];
        if (element.target.name === "mealName" && element.target.value !== "") {
            newArray = this.state.meals.filter(meal => {
                return meal.name.toLowerCase().includes(element.target.value.toLowerCase())
            })
        } else if (element.target.name === "mealName" && element.target.value === "") {
            newArray = this.state.meals;
        }

        this.setState({
            [element.target.name]: element.target.value,
            mealsToDisplay: newArray
        });
    }

    handleOnChangePortionCount(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    setMeal(id) {
        this.setState({
            mealToAdd: this.state.meals.find(meal => {
                return meal.id === id;
            })
        })
    }

    incLogSetIndex() {
        let index = this.state.currentIndex;

        if (this.state.currentIndex + 1 < this.state.mealLogsSet.length) index++;
        else index = 0;

        this.setState({
            currentIndex: index,
            currentLogsSet: this.state.mealLogsSet[index]
        })
    }

    decLogSetIndex() {
        let index = this.state.currentIndex;

        if (this.state.currentIndex - 1 >= 0) index--;
        else index = this.state.mealLogsSet.length - 1;

        this.setState({
            currentIndex: index,
            currentLogsSet: this.state.mealLogsSet[index]
        })
    }

    incItemLimit() {
        this.setState({
            itemCount: this.state.itemCount + 6
        })
    }

    addMealLog() {
        let { history } = this.props;

        const data = {
            mealId: this.state.mealToAdd.id,
            portionCount: this.state.portionCount
        }

        axios.post("api/mealLog", data)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                history.push("diet");
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
            axios.get("api/meals/available")
                .then(response => this.setState({
                    meals: response.data,
                    mealsToDisplay: response.data,
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

            axios.get("api/mealLog/all")
                .then(response => {
                    if (response.data !== "") {
                        this.setState({
                            mealLogsSet: response.data,
                            currentLogsSet: response.data[0],
                            currentIndex: 0,
                            isLoaded: true
                        });
                    }
                })
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

    render() {
        let { mealToAdd, mealsToDisplay, currentLogsSet, itemCount, isLoaded, errorStatusCode, errorMessage } = this.state;
        let language = sessionStorage.getItem("language");

        let tableOfLogs = <table className="diet">
            <thead>
                <tr>
                    <th className="light-blue" colSpan="1">
                        {this.state.mealLogsSet.length > 1 &&
                            <button className="handleLogSet" onClick={this.decLogSetIndex} style={{ "float": "right", "background": "transparent" }}><i className="fas fa-arrow-left"></i></button>}
                    </th>
                    {currentLogsSet.date && <th className="light-blue" colSpan="3">{transformDate(currentLogsSet.date, language)}</th>}
                    <th className="light-blue" colSpan="1">
                        {this.state.mealLogsSet.length > 1 &&
                            <button className="handleLogSet" onClick={this.incLogSetIndex} style={{ "float": "left", "background": "transparent" }}><i className="fas fa-arrow-right"></i></button>}
                    </th>
                </tr>
                <tr>
                    <th>{language === LANGUAGE.english ? "Name" : "Nazwa"}</th>
                    <th>{language === LANGUAGE.english ? "Calories" : "Kalorie"}</th>
                    <th>{language === LANGUAGE.english ? "Protein" : "Białko"}</th>
                    <th>{language === LANGUAGE.english ? "Carbs" : "Węglowodany"}</th>
                    <th>{language === LANGUAGE.english ? "Fat" : "Tłuszcze"}</th>
                </tr>
            </thead>
            <tbody>
                {currentLogsSet.mealLogs && currentLogsSet.mealLogs.map(({ id, referredMeal, portionCount }) => (
                    <tr key={id}>
                        <td key={referredMeal.name}>{(language === LANGUAGE.polish && referredMeal.namePL !== "") ? referredMeal.namePL : referredMeal.name}</td>
                        <td key={referredMeal.calories}>{(referredMeal.calories * portionCount).toFixed(2)} kcal</td>
                        <td key={referredMeal.protein}>{(referredMeal.protein * portionCount).toFixed(2)} g</td>
                        <td key={referredMeal.carbs}>{(referredMeal.carbs * portionCount).toFixed(2)} g</td>
                        <td key={referredMeal.fat}>{(referredMeal.fat * portionCount).toFixed(2)} g</td>
                    </tr>))}
                {currentLogsSet && <tr className="summary-row">
                    <td>{language === LANGUAGE.english ? "Sum" : "Suma"}</td>
                    <td>{parseFloat(currentLogsSet.caloriesSum).toFixed(2)} kcal</td>
                    <td>{parseFloat(currentLogsSet.proteinSum).toFixed(2)} g</td>
                    <td>{parseFloat(currentLogsSet.carbsSum).toFixed(2)} g</td>
                    <td>{parseFloat(currentLogsSet.fatSum).toFixed(2)} g</td>
                </tr>}
            </tbody>
        </table>

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Diet" : "Dieta"}</h1>
                        <input name="mealName" placeholder={language === LANGUAGE.english ? "Find your meal..." : "Znajdź posiłek..."} onChange={this.handleOnChange} />
                    </div>
                    <section>
                        <h3>{language === LANGUAGE.english ? "Choose the meal you want to include in your daily diet:" : "Wybierz posiłek, który chcesz dodać do dziennego bilansu:"}</h3>
                        <div className="meal-container">
                            {mealsToDisplay && mealsToDisplay.map(({ id, name, namePL }, index) => (
                                index < itemCount &&
                                <div className="meal-card" key={id}>
                                    <h6>{(language === LANGUAGE.polish && namePL !== "") ? namePL : name}</h6>
                                    <a href="#modal"><button onClick={this.setMeal.bind(this, id)}>
                                        <i className="fas fa-plus"></i>
                                    </button></a>
                                </div>
                            ))}
                        </div>
                        {itemCount < mealsToDisplay.length && <div id="show-more">
                            <button onClick={this.incItemLimit}>{language === LANGUAGE.english ? "Show more" : "Pokaż więcej"}</button>
                        </div>}
                    </section>
                    { Object.keys(currentLogsSet).length !== 0 ? tableOfLogs : <div className="no-content">{language === LANGUAGE.english ? "No meal logs found!" : "Nie znaleziono zapisów z poprzednich dni!"}</div>}
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Adding" : "Dodawanie"} "{(language === LANGUAGE.polish && mealToAdd.namePL !== "") ? mealToAdd.namePL : mealToAdd.name}" {language === LANGUAGE.english ? "to your daily balance" : "do twojego dziennego bilansu"}</h2>
                            <div className="macro-summary">
                                <div className="macro-name">{language === LANGUAGE.english ? "Calories" : "Kalorie"}:</div>
                                <div className="macro-value">{(this.state.mealToAdd.calories * this.state.portionCount).toFixed(2)} kcal</div>
                                <div className="macro-name">{language === LANGUAGE.english ? "Protein" : "Białko"}:</div>
                                <div className="macro-value">{(this.state.mealToAdd.protein * this.state.portionCount).toFixed(2)} g</div>
                                <div className="macro-name">{language === LANGUAGE.english ? "Carbs" : "Węglowodany"}:</div>
                                <div className="macro-value">{(this.state.mealToAdd.carbs * this.state.portionCount).toFixed(2)} g</div>
                                <div className="macro-name">{language === LANGUAGE.english ? "Fat" : "Tłuszcze"}:</div>
                                <div className="macro-value">{(this.state.mealToAdd.fat * this.state.portionCount).toFixed(2)} g</div>
                                <div className="macro-name" style={{ marginTop: "4px" }}>{language === LANGUAGE.english ? "Portion" : "Porcja"}:</div>
                                <div className="macro-portion">
                                    <div className="macro-value">{this.state.mealToAdd.portionWeight} g x</div>
                                    <input type="number" name="portionCount" min="0.5" step="0.5" value={this.state.portionCount} onChange={this.handleOnChangePortionCount} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Submit" : "Zapisz"} onClick={this.addMealLog} disabled={this.portionCount > 0} />
                            <a href="# ">
                                <button className="secondary-btn">{language === LANGUAGE.english ? "Cancel" : "Anuluj"}</button>
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Diet;
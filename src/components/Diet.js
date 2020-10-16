import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import transformDate from "../Helpers";
import { LANGUAGE } from "../constants";

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
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.onChangePortionCount = this.onChangePortionCount.bind(this);
        this.addMealLog = this.addMealLog.bind(this);
        this.incLogSetIndex = this.incLogSetIndex.bind(this);
        this.decLogSetIndex = this.decLogSetIndex.bind(this);
        this.incItemLimit = this.incItemLimit.bind(this);
    }

    onChange(element) {
        let newArray = [];
        if(element.target.name === "mealName" && element.target.value !== "") {
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

    onChangePortionCount(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    setMeal(index) {
        this.setState({
            mealToAdd: this.state.meals[index]
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
        axios.get("api/meals")
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
                    if(response.data !== "") {
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

    render() {
        let { mealsToDisplay, currentLogsSet, itemCount, isLoaded, errorStatusCode, errorMessage } = this.state;
        let language = sessionStorage.getItem("language");

        let tableOfLogs = <table className="diet">
            <thead>
                <tr>
                    <th className="light-blue" colSpan="1">
                        { this.state.mealLogsSet.length > 1 && 
                            <button className="handleLogSet" onClick={this.decLogSetIndex} style={{"float":"right", "background": "transparent"}}><i className="fas fa-arrow-left"></i></button> }
                    </th>
                    { currentLogsSet.date && <th className="light-blue" colSpan="3">{transformDate(currentLogsSet.date)}</th>}
                    <th className="light-blue" colSpan="1">
                        { this.state.mealLogsSet.length > 1 && 
                            <button className="handleLogSet" onClick={this.incLogSetIndex}style={{"float":"left", "background": "transparent"}}><i className="fas fa-arrow-right"></i></button> }
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
                { currentLogsSet.mealLogs && currentLogsSet.mealLogs.map((log, index, i) => (
                    <tr key={log.id}>
                        <td key={++index}>{log.referredMeal.name}</td>
                        <td key={++index}>{(log.referredMeal.calories * log.portionCount).toFixed(2)} kcal</td>
                        <td key={++index}>{(log.referredMeal.protein * log.portionCount).toFixed(2)} g</td>
                        <td key={++index}>{(log.referredMeal.carbs * log.portionCount).toFixed(2)} g</td>
                        <td key={++index}>{(log.referredMeal.fat * log.portionCount).toFixed(2)} g</td>
                    </tr>))}
                { currentLogsSet && <tr className="summary-row">
                    <td>{language === LANGUAGE.english ? "Sum" : "Suma"}</td>
                    <td>{parseFloat(currentLogsSet.caloriesSum).toFixed(2)} kcal</td>
                    <td>{parseFloat(currentLogsSet.proteinSum).toFixed(2)} g</td>
                    <td>{parseFloat(currentLogsSet.carbsSum).toFixed(2)} g</td>
                    <td>{parseFloat(currentLogsSet.fatSum).toFixed(2)} g</td>
                </tr>}
            </tbody>
        </table>

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Diet" : "Dieta"}</h1>
                        <input name="mealName" placeholder={language === LANGUAGE.english ? "Find your meal..." : "Znajdź posiłek..."} onChange={this.onChange} />
                    </div>
                    <section>
                        <h3>{language === LANGUAGE.english ? "Choose the meal you want to include in your daily diet:" : "Wybierz posiłek, który chcesz dodać do dziennego bilansu:"}</h3>
                        <div className="meal-container">
                            {mealsToDisplay && mealsToDisplay.map((meal, index) => (
                                index < itemCount &&
                                <div className="meal-card" key={meal.id}>
                                    <h6 >{meal.name}</h6>
                                    <a href="#modal"><button onClick={this.setMeal.bind(this, index)}>
                                        <i className="fas fa-plus"></i>
                                    </button></a>
                                </div>
                            ))}
                        </div>
                        {itemCount < mealsToDisplay.length && <div id="show-more">
                            <button onClick={this.incItemLimit}>{language === LANGUAGE.english ? "Show more" : "Pokaż więcej"}</button>
                            </div> }
                    </section>
                    { Object.keys(currentLogsSet).length !== 0 ? tableOfLogs : <div className="no-content">{language === LANGUAGE.english ? "No meal logs found!" : "Nie znaleziono zapisów z poprzednich dni!"}</div> }
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Adding" : "Dodawanie"} "{this.state.mealToAdd.name}" {language === LANGUAGE.english ? "to your daily balance" : "do twojego dziennego bilansu"}</h2>
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
                                    <input type="number" name="portionCount" min="0.5" step="0.5" value={this.state.portionCount} onChange={this.onChangePortionCount} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" value={language === LANGUAGE.english ? "Submit" : "Zapisz"} onClick={this.addMealLog} disabled={this.portionCount > 0} />
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
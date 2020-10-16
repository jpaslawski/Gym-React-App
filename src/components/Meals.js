import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import { LANGUAGE, LAYOUT_PREFERENCE } from "../constants";
import MealTable from "./tables/MealTable";
import MealCardGroup from "./cardGroup/MealCardGroup";

class Meals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            calories: undefined,
            protein: undefined,
            carbs: undefined,
            fat: undefined,
            portionWeight: undefined,
            meals: [],
            mealId: undefined,
            selectedMeal: {},
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
            createOrUpdate: undefined
        };

        this.createOrUpdateMeal = this.createOrUpdateMeal.bind(this);
        this.deleteMeal = this.deleteMeal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setCreateMode = this.setCreateMode.bind(this);
        this.setUpdateMode = this.setUpdateMode.bind(this);
        this.selectMeal = this.selectMeal.bind(this);
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    setCreateMode() {
        this.setState({
            createOrUpdate: "create",
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            portionWeight: ""
        });
    }

    setUpdateMode(name, calories, protein, carbs, fat, portionWeight, mealId) {
        this.setState({
            createOrUpdate: "update",
            name: name,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            portionWeight: portionWeight,
            mealId: mealId
        });
    }

    createOrUpdateMeal() {
        let { history } = this.props;
        const mealData = {
            name: this.state.name,
            calories: this.state.calories,
            protein: this.state.protein,
            carbs: this.state.carbs,
            fat: this.state.fat,
            portionWeight: this.state.portionWeight
        }

        if (this.state.createOrUpdate === "create") {
            axios.post("api/meals", mealData)
                .then(response => {
                    this.setState({
                        errorMessage: ""
                    })
                    history.push("meals");
                    window.location.reload();
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Ups! Something went wrong..."
                    })
                });
        }
        else if (this.state.createOrUpdate === "update") {
            axios.put("api/meals/" + this.state.mealId, mealData)
                .then(response => {
                    this.setState({
                        errorMessage: ""
                    })
                    history.push("meals");
                    window.location.reload();
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Ups! Something went wrong..."
                    })
                });
        }
    }

    selectMeal(mealId) {
        this.setState({
            selectedMeal: mealId
        });
    }

    deleteMeal() {
        let { history } = this.props;

        axios.delete("api/meals/" + this.state.selectedMeal.id)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                history.push("meals");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    componentDidMount() {
        axios.get("api/meals")
            .then(response => this.setState({
                meals: response.data,
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
        let { name, calories, protein, carbs, fat, portionWeight, meals, isLoaded, errorStatusCode, errorMessage } = this.state;

        const language = sessionStorage.getItem("language");
        const layoutPreference = sessionStorage.getItem("layoutPreference");

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content meal">
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Meals" : "Posiłki"}</h1>
                    </div>
                    { layoutPreference === LAYOUT_PREFERENCE.table ? (
                        <MealTable
                            meals={meals}
                            setUpdateMode={this.setUpdateMode}
                            selectMeal={this.selectMeal} />
                    ) : (
                        <MealCardGroup
                            meals={meals}
                            setUpdateMode={this.setUpdateMode}
                            selectMeal={this.selectMeal} />
                    )}
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{this.state.createOrUpdate === "create" ? `${language === LANGUAGE.english ? "Add a new meal!" : "Dodaj nowy posiłek!"}` : `${language === LANGUAGE.english ? "Update the information about this meal!" : "Aktualizuj szczegóły dotyczące tego posiłku!"}`}</h2>
                            <div className={`inputs email ${name ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-apple-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Meal Name" : "Nazwa posiłku"}</h5>
                                    <input type="text" name="name" value={name || ""} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${calories ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Calories" : "Kalorie"} [kcal]</h5>
                                    <input type="number" name="calories" value={calories || ""} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${protein ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Protein" : "Białko"} [g]</h5>
                                    <input type="number" name="protein" value={protein || ""} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${carbs ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Carbs" : "Węglowodany"} [g]</h5>
                                    <input type="number" name="carbs" value={carbs || ""} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${fat ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Fat" : "Tłuszcze"} [g]</h5>
                                    <input type="number" name="fat" value={fat || ""} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${portionWeight ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Portion Weight" : "Waga Porcji"} [g]</h5>
                                    <input type="number" name="portionWeight" value={portionWeight || ""} onChange={this.onChange} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value={language === LANGUAGE.english ? "Submit" : "Zapisz"} onClick={this.createOrUpdateMeal}
                                disabled={name && calories && protein && carbs && fat && portionWeight ? "" : "disabled"} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Are you sure that you want to delete" : "Czy napewno chcesz usunąć"} "{this.state.selectedMeal.name}"?</h2>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value={language === LANGUAGE.english ? "Delete" : "Usuń"} onClick={this.deleteMeal} />
                            <a href="# "><input type="button" className="secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <a href="#modal">
                        <button className="add-btn" onClick={this.setCreateMode}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </a>
                </div>
            );
        }
    }
}

export default Meals;
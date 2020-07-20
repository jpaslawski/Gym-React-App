import React, { Component } from "react";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Error from "../Error";

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
                    history.push("/meals");
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
                    history.push("/meals");
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
                history.push("/meals");
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
        let { name, calories, protein, carbs, fat, portionWeight, isLoaded, errorStatusCode, errorMessage } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content meal">
                    <div className="pageLabel">
                        <h1>Meals</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Calories</th>
                                <th>Protein</th>
                                <th>Carbs</th>
                                <th>Fat</th>
                                <th>Portion Weight</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.meals && this.state.meals.map((meal, index) => (
                                <tr key={meal.uniqueId}>
                                    <td key={++index}>{meal.name}</td>
                                    <td key={++index}>{meal.calories} kcal</td>
                                    <td key={++index}>{meal.protein} g</td>
                                    <td key={++index}>{meal.carbs} g</td>
                                    <td key={++index}>{meal.fat} g</td>
                                    <td key={++index}>{meal.portionWeight} g</td>
                                    <td key={++index} className="action-group">
                                        <a href="#modal">
                                            <button className="update-btn" onClick={this.setUpdateMode.bind(this, meal.name, meal.calories, meal.protein, meal.carbs, meal.fat, meal.portionWeight, meal.id)}>
                                                <i className="fas fa-pen" title="Edit"></i>
                                            </button>
                                        </a>
                                        <a href="#modal-delete">
                                            <button className="error-btn" onClick={this.selectMeal.bind(this, meal)}>
                                                <i className="fas fa-times" title="Delete"></i>
                                            </button>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="#">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{this.state.createOrUpdate === "create" ? "Add a new meal!" : "Update the information about this meal!"}</h2>
                            <div className={`inputs email ${name ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-apple-alt"></i>
                                </div>
                                <div>
                                    <h5>Meal Name</h5>
                                    <input type="text" name="name" value={name} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${calories ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Calories [kcal]</h5>
                                    <input type="number" name="calories" value={calories} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${protein ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Protein [g]</h5>
                                    <input type="number" name="protein" value={protein} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${carbs ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Carbs [g]</h5>
                                    <input type="number" name="carbs" value={carbs} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${fat ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Fat [g]</h5>
                                    <input type="number" name="fat" value={fat} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${portionWeight ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <div>
                                    <h5>Portion Weight [g]</h5>
                                    <input type="number" name="portionWeight" value={portionWeight} onChange={this.onChange} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value="Submit" onClick={this.createOrUpdateMeal}
                                disabled={name && calories && protein && carbs && fat && portionWeight ? "" : "disabled"} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="#">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>Delete {this.state.selectedMeal.name}?</h2>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value="Delete" onClick={this.deleteMeal} />
                            <a href="#"><input type="button" className="secondary-btn" value="Cancel" /></a>
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
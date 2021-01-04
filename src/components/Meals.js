import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import { LANGUAGE, LAYOUT_PREFERENCE } from "../constants";
import MealTable from "./tables/MealTable";
import MealCardGroup from "./cardGroup/MealCardGroup";
import { Redirect } from "react-router";

class Meals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            namePL: "",
            calories: undefined,
            protein: undefined,
            carbs: undefined,
            fat: undefined,
            portionWeight: undefined,
            meals: [],
            publicMeals: [],
            pendingMeals: [],
            userMeals: [],
            mealId: undefined,
            selectedMeal: {},
            selectedItem: undefined,
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
            createOrUpdate: undefined
        };

        this.createOrUpdateMeal = this.createOrUpdateMeal.bind(this);
        this.deleteMeal = this.deleteMeal.bind(this);
        this.shareMeal = this.shareMeal.bind(this);
        this.manageMeal = this.manageMeal.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.setCreateMode = this.setCreateMode.bind(this);
        this.setUpdateMode = this.setUpdateMode.bind(this);
        this.selectMeal = this.selectMeal.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    setCreateMode() {
        this.setState({
            createOrUpdate: "create",
            name: "",
            namePL: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            portionWeight: ""
        });
    }

    setUpdateMode(name, namePL, calories, protein, carbs, fat, portionWeight, mealId) {
        this.setState({
            createOrUpdate: "update",
            name: name,
            namePL: namePL,
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
            namePL: this.state.namePL,
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

    selectMeal(meal) {
        this.setState({
            selectedMeal: meal
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

    shareMeal() {
        let { history } = this.props;

        axios.put("api/meals/" + this.state.selectedMeal.id + "/share")
            .then(response => {
                this.setState({
                    errorMessage: "",
                    selectedMeal: {}
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

    manageMeal(action) {
        let { history } = this.props;

        axios.put("api/admin/meals/" + this.state.selectedMeal.id + "/" + action)
            .then(response => {
                this.setState({
                    errorMessage: "",
                    selectedMeal: {}
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

    setPublicMeals() {
        this.setState({
            meals: this.state.publicMeals,
            selectedItem: "public"
        })
    }

    setPendingMeals() {
        this.setState({
            meals: this.state.pendingMeals,
            selectedItem: "pending"
        })
    }

    setUserMeals() {
        this.setState({
            meals: this.state.userMeals,
            selectedItem: "user"
        })
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        } else {
            axios.get("api/meals/public")
                .then(response => this.setState({
                    publicMeals: response.data !== "" ? response.data : [],
                    meals: response.data !== "" ? response.data : [],
                    selectedItem: "public",
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

            axios.get("api/meals")
                .then(response => this.setState({
                    userMeals: response.data !== "" ? response.data : []
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

            axios.get("api/admin/meals/pending")
                .then(response => this.setState({
                    pendingMeals: response.data !== "" ? response.data : []
                }))
                .catch(error => {
                    if (!error.response) {
                        this.setState({
                            errorStatusCode: 522,
                            errorMessage: "Connection lost!"
                        })
                    } else if (error.response.status === 400) {
                        this.setState({
                            pendingMeals: [],
                            isLoaded: true
                        })
                    } else {
                        this.setState({
                            errorStatusCode: error.response.status,
                            errorMessage: error.response.statusText
                        })
                    }
                });
        }
    }

    render() {
        let { name, namePL, calories, protein, carbs, fat, portionWeight, meals, selectedMeal, isLoaded, errorStatusCode, errorMessage } = this.state;

        const language = sessionStorage.getItem("language");
        const layoutPreference = sessionStorage.getItem("layoutPreference");

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content meal">
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
                                    <h5>{language === LANGUAGE.english ? "Meal Name" : "Nazwa posiłku"} (EN)*</h5>
                                    <input type="text" name="name" value={name || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${namePL ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-apple-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Meal Name" : "Nazwa posiłku"} (PL)</h5>
                                    <input type="text" name="namePL" value={namePL || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${calories ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Calories" : "Kalorie"} [kcal]*</h5>
                                    <input type="number" name="calories" value={calories || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${protein ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Protein" : "Białko"} [g]*</h5>
                                    <input type="number" name="protein" value={protein || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${carbs ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Carbs" : "Węglowodany"} [g]*</h5>
                                    <input type="number" name="carbs" value={carbs || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${fat ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Fat" : "Tłuszcze"} [g]*</h5>
                                    <input type="number" name="fat" value={fat || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${portionWeight ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Portion Weight" : "Waga Porcji"} [g]*</h5>
                                    <input type="number" name="portionWeight" value={portionWeight || ""} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Submit" : "Zapisz"} onClick={this.createOrUpdateMeal}
                                disabled={name && calories && protein && carbs && fat && portionWeight ? "" : "disabled"} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>{language === LANGUAGE.english ? "Are you sure that you want to delete" : "Czy napewno chcesz usunąć"} "{selectedMeal.name}"?</h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn error-btn" value={language === LANGUAGE.english ? "Delete" : "Usuń"} onClick={this.deleteMeal} />
                            <a href="# "><input type="button" className="secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="modal-share">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>{language === LANGUAGE.english ?
                                "You are now sharing this meal to the users of GymApp. An admin will review it and if it will be necessary, he will edit it. From now on, you can't edit this meal!" :
                                "Udostępniasz ten posiłek wszystkim użytkownikom GymApp. Administrator sprawdzi go i jeśli zajdzie taka potrzeba, naniesie poprawki. Od teraz nie będziesz miał możliwości edytować tego posiłku!"}
                            </h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Share" : "Udostępnij"} onClick={this.shareMeal} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="modal-manage">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-apple-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Meal Name" : "Nazwa posiłku"} (EN)*</h5>
                                    <input type="text" value={selectedMeal.name} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-apple-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Meal Name" : "Nazwa posiłku"} (PL)</h5>
                                    <input type="text" value={selectedMeal.namePL} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Calories" : "Kalorie"} [kcal]*</h5>
                                    <input type="number" value={selectedMeal.calories} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Protein" : "Białko"} [g]*</h5>
                                    <input type="number" value={selectedMeal.protein} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Carbs" : "Węglowodany"} [g]*</h5>
                                    <input type="number" value={selectedMeal.carbs} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Fat" : "Tłuszcze"} [g]*</h5>
                                    <input type="number" value={selectedMeal.fat} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Portion Weight" : "Waga Porcji"} [g]*</h5>
                                    <input type="number" value={selectedMeal.portionWeight} disabled />
                                </div>
                            </div>
                            <input type="button" className="update-btn" value={language === LANGUAGE.english ? "Accept" : "Zatwierdź"} onClick={this.manageMeal.bind(this, "accept")} />
                            <input type="button" className="error-btn" value={language === LANGUAGE.english ? "Deny" : "Odmów"} onClick={this.manageMeal.bind(this, "deny")} />
                        </div>
                    </div>
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Meals" : "Posiłki"}</h1>
                        <h3 className={this.state.selectedItem === "public" ? "active" : ""} onClick={this.setPublicMeals.bind(this)}>
                            <i className="fas fa-share-alt"></i><span>{language === LANGUAGE.english ? "Shared" : "Udostępnione"}</span>
                        </h3>
                        <h3 className={this.state.selectedItem === "pending" ? "active" : ""} onClick={this.setPendingMeals.bind(this)}>
                            <i className="fas fa-clock"></i><span>{language === LANGUAGE.english ? "Pending" : "Do zatwierdzenia"}</span>
                        </h3>

                        <h3 className={this.state.selectedItem === "user" ? "active" : ""} onClick={this.setUserMeals.bind(this)}>
                            <i className="fas fa-user-circle"></i><span>{language === LANGUAGE.english ? "My" : "Moje"}</span>
                        </h3>
                    </div>
                    { layoutPreference === LAYOUT_PREFERENCE.table ? (
                        <MealTable
                            meals={meals}
                            selectedItem={this.state.selectedItem}
                            setUpdateMode={this.setUpdateMode}
                            selectMeal={this.selectMeal} />
                    ) : (
                            <MealCardGroup
                                meals={meals}
                                setUpdateMode={this.setUpdateMode}
                                selectMeal={this.selectMeal} />
                        )}
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
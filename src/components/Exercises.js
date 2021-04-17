import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import NewExerciseToWorkout from "./NewExerciseToWorkout";
import { LANGUAGE, LAYOUT_PREFERENCE } from "../constants";
import ExerciseTable from "./tables/ExerciseTable";
import { extractCategory } from "../Helpers";
import ExerciseCardGroup from "./cardGroup/ExerciseCardGroup";
import { Redirect } from "react-router";

class Exercises extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            info: "",
            category: "",
            exercises: [],
            userExercises: [],
            publicExercises: [],
            pendingExercises: [],
            displayedExercises: [],
            selectedItem: "",
            selectedExercise: {},
            categories: [],
            checkedCategories: [],
            exerciseId: undefined,
            isLoaded: false,
            redirect: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnChangeCheckBox = this.handleOnChangeCheckBox.bind(this);
        this.setUpdateMode = this.setUpdateMode.bind(this);
        this.selectExercise = this.selectExercise.bind(this);
        this.updateExercise = this.updateExercise.bind(this);
        this.deleteExercise = this.deleteExercise.bind(this);
        this.shareExercise = this.shareExercise.bind(this);
        this.manageExercise = this.manageExercise.bind(this);
    }


    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    handleOnChangeCheckBox(element) {
        let { checkedCategories, exercises } = this.state;
        let displayedExercises = [];
        if (checkedCategories.includes(element.target.name)) {
            let index = checkedCategories.indexOf(element.target.name);
            if (index >= 0) {
                checkedCategories.splice(index, 1);
            }
        } else {
            checkedCategories = checkedCategories.concat(element.target.name);
        }

        for (let i = 0; i < exercises.length; i++) {
            if (checkedCategories.includes(extractCategory(exercises[i].exerciseCategory))) {
                displayedExercises = displayedExercises.concat(exercises[i]);
            }
        }

        if (checkedCategories.length < 1) {
            displayedExercises = this.state.exercises;
        }

        this.setState({
            checkedCategories: checkedCategories,
            displayedExercises: displayedExercises
        })
    }

    handleOnChangeTextarea = (element) => {
        this.setState({
            [element.target.name]: element.target.value,
            customHeight: this.multilineTextarea.scrollHeight
        });
        this.multilineTextarea.style.height = 'auto';
        this.multilineTextarea.style.height = this.multilineTextarea.scrollHeight + 'px';
    }

    redirectToDetails(exerciseId) {
        this.props.history.push("/exercises/" + exerciseId);
        window.location.reload();
    }

    setUpdateMode(name, info, category, exerciseId) {
        this.setState({
            name: name,
            info: info,
            category: category,
            exerciseId: exerciseId.toString()
        });
    }

    setPublicExercises() {
        this.setState({
            exercises: this.state.publicExercises,
            displayedExercises: this.state.publicExercises,
            selectedItem: "public"
        })
    }

    setPendingExercises() {
        this.setState({
            exercises: this.state.pendingExercises,
            displayedExercises: this.state.pendingExercises,
            selectedItem: "pending"
        })
    }

    setUserExercises() {
        this.setState({
            exercises: this.state.userExercises,
            displayedExercises: this.state.userExercises,
            selectedItem: "user"
        })
    }

    selectExercise(exerciseId) {
        let exerciseToSelect = this.state.exercises.find(exercise => {
            return exercise.id === exerciseId
        });

        this.setState({
            exerciseId: exerciseId,
            selectedExercise: exerciseToSelect
        });
    }

    updateExercise() {
        const exerciseData = {
            name: this.state.name,
            info: this.state.info,
            category: this.state.category
        }

        axios.put("api/exercises/" + this.state.exerciseId, exerciseData)
            .then(response => {
                this.props.history.push("exercises");
                window.location.reload();
                this.setState({
                    errorMessage: "",
                    exerciseId: undefined,
                    selectedExercise: {}
                })
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    deleteExercise() {
        let { history } = this.props;

        axios.delete("api/exercises/" + this.state.exerciseId)
            .then(response => {
                history.push("exercises");
                window.location.reload();
                this.setState({
                    errorMessage: "",
                    exerciseId: undefined,
                    selectedExercise: {}
                })
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    shareExercise() {
        let { history } = this.props;

        axios.put("api/exercises/" + this.state.exerciseId + "/share")
            .then(response => {
                this.setState({
                    errorMessage: "",
                    exerciseId: undefined,
                    selectedExercise: {}
                })
                history.push("exercises");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    manageExercise(action) {
        let { history } = this.props;

        axios.put("api/admin/exercises/" + this.state.exerciseId + "/" + action)
            .then(response => {
                this.setState({
                    errorMessage: "",
                    exerciseId: undefined,
                    selectedExercise: {}
                })
                history.push("exercises");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        } else {
            axios.get("api/exercises")
                .then(response => this.setState({
                    userExercises: response.data !== "" ? response.data : []
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

            axios.get("api/exercises/pending")
                .then(response => this.setState({
                    pendingExercises: response.data !== "" ? response.data : []
                }))
                .catch(error => {
                    if (!error.response) {
                        this.setState({
                            errorStatusCode: 522,
                            errorMessage: "Connection lost!"
                        })
                    } else if (error.response.status === 400) {
                        this.setState({
                            pendingExercises: [],
                            isLoaded: true
                        })
                    } else {
                        this.setState({
                            errorStatusCode: error.response.status,
                            errorMessage: error.response.statusText
                        })
                    }
                });

            axios.get("api/exercises/public")
                .then(response => this.setState({
                    publicExercises: response.data !== "" ? response.data : [],
                    exercises: response.data !== "" ? response.data : [],
                    displayedExercises: response.data !== "" ? response.data : [],
                    selectedItem: "public"
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

            axios.get("api/categories")
                .then(response =>
                    this.setState({
                        categories: response.data !== "" ? response.data : [],
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
    }

    render() {

        let { name, info, category, displayedExercises, exerciseId, selectedExercise, isLoaded, errorStatusCode, errorMessage } = this.state;
        let { history } = this.props;
        const language = sessionStorage.getItem("language");
        const layoutPreference = sessionStorage.getItem("layoutPreference");

        if (this.state.redirect) {
            return (<Redirect to='sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className={`main-content ${language === LANGUAGE.english ? "exercise" : "exercise pl"}`}>
                    <div className="modal" id="filter">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <div className="filter-content">
                                <h4>{language === LANGUAGE.english ? "Category:" : "Kategoria:"}</h4>
                                <ul>
                                    {this.state.categories && this.state.categories.map((item, index) => (
                                        <li key={index++}>
                                            <label>{item.category}
                                                <input id={item.id} name={item.category} type="checkbox" onChange={this.handleOnChangeCheckBox} checked={this.state.checkedCategories.includes(item.category)} />
                                                <span className="check"></span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "New Exercise" : "Nowe ćwiczenie"}</h2>
                            <NewExerciseToWorkout />
                        </div>
                    </div>
                    <div className="modal" id="modal-edit">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Updating exercise details" : "Aktualizacja szczegółów ćwiczenia"}</h2>
                            <div className={`inputs email ${name ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-dumbbell"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Exercise Name" : "Nazwa ćwiczenia"}</h5>
                                    <input type="text" name="name" onChange={this.handleOnChange} value={name} />
                                </div>
                            </div>
                            <div className={`inputs email ${(info) ? "focus" : ""}`} style={{ "height": `${this.state.customHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Additional Info" : "Dodatkowe informacje"}</h5>
                                    <textarea type="text" name="info" value={info} onChange={this.handleOnChangeTextarea} ref={ref => this.multilineTextarea = ref} />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-project-diagram"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Category" : "Kategoria"}</h5>
                                    <select name="category" onChange={this.handleOnChange} value={category}>
                                        <option value="null">-</option>
                                        {this.state.categories && this.state.categories.map((item, index) => (
                                            <option key={index++}>{item.category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Update" : "Zapisz"} onClick={this.updateExercise} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>
                                {language === LANGUAGE.english ? "Are you sure that you want to delete exercise" : "Czy napewno chcesz usunąć ćwiczenie"} {exerciseId}?
                            </h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn error-btn" value={language === LANGUAGE.english ? "Delete" : "Usuń"} onClick={this.deleteExercise} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="modal-share">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>{language === LANGUAGE.english ?
                                "You are now sharing this exercise to the users of GymApp. An admin will review it and if it will be necessary, he will edit it. From now on, you can't edit this exercise!" :
                                "Udostępniasz to ćwiczenie wszystkim użytkownikom GymApp. Administrator sprawdzi go i jeśli zajdzie taka potrzeba, naniesie poprawki. Od teraz nie będziesz miał możliwości edytować tego ćwiczenia!"}
                            </h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Share" : "Udostępnij"} onClick={this.shareExercise} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="modal-manage">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>English Version</h3>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>Exercise Name</h5>
                                    <input type="text" value={selectedExercise.name} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus" style={{ "height": `${this.state.infoHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Additional Info</h5>
                                    <textarea type="text" value={selectedExercise.info ? selectedExercise.info : "-"} disabled />
                                </div>
                            </div>
                            <h3>Polska Wersja</h3>

                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>Nazwa ćwiczenia</h5>
                                    <input type="text" value={selectedExercise.namePL} disabled />
                                </div>
                            </div>

                            <div className="inputs email focus" style={{ "height": `${this.state.infoPLHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Dodatkowe informacje</h5>
                                    <textarea type="text" value={selectedExercise.infoPL ? selectedExercise.infoPL : "-"} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Category" : "Kategoria"}</h5>
                                    <input type="text" value={extractCategory(selectedExercise.exerciseCategory)} disabled />
                                </div>
                            </div>
                            <input type="button" className="update-btn" value={language === LANGUAGE.english ? "Accept" : "Zatwierdź"} onClick={this.manageExercise.bind(this, "accept")} />
                            <input type="button" className="error-btn" value={language === LANGUAGE.english ? "Deny" : "Odmów"} onClick={this.manageExercise.bind(this, "deny")} />
                        </div>
                    </div>
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Exercises" : "Ćwiczenia"}</h1>
                        <h3 className={this.state.selectedItem === "public" ? "active" : ""} onClick={this.setPublicExercises.bind(this)}>
                            <i className="fas fa-share-alt"></i><span>{language === LANGUAGE.english ? "Shared" : "Udostępnione"}</span>
                        </h3>
                        <h3 className={this.state.selectedItem === "pending" ? "active" : ""} onClick={this.setPendingExercises.bind(this)}>
                            <i className="fas fa-clock"></i><span>{language === LANGUAGE.english ? "Pending" : "Do zatwierdzenia"}</span>
                        </h3>
                        <h3 className={this.state.selectedItem === "user" ? "active" : ""} onClick={this.setUserExercises.bind(this)}>
                            <i className="fas fa-user-circle"></i><span>{language === LANGUAGE.english ? "My" : "Moje"}</span>
                        </h3>
                    </div>
                    <div className="table-with-filter">
                        <div className="table-content">
                            {layoutPreference === LAYOUT_PREFERENCE.table ? (
                                <ExerciseTable
                                    exercises={displayedExercises}
                                    history={history}
                                    setUpdateMode={this.setUpdateMode}
                                    selectExercise={this.selectExercise} />
                            ) : (
                                    <ExerciseCardGroup
                                        exercises={displayedExercises}
                                        history={history}
                                        setUpdateMode={this.setUpdateMode}
                                        selectExercise={this.selectExercise} />
                                )}
                        </div>
                        <div className="filter">
                            <div className="filter-title">{language === LANGUAGE.english ? "Filters" : "Filtry"}</div>
                            <div className="filter-content">
                                <h4>{language === LANGUAGE.english ? "Category:" : "Kategoria:"}</h4>
                                <ul>
                                    {this.state.categories && this.state.categories.map(({ id, category, categoryPL }) => (
                                        <li key={id}>
                                            <label>{(language === LANGUAGE.polish && categoryPL !== "") ? categoryPL : category}
                                                <input id={id} name={category} type="checkbox" onChange={this.handleOnChangeCheckBox} checked={this.state.checkedCategories.includes(category)} />
                                                <span className="check"></span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <a href="#modal">
                            <button className="add-btn"><i className="fas fa-plus"></i></button>
                        </a>
                        <a href="#filter">
                            <button className="filter-btn">{language === LANGUAGE.english ? "Filters" : "Filtry"}</button>
                        </a>
                    </div>
                </div>
            );
        }
    }
}

export default Exercises;
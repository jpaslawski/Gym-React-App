import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import NewExerciseToWorkout from "./NewExerciseToWorkout";

class Exercises extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            info: "",
            category: "",
            exercises: [],
            displayedExercises: [],
            isLoaded: false,
            categories: [],
            checkedCategories: [],
            exerciseId: undefined,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
        this.updateExercise = this.updateExercise.bind(this);
        this.deleteExercise = this.deleteExercise.bind(this);
        this.selectExercise = this.selectExercise.bind(this);
    }

    extractCategory(object) {
        if (object == null) {
            return "-";
        }
        let json = JSON.stringify(object);
        return JSON.parse(json).category;
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    onChangeCheckBox(element) {
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
            if (checkedCategories.includes(this.extractCategory(exercises[i].exerciseCategory))) {
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

    changeTextarea = (element) => {
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
            exerciseId: exerciseId
        });
    }

    selectExercise(exerciseId) {
        this.setState({
            exerciseId: exerciseId
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
            this.setState({
                errorMessage: ""
            })
            this.props.history.push("exercises");
            window.location.reload();
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
                this.setState({
                    errorMessage: ""
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
        axios.get("api/exercises")
            .then(response => this.setState({
                exercises: response.data,
                displayedExercises: response.data
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
                    categories: response.data,
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

        let { name, info, category, isLoaded, errorStatusCode, errorMessage } = this.state;
        let language = sessionStorage.getItem("language");

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content exercise">
                    <div className="pageLabel">
                        <h1>{language === "EN" ? "Exercises" : "Ćwiczenia"}</h1>
                    </div>
                    <div className="table-with-filter">
                        <div className="table-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{language === "EN" ? "Exercise name" : "Nazwa ćwiczenia"}</th>
                                        <th>{language === "EN" ? "Additional Information" : "Dodatkowe informacje"}</th>
                                        <th>{language === "EN" ? "Category" : "Kategoria"}</th>
                                        <th>{language === "EN" ? "Actions" : "Działania"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.displayedExercises && this.state.displayedExercises.map((exercise) => (
                                        <tr key={exercise.id}>
                                            <td key={exercise.uniqueId}>{exercise.name}</td>
                                            <td key={exercise.uniqueId} className="info-column">{exercise.info}</td>
                                            <td key={exercise.uniqueId}>
                                                {this.extractCategory(exercise.exerciseCategory)}
                                            </td>
                                            <td key={exercise.uniqueId}>
                                                <button className="details-btn" onClick={this.redirectToDetails.bind(this, exercise.id)}><i className="fas fa-info" title={language === "EN" ? "Details" : "Szczegóły"}></i></button>
                                                {sessionStorage.getItem('role') === "ROLE_ADMIN" && <a href="#modal-edit">
                                                    <button className="update-btn" onClick={this.setUpdateMode.bind(this, exercise.name, exercise.info, this.extractCategory(exercise.exerciseCategory), exercise.id)}>
                                                        <i className="fas fa-pen" title={language === "EN" ? "Edit" : "Aktualizuj"}></i>
                                                    </button>
                                                </a>}
                                                {sessionStorage.getItem('role') === "ROLE_ADMIN" && <a href="#modal-delete">
                                                    <button className="error-btn" onClick={this.selectExercise.bind(this, exercise.id)}>
                                                        <i className="fas fa-times" title={language === "EN" ? "Delete" : "Usuń"}></i>
                                                    </button>
                                                </a>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="filter">
                            <div className="filter-title">{language === "EN" ? "Filters" : "Filtry"}</div>
                            <div className="filter-content">
                                <h4>{language === "EN" ? "Category:" : "Kategoria:"}</h4>
                                <ul>
                                    {this.state.categories && this.state.categories.map((item, index) => (
                                        <li key={index++}>
                                            <label>{item.category}
                                                <input id={item.id} name={item.category} type="checkbox" onChange={this.onChangeCheckBox} checked={this.state.checkedCategories.includes(item.category)} />
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
                            <button className="filter-btn">{language === "EN" ? "Filters" : "Filtry"}</button>
                        </a>
                    </div>
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "New Exercise" : "Nowe ćwiczenie"}</h2>
                            <NewExerciseToWorkout />
                        </div>
                    </div>
                    <div className="modal" id="modal-edit">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "Updating exercise details" : "Aktualizacja szczegółów ćwiczenia"}</h2>
                            <div className={`inputs email ${name ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-dumbbell"></i>
                                </div>
                                <div>
                                    <h5>{language === "EN" ? "Exercise Name" : "Nazwa ćwiczenia"}</h5>
                                    <input type="text" name="name" onChange={this.onChange} value={name} />
                                </div>
                            </div>
                            <div className={`inputs email ${(info) ? "focus" : ""}`} style={{ "height": `${this.state.customHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === "EN" ? "Additional Info" : "Dodatkowe informacje"}</h5>
                                    <textarea type="text" name="info" value={info} onChange={this.changeTextarea} ref={ref => this.multilineTextarea = ref} />
                                </div>
                            </div>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-project-diagram"></i>
                                </div>
                                <div>
                                    <h5>{language === "EN" ? "Category" : "Kategoria"}</h5>
                                    <select name="category" onChange={this.onChange} value={category}>
                                        <option value="null">-</option>
                                        {this.state.categories && this.state.categories.map((item, index) => (
                                            <option key={index++}>{item.category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value={language === "EN" ? "Update" : "Zapisz"} onClick={this.updateExercise} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "Are you sure that you want to delete exercise" : "Czy napewno chcesz usunąć ćwiczenie"} {this.state.exerciseId}?</h2>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value={language === "EN" ? "Delete" : "Usuń"} onClick={this.deleteExercise} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === "EN" ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="filter">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <div className="filter-content">
                                <h4>{language === "EN" ? "Category:" : "Kategoria:"}</h4>
                                <ul>
                                    {this.state.categories && this.state.categories.map((item, index) => (
                                        <li key={index++}>
                                            <label>{item.category}
                                                <input id={item.id} name={item.category} type="checkbox" onChange={this.onChangeCheckBox} checked={this.state.checkedCategories.includes(item.category)} />
                                                <span className="check"></span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Exercises;
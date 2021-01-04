import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import Error from "../Error";
import NewExerciseToWorkout from "./NewExerciseToWorkout";
import ExistingExerciseToWorkout from "./ExistingExerciseToWorkout";
import { LANGUAGE, STATUS, USER_ROLE } from "../constants";
import { Redirect } from "react-router";

class WorkoutDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            workoutId: this.props.match.params.workoutId,
            workout: [],
            exercises: [],
            newExercise: false,
            existingExercise: false,
            categoryEx: undefined,
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.setNewState = this.setNewState.bind(this);
        this.setExistingState = this.setExistingState.bind(this);
    }

    redirectToExerciseDetails(exerciseId) {
        this.props.history.push("/exercises/" + exerciseId);
        window.location.reload();
    }

    extractCategory(object) {
        if (object == null) {
            return "-";
        }
        let json = JSON.stringify(object);
        return JSON.parse(json).category;
    }

    deleteExerciseFromWorkout(exerciseId) {
        axios.delete("api/exercises/" + exerciseId + "/" + this.state.workoutId)
            .then(response => {
                console.log(response.data);
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
                console.log(error.response.data);
            });
    }

    setNewState() {
        this.setState({
            newExercise: !this.state.newExercise,
            existingExercise: false
        })
    }

    setExistingState() {
        this.setState({
            newExercise: false,
            existingExercise: !this.state.existingExercise
        })
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        } else {
            axios.get("api/workouts/" + this.state.workoutId)
                .then(response =>
                    this.setState({
                        workout: response.data,
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

            axios.get("api/exercises?workoutId=" + this.state.workoutId)
                .then(response =>
                    this.setState({
                        exercises: response.data,
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
        let { workout, exercises, isLoaded, errorStatusCode, newExercise, existingExercise, workoutId } = this.state;
        const language = sessionStorage.getItem("language");
        const userRole = sessionStorage.getItem("role");

        if (this.state.redirect) {
            return (<Redirect to='sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (

                <div className="main-content workout-details">
                    <h1>{workout.name}</h1>
                    <div className="card-container">
                        {exercises && exercises.map(({ id, name, namePL, info, infoPL, exerciseCategory }) => (
                            <div className="card" key={id}>
                                <div className="card-info">
                                    <h4 className="category">{(language === LANGUAGE.polish && exerciseCategory.categoryPL !== "") ? exerciseCategory.categoryPL : exerciseCategory.category}</h4>
                                    <h4>{(language === LANGUAGE.polish && namePL !== "") ? namePL : name}</h4>
                                    <h5>{(language === LANGUAGE.polish && infoPL !== "") ? infoPL : info}</h5>
                                </div>
                                <div className="card-buttons">
                                    <button onClick={this.redirectToExerciseDetails.bind(this, id)}>{language === LANGUAGE.english ? "Logs" : "Wyniki"}</button>
                                    <button className="error-btn" onClick={this.deleteExerciseFromWorkout.bind(this, id)}>{language === LANGUAGE.english ? "Delete" : "Usuń"}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Choose one option" : "Wybierz opcję"}:</h2>
                            {/* New Exercise Section */}
                            <button className="modal-option" onClick={this.setNewState}>
                                <div>{language === LANGUAGE.english ? "Add a new Exercise" : "Dodaj nowe ćwiczenie"}</div><i className={`fas ${newExercise ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </button>
                            <div className="expandable">
                                <div className={`${newExercise ? "show" : "hide"}`}>
                                    <NewExerciseToWorkout workoutId={workoutId} />
                                </div>
                            </div>
                            {/* Existing Exercise Section */}
                            <button className="modal-option" onClick={this.setExistingState}>
                                <div>{language === LANGUAGE.english ? "Add an existing Exercise" : "Dodaj istniejące ćwiczenie"}</div><i className={`fas ${existingExercise ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </button>
                            <div className="expandable">
                                <div className={`${existingExercise ? "show" : "hide"}`}>
                                    <ExistingExerciseToWorkout workoutId={workoutId} exercises={this.state.exercises} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {(workout.status === STATUS.private || userRole === USER_ROLE.admin) && <a href="#modal">
                        <button className="add-btn"><i className="fas fa-plus"></i></button>
                    </a>}
                </div>

            );
        }
    }
}

export default WorkoutDetails;
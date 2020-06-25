import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "./FullPageLoader";
import Error from "../Error";
import NewExerciseToWorkout from "./NewExerciseToWorkout";
import ExistingExerciseToWorkout from "./ExistingExerciseToWorkout";

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
            .then(window.location.reload())
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

    render() {
        let { isLoaded, errorStatusCode, newExercise, existingExercise, workoutId } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (

                <div className="main-content workout-details">
                    <div className="pageLabel">
                        <h1>{this.state.workout.name}</h1>
                    </div>
                    <div className="card-container">
                        {this.state.exercises && this.state.exercises.map((exercise) => (
                            <div className="card">
                                <div className="card-info">
                                    <h4 className="category">{this.extractCategory(exercise.exerciseCategory)}</h4>
                                    <h4>{exercise.name}</h4>
                                    <h5>{exercise.info}</h5>
                                </div>
                                <div className="card-buttons">
                                    <button onClick={this.redirectToExerciseDetails.bind(this, exercise.id)}>Logs</button>
                                    <button className="error-btn" onClick={this.deleteExerciseFromWorkout.bind(this, exercise.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="#">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>Choose one option:</h2>
                            {/* New Exercise Section */}
                            <button className="modal-option" onClick={this.setNewState}>
                                <div>Add a new Exercise</div><i className={`fas ${newExercise ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </button>
                            <div className="expandable">
                                <div className={`${newExercise ? "show" : "hide"}`}>
                                    <NewExerciseToWorkout workoutId={workoutId} />
                                </div>
                            </div>
                            {/* Existing Exercise Section */}
                            <button className="modal-option" onClick={this.setExistingState}>
                                <div>Add an existing Exercise</div><i className={`fas ${existingExercise ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </button>
                            <div className="expandable">
                                <div className={`${existingExercise ? "show" : "hide"}`}>
                                    <ExistingExerciseToWorkout workoutId={workoutId} exercises={this.state.exercises} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="#modal">
                        <button className="add-btn"><i className="fas fa-plus"></i></button>
                    </a>
                </div>

            );
        }
    }
}

export default WorkoutDetails;
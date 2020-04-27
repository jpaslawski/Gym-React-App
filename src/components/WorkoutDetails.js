import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "./FullPageLoader";
import Error from "../Error";

class WorkoutDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            workoutId: this.props.match.params.workoutId,
            workout: [],
            exercises: [],
            categories: [],
            name: undefined,
            info: undefined,
            newExercise: false,
            existingExercise: false,
            categoryNew: undefined,
            categoryEx: undefined,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.setNewState = this.setNewState.bind(this);
        this.setExistingState = this.setExistingState.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }


    extractCategory(object) {
        if (object == null) {
            return "-";
        }
        let json = JSON.stringify(object);
        return JSON.parse(json).category;
    }

    createExercise() {
        axios.post("api/exercises/" + this.state.workoutId)
        .then(window.location.reload())
        .catch(error => {
            this.setState({
                errorMessage: error.response.statusText
            })
            console.log(error.response.data);
        });
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
                this.setState({
                    isLoaded: false,
                    errorStatusCode: error.response.status,
                    errorMessage: error.response.statusText
                })
            });

        axios.get("api/exercises?workoutId=" + this.state.workoutId)
            .then(response =>
                this.setState({
                    exercises: response.data,
                    isLoaded: true
                }))
            .catch(error => {
                this.setState({
                    isLoaded: false,
                    errorStatusCode: error.response.status,
                    errorMessage: error.response.statusText
                })
            });

        axios.get("api/categories")
            .then(response =>
                this.setState({
                    categories: response.data
                }))
            .catch(error => {
                this.setState({
                    errorStatusCode: error.response.status,
                    errorMessage: error.response.statusText
                })
            });
    }

    render() {
        let { name, info, isLoaded, errorStatusCode, newExercise, existingExercise, categories } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (

                <div className="main-content">
                    <div className="pageLabel">
                        <h1>{this.state.workout.name}</h1>
                        <a href="#modal"><button>Add an exercise</button></a>
                    </div>
                    <div className="card-container">
                        {this.state.exercises.map((exercise) => (
                            <div className="card">
                                <div className="card-info">
                                    <h4 className="category">{this.extractCategory(exercise.category)}</h4>
                                    <h4>{exercise.name}</h4>
                                    <h5>{exercise.info}</h5>
                                </div>
                                <div className="card-buttons">
                                    <button>Logs</button>
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
                                    <div className={`inputs email ${name ? "focus" : ""}`}>
                                        <div className="i">
                                            <i className="fas fa-dumbbell"></i>
                                        </div>
                                        <div>
                                            <h5>Exercise Name</h5>
                                            <input type="text" name="name" onChange={this.onChange} />
                                        </div>
                                    </div>
                                    <div className={`inputs email ${info ? "focus" : ""}`}>
                                        <div className="i">
                                            <i className="fas fa-info"></i>
                                        </div>
                                        <div>
                                            <h5>Additional Info</h5>
                                            <input type="text" name="info" onChange={this.onChange} />
                                        </div>
                                    </div>
                                    <div className="inputs email focus">
                                        <div className="i">
                                            <i className="fas fa-project-diagram"></i>
                                        </div>
                                        <div>
                                            <h5>Category</h5>
                                            <select name="categoryNew" onChange={this.onChange}>
                                                <option value="null">-</option>
                                                {categories.map((item) => (
                                                     <option>{item.category}</option> 
                                                ))} 
                                            </select>
                                        </div>
                                    </div>
                                    <p className="error-message ">{this.state.errorMessage}</p>
                                    <input type="button" className="btn" value="Create & Add" onClick={this.createExercise} />
                                </div>
                            </div>
                            {/* Existing Exercise Section */}
                            <button className="modal-option" onClick={this.setExistingState}>
                                <div>Add an existing Exercise</div><i className={`fas ${existingExercise ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </button>
                            <div className="expandable">
                                <div className={`${existingExercise ? "show" : "hide"}`}>
                                    <div className="inputs email focus">
                                        <div className="i">
                                            <i className="fas fa-project-diagram"></i>
                                        </div>
                                        <div>
                                            <h5>Category</h5>
                                            <select name="categoryEx" onChange={this.onChange}>
                                                <option value="null">-</option>
                                                {categories.map((item) => (
                                                     <option>{item.category}</option> 
                                                ))} 
                                            </select>
                                        </div>
                                    </div>
                                    <p className="error-message ">{this.state.errorMessage}</p>
                                    <input type="button" className="btn" value="Add" onClick={this.createExercise} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    }
}

export default WorkoutDetails;
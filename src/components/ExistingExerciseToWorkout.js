import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";

class ExistingExerciseToWorkout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            exercisesByCategory: [],
            categoryEx: undefined,
            chosenExercise: undefined,
            errorMessage: undefined,
            categories: [],
            isLoaded: false
        };

        this.addExercise = this.addExercise.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeExercise = this.onChangeExercise.bind(this);
    }


    onChangeCategory(element) {
        if (element.target.value !== "null") {
            axios.get("api/exercises?category=" + element.target.value)
            .then(response => {
                if (response.status === 200) {
                    let availableExercises;

                    if ( this.props.exercises === "") {
                        availableExercises = response.data;
                    } else {
                        availableExercises = response.data.filter(item1 => this.props.exercises.filter(item2 => item2.id === item1.id).length === 0);
                    }
                    
                    this.setState({
                        exercisesByCategory: availableExercises,
                        chosenExercise: availableExercises[0]
                    })
                } else {
                    this.setState({
                        exercisesByCategory: [],
                        chosenExercise: undefined
                    })
                }
            })
        } else {
            this.setState({
                exercisesByCategory: [],
                chosenExercise: undefined
            })
        }
    }

    onChangeExercise(element) {
        let findExercise = this.state.exercisesByCategory.filter(item => {
            return parseInt(item.id, 10) === parseInt(element.target.value, 10);
        })

        console.log(findExercise[0]);
        this.setState({
            chosenExercise: findExercise[0]
        })
    }

    addExercise() {
        let exerciseId = this.state.chosenExercise.id;
        console.log("Exercise: " + this.state.chosenExercise.id);
        let workoutId = this.props.workoutId;

        axios.put("api/exercises/" + exerciseId + "/" + workoutId)
        .then(this.props.history.push("/workouts/" + workoutId))
        //.then(window.location.reload())
        .catch(error => {
            this.setState({
                errorMessage: error.response.statusText
            })
            console.log(error.response.data);
        });
    }

    componentDidMount() {
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

    componentWillMount() {
        this.setState({
            isLoaded: false
        })
    }

    render() {
        let {isLoaded, exercisesByCategory} = this.state;
        if (!isLoaded) {
            return (<FullPageLoader />);
        } else {
            return (
                <div>
                    <div className="inputs email focus">
                        <div className="i">
                            <i className="fas fa-project-diagram"></i>
                        </div>
                        <div>
                            <h5>Category</h5>
                            <select name="categoryEx" onChange={this.onChangeCategory}>
                                <option value="null">-</option>
                                {this.state.categories && this.state.categories.map((item) => (
                                    <option>{item.category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={(exercisesByCategory === undefined || exercisesByCategory.length === 0) ? "none" : "inputs email focus"}>
                        <div className="i">
                            <i className="fas fa-dumbbell"></i>
                        </div>
                        <div>
                            <h5>Exercise</h5>
                            <select name="exercisesByCategory" onChange={this.onChangeExercise}>
                                {exercisesByCategory && exercisesByCategory.map((item) => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={(exercisesByCategory === undefined || exercisesByCategory.length === 0) ? "" : "none"}>
                        <h5>No available exercises in this category</h5>
                    </div>
                    <p className="error-message ">{this.state.errorMessage}</p>
                    <input type={(exercisesByCategory === undefined || exercisesByCategory.length === 0) ? "" : "button"} 
                    className={(exercisesByCategory === undefined || exercisesByCategory.length === 0) ? "none" : "btn"} value="Add" onClick={this.addExercise} />
                </div>
            );
        }

    }
}
export default withRouter(ExistingExerciseToWorkout);
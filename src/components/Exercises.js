import React, { Component } from "react";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Error from "../Error";
import NewExerciseToWorkout from "./NewExerciseToWorkout";

class Exercises extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercises: [],
            displayedExercises: [],
            isLoaded: false,
            categories: [],
            checkedCategories: [],
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    }

    extractCategory(object) {
        if (object == null) {
            return "-";
        }
        let json = JSON.stringify(object);
        return JSON.parse(json).category;
    }

    onChangeCheckBox(element) {
        let {checkedCategories, exercises} = this.state;
        let displayedExercises = [];
        if (checkedCategories.includes(element.target.name)) {
            let index = checkedCategories.indexOf(element.target.name);
            if (index >= 0) {
                checkedCategories.splice( index, 1 );
            }
        } else {
            checkedCategories = checkedCategories.concat(element.target.name);
        }

        for (let  i = 0; i < exercises.length; i++) {
            if(checkedCategories.includes(this.extractCategory(exercises[i].exerciseCategory))) {
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

    componentDidMount() {
        axios.get("api/exercises")
            .then(response => this.setState({
                exercises: response.data,
                displayedExercises: response.data,
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

        let { isLoaded, errorStatusCode, errorMessage } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content exercise">
                    <div className="pageLabel">
                        <h1>Exercises</h1>
                    </div>
                    <div className="table-with-filter">
                        <div className="table-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Exercise name</th>
                                    <th>Additional Information</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.displayedExercises && this.state.displayedExercises.map((exercise) => (
                                    <tr key={exercise.uniqueId}>
                                        <td key={exercise.uniqueId}>{exercise.name}</td>
                                        <td key={exercise.uniqueId} className="info-column">{exercise.info}</td>
                                        <td key={exercise.uniqueId}>
                                            {this.extractCategory(exercise.exerciseCategory)}
                                        </td>
                                        <td key={exercise.uniqueId}>
                                            <button className="details-btn" ><i className="fas fa-info" title="Details"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        <div className="filter">
                            <div className="filter-title">Filters</div>
                            <div className="filter-content">
                                <h4>Category:</h4>
                                <ul>
                                {this.state.categories && this.state.categories.map((item) => (
                                    <li>
                                        <label>{item.category}
                                        <input id={item.id} name={item.category} type="checkbox" onChange={this.onChangeCheckBox}/>
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
                    </div>
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="#">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>New Exercise</h2>
                            <NewExerciseToWorkout />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Exercises;
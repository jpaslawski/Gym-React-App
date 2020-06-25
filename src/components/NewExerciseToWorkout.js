import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "./FullPageLoader";
import {withRouter} from "react-router-dom";

class NewExerciseToWorkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: undefined,
            info: undefined,
            categoryNew: undefined,
            errorMessage: undefined,
            categories: [],
            isLoaded: false
        };

        this.createExercise = this.createExercise.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    createExercise() {
        const exerciseData = {
            name: this.state.name,
            info: this.state.info,
            category: this.state.categoryNew
        }
        if (this.props.workoutId) {
            axios.post("api/exercises/" + this.props.workoutId, exerciseData)
            .then(this.props.history.push("/workouts/" + this.props.workoutId))
            .then(window.location.reload())
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
                console.log(error.response.data);
            });
        } else {
            axios.post("api/exercises", exerciseData)
            .then(this.props.history.push("/exercises"))
            .then(window.location.reload())
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
                console.log(error.response.data);
            });
        }
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
        let { name, info, isLoaded } = this.state;
        if (!isLoaded) {
            return (<FullPageLoader />);
        } else {
            return (
                <div>
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
                                {this.state.categories && this.state.categories.map((item) => (
                                    <option>{item.category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="error-message ">{this.state.errorMessage}</p>
                    <input type="button" className="btn" value="Create & Add" onClick={this.createExercise} />
                </div>
            );
        }
    }

}
export default withRouter(NewExerciseToWorkout);
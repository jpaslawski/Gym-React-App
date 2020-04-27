import React, { Component } from "react";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Error from "../Error";

class Workouts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            info: undefined,
            workouts: [],
            workoutId: undefined,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.createWorkout = this.createWorkout.bind(this);
        this.deleteWorkout = this.deleteWorkout.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    redirectToDetails(workoutId) {
        this.props.history.push("/workouts/" + workoutId);
        window.location.reload();
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    createWorkout() {
        let { history } = this.props;

        if (this.state.name) {

            const workoutData = {
                name: this.state.name,
                info: (this.state.info === undefined ? "" : this.state.info)
            }

            axios.post("api/workouts", workoutData)
                .then(response => {
                    this.setState({
                        errorMessage: ""
                    })
                    console.log(response);
                    history.push("/workouts");
                    window.location.reload();
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Ups! Something went wrong..."
                    })
                });
        } else {
            this.setState({
                errorMessage: "Your workout must have a name!"
            });
        }
    }

    selectWorkout(workoutId) {
        this.setState({
            workoutId: workoutId
        });
    }

    deleteWorkout() {
        let { history } = this.props;

        axios.delete("api/workouts/" + this.state.workoutId)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                history.push("/workouts");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    componentDidMount() {
        axios.get("api/workouts")
            .then(response => this.setState({
                workouts: response.data,
                isLoaded: true
            }))
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    errorStatusCode: error.response.status,
                    errorMessage: error.response.statusText
                })
            });
    }

    render() {
        let { isLoaded, name, info, errorStatusCode } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="pageLabel">
                        <h1>Workouts</h1>
                        <a href="#modal"><button>New Workout</button></a>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Info</th>
                                <th>Exercises Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.workouts.map((workout, index) => (
                                <tr key={workout.uniqueId}>
                                    <td key={++index}>{workout.id}</td>
                                    <td key={++index}>{workout.name}</td>
                                    <td key={++index}>{workout.info}</td>
                                    <td key={++index}>{workout.exerciseAmount}</td>
                                    <td key={++index}>
                                        <button className="secondary-btn" onClick={this.redirectToDetails.bind(this, workout.id)}><i className="fas fa-info" title="Details"></i></button>
                                        <button className="update-btn"><i className="fas fa-pen" title="Edit"></i></button>
                                        <a href="#modal-delete"><button className="error-btn" onClick={this.selectWorkout.bind(this, workout.id)} title="Delete"><i className="fas fa-times"></i></button></a>
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
                            <h2>Add a new workout!</h2>
                            <div className={`inputs email ${name ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>Workout Name</h5>
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
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value="Submit" onClick={this.createWorkout} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="#">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>Delete workout {this.state.workoutId}?</h2>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value="Delete" onClick={this.deleteWorkout} />
                            <a href="#"><input type="button" className="btn secondary-btn" value="Cancel"/></a>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Workouts;
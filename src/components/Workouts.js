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
            editName: undefined,
            editInfo: undefined,
            workouts: [],
            workoutId: undefined,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
            createOrUpdate: undefined
        };

        this.createOrUpdateWorkout = this.createOrUpdateWorkout.bind(this);
        this.deleteWorkout = this.deleteWorkout.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setCreateMode = this.setCreateMode.bind(this);
        this.setUpdateMode = this.setUpdateMode.bind(this);
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

    setCreateMode() {
        this.setState({
            createOrUpdate: "create",
            name: "",
            info: ""
        });
    }

    setUpdateMode(name, info, workoutId) {
        this.setState({
            createOrUpdate: "update",
            name: name,
            info: info,
            workoutId: workoutId
        });
    }

    createOrUpdateWorkout() {
        let { history } = this.props;

        if (this.state.name) {

            const workoutData = {
                name: this.state.name,
                info: (this.state.info === undefined ? "" : this.state.info)
            }

            if(this.state.createOrUpdate === "create") {
                axios.post("api/workouts", workoutData)
                .then(response => {
                    this.setState({
                        errorMessage: ""
                    })
                    history.push("/workouts");
                    window.location.reload();
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Ups! Something went wrong..."
                    })
                });
            }
            else if(this.state.createOrUpdate === "update") {
                axios.put("api/workouts/" + this.state.workoutId, workoutData)
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
            }
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
        let { isLoaded, name, info, errorStatusCode, editName, editInfo } = this.state;

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content workout">
                    <div className="pageLabel">
                        <h1>Workouts</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Info</th>
                                <th>Exercises Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.workouts.map((workout, index) => (
                                <tr key={workout.uniqueId}>
                                    <td key={++index}>{workout.name}</td>
                                    <td key={++index}>{workout.info}</td>
                                    <td key={++index}>{workout.exerciseAmount}</td>
                                    <td key={++index} className="action-group">
                                        <button className="details-btn" onClick={this.redirectToDetails.bind(this, workout.id)}><i className="fas fa-info" title="Details"></i></button>
                                        <a href="#modal"><button className="update-btn" onClick={this.setUpdateMode.bind(this, workout.name, workout.info, workout.id)}><i className="fas fa-pen" title="Edit"></i></button></a>
                                        <a href="#modal-delete"><button className="error-btn" onClick={this.selectWorkout.bind(this, workout.id)}><i className="fas fa-times" title="Delete"></i></button></a>
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
                            <div className={`inputs email ${(name || editName) ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>Workout Name</h5>
                                    <input type="text" name="name" value={name} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${(info || editInfo) ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Additional Info</h5>
                                    <input type="text" name="info" value={info} onChange={this.onChange} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value="Submit" onClick={this.createOrUpdateWorkout} />
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
                            <a href="#"><input type="button" className="btn secondary-btn" value="Cancel" /></a>
                        </div>
                    </div>
                    <a href="#modal">
                        <button className="add-btn" onClick={this.setCreateMode}><i className="fas fa-plus"></i></button>
                    </a>
                </div>
            );
        }
    }
}

export default Workouts;
import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";

class Workouts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            info: "",
            editName: "",
            editInfo: "",
            selectedItem: undefined,
            workouts: [],
            userWorkouts: [],
            publicWorkouts:[],
            workoutId: undefined,
            customHeight: undefined,
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

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    redirectToDetails(workoutId) {
        this.props.history.push("/workouts/" + workoutId);
        window.location.reload();
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

            if (this.state.createOrUpdate === "create") {
                axios.post("api/workouts", workoutData)
                    .then(response => {
                        this.setState({
                            errorMessage: ""
                        })
                        history.push("workouts");
                        window.location.reload();
                    })
                    .catch(error => {
                        this.setState({
                            errorMessage: "Ups! Something went wrong..."
                        })
                    });
            }
            else if (this.state.createOrUpdate === "update") {
                axios.put("api/workouts/" + this.state.workoutId, workoutData)
                    .then(response => {
                        this.setState({
                            errorMessage: ""
                        })
                        history.push("workouts");
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
                history.push("workouts");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
            });
    }

    setPublicWorkouts() {
        this.setState({
            workouts: this.state.publicWorkouts,
            selectedItem: "public"
        })
    }

    setUserWorkouts() {
        this.setState({
            workouts: this.state.userWorkouts,
            selectedItem: "user"
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

    componentDidMount() {

        if (this.multilineTextarea) {
            this.multilineTextarea.style.height = 'auto';
          }

        axios.get("api/workouts")
            .then(response => this.setState({
                isLoaded: true,
                userWorkouts: response.data
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

            axios.get("api/workouts/public")
            .then(response => {
                console.log(response.data);
                this.setState({
                publicWorkouts: response.data,
                workouts: response.data,
                selectedItem: "public",
                isLoaded: true
            })
        })
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
        let { workouts, isLoaded, name, info, errorStatusCode, errorMessage, editName, editInfo } = this.state;
        let language = sessionStorage.getItem("language");

        let tableOfWorkouts = <table>
            <thead>
                <tr>
                    <th>{language === "EN" ? "Name" : "Nazwa"}</th>
                    <th>{language === "EN" ? "Info" : "Dodatkowe informacje"}</th>
                    <th>{language === "EN" ? "Exercise Amount" : "Liczba ćwiczeń"}</th>
                    <th>{language === "EN" ? "Actions" : "Działania"}</th>
                </tr>
            </thead>
            <tbody>
                {workouts && workouts.map((workout, index) => (
                    <tr key={workout.id}>
                        <td key={++index}>{workout.name}</td>
                        <td key={++index}>{workout.info}</td>
                        <td key={++index}>{workout.exerciseAmount}</td>
                        <td key={++index} className="action-group">
                            <button className="details-btn" onClick={this.redirectToDetails.bind(this, workout.id)}><i className="fas fa-info" title={language === "EN" ? "Details" : "Szczegóły"}></i></button>
                            {sessionStorage.getItem('role') === "ROLE_ADMIN" && <a href="#modal">
                                <button className="update-btn" onClick={this.setUpdateMode.bind(this, workout.name, workout.info, workout.id)}>
                                    <i className="fas fa-pen" title={language === "EN" ? "Edit" : "Aktualizuj"}></i>
                                </button>
                            </a>}
                            {sessionStorage.getItem('role') === "ROLE_ADMIN" && <a href="#modal-delete">
                                <button className="error-btn" onClick={this.selectWorkout.bind(this, workout.id)}>
                                    <i className="fas fa-times" title={language === "EN" ? "Delete" : "Usuń"}></i>
                                </button>
                            </a>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content workout">
                    <div className="pageLabel">
                        <h1>{language === "EN" ? "Workouts" : "Treningi"}</h1>
                        <h3 className={this.state.selectedItem === "public" ? "active" : ""} onClick={this.setPublicWorkouts.bind(this)}>{language === "EN" ? "Shared workouts" : "Treningi udostępnione"}</h3>
                        <h3 className={this.state.selectedItem === "user" ? "active" : ""} onClick={this.setUserWorkouts.bind(this)}>{language === "EN" ? "My workouts" : "Moje treningi"}</h3>
                    </div>
                    {workouts ? tableOfWorkouts : <div className="no-content">
                        {language === "EN" ? "No workouts found! Add some by clicking the button down below..." : "Nie znaleziono żadnych treningów! Możesz dodać trening za pomocą poniższego przycisku..."}
                        </div>}
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{this.state.createOrUpdate === "create" ? "Add a new workout!" : "Update the information about this workout!"}</h2>
                            <div className={`inputs email ${(name || editName) ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === "EN" ? "Workout Name" : "Nazwa treningu"}</h5>
                                    <input type="text" name="name" value={name} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${(info || editInfo) ? "focus" : ""}`} style={{"height": `${this.state.customHeight}px`}}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === "EN" ? "Additional Info" : "Dodatkowe informacje"}</h5>
                                    <textarea type="text" name="info" value={info} onChange={this.changeTextarea} ref={ref => this.multilineTextarea = ref} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" value={language === "EN" ? "Submit" : "Zapisz"} onClick={this.createOrUpdateWorkout} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === "EN" ? "Are you sure that you want to delete workout" : "Czy napewno chcesz usunąć trening"} {this.state.workoutId}?</h2>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value={language === "EN" ? "Delete" : "Usuń"} onClick={this.deleteWorkout} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === "EN" ? "Cancel" : "Anuluj"} /></a>
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
import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import { LANGUAGE, LAYOUT_PREFERENCE } from "../constants";
import WorkoutTable from "./tables/WorkoutTable";
import WorkoutCardGroup from "./cardGroup/WorkoutCardGroup";

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
            publicWorkouts: [],
            workoutId: undefined,
            customHeight: undefined,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
            createOrUpdate: undefined
        };

        this.createOrUpdateWorkout = this.createOrUpdateWorkout.bind(this);
        this.selectWorkout = this.selectWorkout.bind(this);
        this.deleteWorkout = this.deleteWorkout.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.setCreateMode = this.setCreateMode.bind(this);
        this.setUpdateMode = this.setUpdateMode.bind(this);
    }

    handleOnChange = (element) => {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    handleOnChangeTextarea = (element) => {
        this.setState({
            [element.target.name]: element.target.value,
            customHeight: this.multilineTextarea.scrollHeight
        });
        this.multilineTextarea.style.height = 'auto';
        this.multilineTextarea.style.height = this.multilineTextarea.scrollHeight + 'px';
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

    componentDidMount() {

        if (this.multilineTextarea) {
            this.multilineTextarea.style.height = 'auto';
        }

        axios.get("api/workouts/public")
            .then(response => this.setState({
                publicWorkouts: response.data,
                workouts: response.data,
                selectedItem: "public",
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

        axios.get("api/workouts")
            .then(response => this.setState({
                userWorkouts: response.data
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
    }

    render() {
        let { workouts, isLoaded, name, info, errorStatusCode, errorMessage, editName, editInfo } = this.state;
        let { history } = this.props;
        const language = sessionStorage.getItem("language");
        const layoutPreference = sessionStorage.getItem("layoutPreference");

        if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content workout">
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Workouts" : "Treningi"}</h1>
                        <h3 className={this.state.selectedItem === "public" ? "active" : ""} onClick={this.setPublicWorkouts.bind(this)}>{language === LANGUAGE.english ? "Shared workouts" : "Treningi udostępnione"}</h3>
                        <h3 className={this.state.selectedItem === "user" ? "active" : ""} onClick={this.setUserWorkouts.bind(this)}>{language === LANGUAGE.english ? "My workouts" : "Moje treningi"}</h3>
                    </div>
                    { layoutPreference === LAYOUT_PREFERENCE.table ? (
                        <WorkoutTable
                            workouts={workouts}
                            history={history}
                            setUpdateMode={this.setUpdateMode}
                            selectWorkout={this.selectWorkout} />
                    ) : (
                        <WorkoutCardGroup
                            workouts={workouts}
                            history={history}
                            setUpdateMode={this.setUpdateMode}
                            selectWorkout={this.selectWorkout} />
                    )}
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
                                    <h5>{language === LANGUAGE.english ? "Workout Name" : "Nazwa treningu"}</h5>
                                    <input type="text" name="name" value={name} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${(info || editInfo) ? "focus" : ""}`} style={{ "height": `${this.state.customHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Additional Info" : "Dodatkowe informacje"}</h5>
                                    <textarea type="text" name="info" value={info} onChange={this.handleOnChangeTextarea} ref={ref => this.multilineTextarea = ref} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" value={language === LANGUAGE.english ? "Submit" : "Zapisz"} onClick={this.createOrUpdateWorkout} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{language === LANGUAGE.english ? "Are you sure that you want to delete workout" : "Czy napewno chcesz usunąć trening"} {this.state.workoutId}?</h2>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn" value={language === LANGUAGE.english ? "Delete" : "Usuń"} onClick={this.deleteWorkout} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
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
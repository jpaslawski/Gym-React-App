import React, { Component } from "react";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import axios from "axios";
import Error from "../Error";
import { LANGUAGE, LAYOUT_PREFERENCE } from "../constants";
import WorkoutTable from "./tables/WorkoutTable";
import WorkoutCardGroup from "./cardGroup/WorkoutCardGroup";
import { Redirect } from "react-router";

class Workouts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            namePL: "",
            info: "",
            infoPL: "",
            selectedItem: undefined,
            selectedWorkout: {},
            workouts: [],
            userWorkouts: [],
            pendingWorkouts: [],
            publicWorkouts: [],
            workoutId: undefined,
            infoHeight: undefined,
            infoPLHeight: undefined,
            redirect: false,
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
            createOrUpdate: undefined
        };

        this.createOrUpdateWorkout = this.createOrUpdateWorkout.bind(this);
        this.selectWorkout = this.selectWorkout.bind(this);
        this.deleteWorkout = this.deleteWorkout.bind(this);
        this.shareWorkout = this.shareWorkout.bind(this);
        this.manageWorkout = this.manageWorkout.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.setCreateMode = this.setCreateMode.bind(this);
        this.setUpdateMode = this.setUpdateMode.bind(this);
    }

    handleOnChange = (element) => {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    handleOnChangeTextarea1 = (element) => {
        this.setState({
            [element.target.name]: element.target.value,
            infoHeight: this.multilineTextarea1.scrollHeight
        });
        this.multilineTextarea1.style.height = 'auto';
        this.multilineTextarea1.style.height = this.multilineTextarea1.scrollHeight + 'px';
    }

    handleOnChangeTextarea2 = (element) => {
        this.setState({
            [element.target.name]: element.target.value,
            infoPLHeight: this.multilineTextarea2.scrollHeight
        });
        this.multilineTextarea2.style.height = 'auto';
        this.multilineTextarea2.style.height = this.multilineTextarea2.scrollHeight + 'px';
    }

    redirectToDetails(workoutId) {
        this.props.history.push("/workouts/" + workoutId);
        window.location.reload();
    }

    setCreateMode() {
        this.setState({
            createOrUpdate: "create",
            name: "",
            namePL: "",
            info: "",
            infoPL: "",
            infoHeight: 48,
            infoPLHeight: 48
        });
        this.multilineTextarea1.style.height = '48px';
        this.multilineTextarea2.style.height = '48px';
    }

    setUpdateMode(workoutId) {
        let workout = this.state.workouts.find(workout => {
            return workout.id === workoutId
        })
        this.setState({
            createOrUpdate: "update",
            name: workout.name,
            namePL: workout.namePL,
            info: workout.info,
            infoPL: workout.infoPL,
            workoutId: workoutId
        });
    }

    createOrUpdateWorkout() {
        let { history } = this.props;

        if (this.state.name) {

            const workoutData = {
                name: this.state.name,
                namePL: this.state.namePL,
                info: this.state.info,
                infoPL: this.state.infoPL
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
        let workoutToSelect = this.state.workouts.find(workout => {
            return workout.id === workoutId
        });

        this.setState({
            workoutId: workoutId,
            selectedWorkout: workoutToSelect
        });
    }

    deleteWorkout() {
        let { history } = this.props;

        axios.delete("api/workouts/" + this.state.workoutId)
            .then(response => {
                this.setState({
                    errorMessage: "",
                    workoutId: undefined,
                    selectedWorkout: {}
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

    shareWorkout() {
        let { history } = this.props;

        axios.put("api/workouts/" + this.state.workoutId + "/share")
            .then(response => {
                this.setState({
                    errorMessage: "",
                    workoutId: undefined,
                    selectedWorkout: {}
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

    manageWorkout(action) {
        let { history } = this.props;

        axios.put("api/admin/workouts/" + this.state.workoutId + "/" + action)
            .then(response => {
                this.setState({
                    errorMessage: "",
                    workoutId: undefined,
                    selectedWorkout: {}
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

    setPendingWorkouts() {
        this.setState({
            workouts: this.state.pendingWorkouts,
            selectedItem: "pending"
        })
    }

    setUserWorkouts() {
        this.setState({
            workouts: this.state.userWorkouts,
            selectedItem: "user"
        })
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        } else {
            if (this.multilineTextarea) {
                this.multilineTextarea.style.height = 'auto';
            }

            axios.get("api/workouts/public")
                .then(response => this.setState({
                    publicWorkouts: response.data !== "" ? response.data : [],
                    workouts: response.data !== "" ? response.data : [],
                    selectedItem: "public"
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

            axios.get("api/workouts")
                .then(response => this.setState({
                    userWorkouts: response.data !== "" ? response.data : []
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

            axios.get("api/workouts/pending")
                .then(response => this.setState({
                    isLoaded: true,
                    pendingWorkouts: response.data !== "" ? response.data : []
                }))
                .catch(error => {
                    if (!error.response) {
                        this.setState({
                            errorStatusCode: 522,
                            errorMessage: "Connection lost!"
                        })
                    } else if (error.response.status === 400) {
                        this.setState({
                            pendingWorkouts: [],
                            isLoaded: true
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
        let { workouts, isLoaded, name, namePL, info, infoPL, errorStatusCode, errorMessage } = this.state;
        let { history } = this.props;
        const language = sessionStorage.getItem("language");
        const layoutPreference = sessionStorage.getItem("layoutPreference");

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={errorStatusCode} errorInfo={errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content workout">
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h2>{(this.state.createOrUpdate === "create") ?
                                (language === LANGUAGE.english ? "Add a new workout!" : "Dodaj nowy trening!")
                                :
                                (language === LANGUAGE.english ? "Update the information about this workout!" : "Zaktualizuj informacje dotyczące tego treningu!")}
                            </h2>
                            <div className={`inputs email ${name ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Workout Name" : "Nazwa treningu"} (EN)*</h5>
                                    <input type="text" name="name" value={name} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${namePL ? "focus" : ""}`}>
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Workout Name" : "Nazwa treningu"} (PL)</h5>
                                    <input type="text" name="namePL" value={namePL} onChange={this.handleOnChange} />
                                </div>
                            </div>
                            <div className={`inputs email ${info ? "focus" : ""}`} style={{ "height": `${this.state.infoHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Additional Info" : "Dodatkowe informacje"} (EN)</h5>
                                    <textarea type="text" name="info" value={info} onChange={this.handleOnChangeTextarea1} ref={ref => this.multilineTextarea1 = ref} />
                                </div>
                            </div>
                            <div className={`inputs email ${infoPL ? "focus" : ""}`} style={{ "height": `${this.state.infoPLHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>{language === LANGUAGE.english ? "Additional Info" : "Dodatkowe informacje"} (PL)</h5>
                                    <textarea type="text" name="infoPL" value={infoPL} onChange={this.handleOnChangeTextarea2} ref={ref => this.multilineTextarea2 = ref} />
                                </div>
                            </div>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Submit" : "Zapisz"} onClick={this.createOrUpdateWorkout}
                                disabled={name ? "" : "disabled"} />
                        </div>
                    </div>
                    <div className="modal" id="modal-delete">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>{language === LANGUAGE.english ? "Are you sure that you want to delete workout" : "Czy napewno chcesz usunąć trening"} {this.state.selectedWorkout.name}?</h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn error-btn" value={language === LANGUAGE.english ? "Delete" : "Usuń"} onClick={this.deleteWorkout} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="modal-share">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>{language === LANGUAGE.english ?
                                "You are now sharing this workout to the users of GymApp. An admin will review it and if it will be necessary, he will edit it (note that the workout names and additional informations should be provided in both PL and EN). From now on, you can't edit this workout!" :
                                "Udostępniasz ten trening wszystkim użytkownikom GymApp. Administrator sprawdzi go i jeśli zajdzie taka potrzeba, naniesie poprawki (nazwa oraz opis treningu powinna być zapisana w językach PL i EN). Od teraz nie będziesz miał możliwości edytować tego treningu!"}
                            </h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn primary-btn" value={language === LANGUAGE.english ? "Share" : "Udostępnij"} onClick={this.shareWorkout} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="modal" id="modal-manage">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>English Version</h3>
                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>Workout Name</h5>
                                    <input type="text" value={this.state.selectedWorkout.name} disabled />
                                </div>
                            </div>
                            <div className="inputs email focus" style={{ "height": `${this.state.infoHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Additional Info</h5>
                                    <textarea type="text" value={this.state.selectedWorkout.info} disabled />
                                </div>
                            </div>
                            <h3>Polska Wersja</h3>

                            <div className="inputs email focus">
                                <div className="i">
                                    <i className="fas fa-list-alt"></i>
                                </div>
                                <div>
                                    <h5>Nazwa treningu</h5>
                                    <input type="text" value={this.state.selectedWorkout.namePL} disabled />
                                </div>
                            </div>

                            <div className="inputs email focus" style={{ "height": `${this.state.infoPLHeight}px` }}>
                                <div className="i">
                                    <i className="fas fa-info"></i>
                                </div>
                                <div>
                                    <h5>Dodatkowe informacje</h5>
                                    <textarea type="text" value={this.state.selectedWorkout.infoPL} disabled />
                                </div>
                            </div>
                            <input type="button" className="update-btn" value={language === LANGUAGE.english ? "Accept" : "Zatwierdź"} onClick={this.manageWorkout.bind(this, "accept")} />
                            <input type="button" className="error-btn" value={language === LANGUAGE.english ? "Deny" : "Odmów"} onClick={this.manageWorkout.bind(this, "deny")} />
                        </div>
                    </div>
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Workouts" : "Treningi"}</h1>
                        <h3 className={this.state.selectedItem === "public" ? "active" : ""} onClick={this.setPublicWorkouts.bind(this)}>
                            <i className="fas fa-share-alt"></i><span>{language === LANGUAGE.english ? "Shared" : "Udostępnione"}</span>
                        </h3>
                        <h3 className={this.state.selectedItem === "pending" ? "active" : ""} onClick={this.setPendingWorkouts.bind(this)}>
                            <i className="fas fa-clock"></i><span>{language === LANGUAGE.english ? "Pending" : "Do zatwierdzenia"}</span>
                        </h3>
                        <h3 className={this.state.selectedItem === "user" ? "active" : ""} onClick={this.setUserWorkouts.bind(this)}>
                            <i className="fas fa-user-circle"></i><span>{language === LANGUAGE.english ? "My" : "Moje"}</span>
                        </h3>
                    </div>
                    { workouts && layoutPreference === LAYOUT_PREFERENCE.table ? (
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
                    <a href="#modal">
                        <button className="add-btn" onClick={this.setCreateMode}><i className="fas fa-plus"></i></button>
                    </a>
                </div>
            );
        }
    }
}

export default Workouts;
import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import {withRouter} from "react-router-dom";
import { LANGUAGE } from "../constants";

class NewExerciseToWorkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: undefined,
            namePL: "",
            info: "",
            infoPL: "",
            categoryNew: undefined,
            errorMessage: undefined,
            categories: [],
            createOrUpdate: undefined,
            infoHeight: undefined,
            infoPLHeight: undefined,
            isLoaded: false
        };

        this.createExercise = this.createExercise.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    createExercise() {
        let exerciseCategory = this.state.categoryNew;
        if(sessionStorage.getItem("language") === LANGUAGE.polish) {
            let element = this.state.categories.find(c => {
                return c.categoryPL === this.state.categoryNew;
            })
            exerciseCategory = element.category;
        }
        const exerciseData = {
            name: this.state.name,
            namePL: this.state.namePL,
            info: this.state.info,
            infoPL: this.state.infoPL,
            category: exerciseCategory
        }
        if (this.props.workoutId) {
            axios.post("api/exercises/" + this.props.workoutId, exerciseData)
            .then(this.props.history.push("workouts/" + this.props.workoutId))
            .then(window.location.reload())
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
                console.log(error.response.data);
            });
        } else {
            axios.post("api/exercises", exerciseData)
            .then(this.props.history.push("exercises"))
            .then(window.location.reload())
            .catch(error => {
                this.setState({
                    errorMessage: error.response.statusText
                })
                console.log(error.response.data);
            });
        }
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
        let { name, namePL, info, infoPL, isLoaded } = this.state;
        let language = sessionStorage.getItem("language");

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
                            <h5>{language === LANGUAGE.english ? "Exercise Name" : "Nazwa ćwiczenia"} (EN)</h5>
                            <input type="text" name="name" onChange={this.handleOnChange} />
                        </div>
                    </div>
                    <div className={`inputs email ${namePL ? "focus" : ""}`}>
                        <div className="i">
                            <i className="fas fa-dumbbell"></i>
                        </div>
                        <div>
                            <h5>{language === LANGUAGE.english ? "Exercise Name" : "Nazwa ćwiczenia"} (PL)</h5>
                            <input type="text" name="namePL" onChange={this.handleOnChange} />
                        </div>
                    </div>
                    <div className={`inputs email ${(info) ? "focus" : ""}`} style={{"height": `${this.state.infoHeight}px`}}>
                        <div className="i">
                            <i className="fas fa-info"></i>
                        </div>
                        <div>
                            <h5>{language === LANGUAGE.english ? "Additional Info" : "Dodatkowe informacje"} (EN)</h5>
                            <textarea type="text" name="info" value={info} onChange={this.handleOnChangeTextarea1} ref={ref => this.multilineTextarea1 = ref} />
                        </div>
                    </div>
                    <div className={`inputs email ${(infoPL) ? "focus" : ""}`} style={{"height": `${this.state.infoPLHeight}px`}}>
                        <div className="i">
                            <i className="fas fa-info"></i>
                        </div>
                        <div>
                            <h5>{language === LANGUAGE.english ? "Additional Info" : "Dodatkowe informacje"} (PL)</h5>
                            <textarea type="text" name="infoPL" value={infoPL} onChange={this.handleOnChangeTextarea2} ref={ref => this.multilineTextarea2 = ref} />
                        </div>
                    </div>
                    <div className="inputs email focus">
                        <div className="i">
                            <i className="fas fa-project-diagram"></i>
                        </div>
                        <div>
                            <h5>{language === LANGUAGE.english ? "Category" : "Kategoria"}</h5>
                            <select name="categoryNew" onChange={this.handleOnChange}>
                                <option value="null">-</option>
                                {this.state.categories && this.state.categories.map(({category, categoryPL}) => (
                                    <option key={category}>{language === LANGUAGE.polish ? categoryPL : category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="error-message ">{this.state.errorMessage}</p>
                    <input  type="button" 
                            className="btn primary-btn" 
                            value={this.props.workoutId !== undefined ? 
                                language === LANGUAGE.english ? "Create & Add" : "Utwórz & Dodaj"
                                    :
                                language === LANGUAGE.english ? "Create" : "Utwórz"} 
                            onClick={this.createExercise} />
                </div>
            );
        }
    }

}
export default withRouter(NewExerciseToWorkout);
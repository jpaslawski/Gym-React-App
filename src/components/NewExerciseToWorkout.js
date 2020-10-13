import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "../animatedComponents/FullPageLoader";
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
            createOrUpdate: undefined,
            customHeight: undefined,
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

    changeTextarea = (element) => {
        this.setState({
            [element.target.name]: element.target.value,
            customHeight: this.multilineTextarea.scrollHeight
        });
        this.multilineTextarea.style.height = 'auto';
        this.multilineTextarea.style.height = this.multilineTextarea.scrollHeight + 'px';
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
                            <h5>{language === "EN" ? "Exercise Name" : "Nazwa ćwiczenia"}</h5>
                            <input type="text" name="name" onChange={this.onChange} />
                        </div>
                    </div>
                    <div className={`inputs email ${(info) ? "focus" : ""}`} style={{"height": `${this.state.customHeight}px`}}>
                        <div className="i">
                            <i className="fas fa-info"></i>
                        </div>
                        <div>
                            <h5>{language === "EN" ? "Additional Info" : "Dodatkowe informacje"}</h5>
                            <textarea type="text" name="info" value={info} onChange={this.changeTextarea} ref={ref => this.multilineTextarea = ref} />
                        </div>
                    </div>
                    <div className="inputs email focus">
                        <div className="i">
                            <i className="fas fa-project-diagram"></i>
                        </div>
                        <div>
                            <h5>{language === "EN" ? "Category" : "Kategoria"}</h5>
                            <select name="categoryNew" onChange={this.onChange}>
                                <option value="null">-</option>
                                {this.state.categories && this.state.categories.map((item, index) => (
                                    <option key={index++}>{item.category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="error-message ">{this.state.errorMessage}</p>
                    <input type="button" className="btn" value={language === "EN" ? "Create & Add" : "Utwórz & Dodaj"} onClick={this.createExercise} />
                </div>
            );
        }
    }

}
export default withRouter(NewExerciseToWorkout);
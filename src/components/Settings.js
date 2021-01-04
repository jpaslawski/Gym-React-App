import React, { Component } from "react";
import { LANGUAGE } from "../constants";
import axios from "axios";
import { Redirect } from "react-router";

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            preferredLanguage: sessionStorage.getItem("language"),
            preferredLayout: sessionStorage.getItem("layoutPreference"),
            redirect: false,
            errorStatusCode: undefined,
            errorMessage: undefined,
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.saveUserPreferences = this.saveUserPreferences.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }

    saveUserPreferences() {
        const userPreferences = {
            preferredLanguage: this.state.preferredLanguage,
            preferredLayout: this.state.preferredLayout
        }

        axios.post("api/users/preferences", userPreferences)
            .then(response => {
                this.setState({
                    errorMessage: ""
                })
                sessionStorage.setItem("layoutPreference", this.state.preferredLayout);
                sessionStorage.setItem("language", this.state.preferredLanguage);
                this.props.history.push("settings");
                window.location.reload();
            })
            .catch(error => {
                this.setState({
                    errorMessage: "Ups! Something went wrong..."
                })
            });
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        }
    }

    render() {
        const language = sessionStorage.getItem("language");

        let { preferredLanguage, preferredLayout } = this.state;

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else {
            return (
                <div className="main-content preference">
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Settings" : "Ustawienia"}</h1>
                    </div>
                    <div className="card">
                        <h4>{language === LANGUAGE.english ? "User Preferences" : "Preferencje użytkownika"}</h4>
                        <h5>{language === LANGUAGE.english ? "Application Layout:" : "Wygląd aplikacji:"}</h5>
                        <select name="preferredLayout" onChange={this.handleOnChange} value={preferredLayout} >
                            <option value="CARD">{language === LANGUAGE.english ? "Card" : "Kafelkowy"}</option>
                            <option value="TABLE">{language === LANGUAGE.english ? "Table" : "Tabelaryczny"}</option>
                        </select>
                        <h5>{language === LANGUAGE.english ? "Default Language:" : "Język domyślny:"}</h5>
                        <select name="preferredLanguage" onChange={this.handleOnChange} value={preferredLanguage} >
                            <option value="PL">{language === LANGUAGE.english ? "Polish" : "Polski"}</option>
                            <option value="EN">{language === LANGUAGE.english ? "English" : "Angielski"}</option>
                        </select>

                        <div className="center-content">
                            <button style={{ "marginTop": "20px" }} onClick={this.saveUserPreferences}>{language === LANGUAGE.english ? "Save" : "Zapisz"}</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Settings;
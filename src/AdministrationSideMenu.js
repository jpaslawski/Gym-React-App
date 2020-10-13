import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { logout } from "./CallAPI";

class AdministrationSideMenu extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    setLanguage(language) {
        sessionStorage.setItem("language", language);
        window.location.reload();
    }

    logout() {
        logout();
    }

    render() {
        let language = sessionStorage.getItem("language");

        return (
            <div className="side-menu">
                <div className="logo">Gym App</div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/home" activeClassName="active">
                                <span><i className="fas fa-home"></i></span>
                                <span>{language === "EN" ? "Home" : "Strona główna"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/users" activeClassName="active">
                                <span><i className="fas fa-users"></i></span>
                                <span>{language === "EN" ? "Users" : "Użytkownicy"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/workouts" activeClassName="active">
                                <span><i className="fas fa-list-alt"></i></span>
                                <span>{language === "EN" ? "Workouts" : "Treningi"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/exercises" activeClassName="active">
                                <span><i className="fas fa-dumbbell"></i></span>
                                <span>{language === "EN" ? "Exercises" : "Ćwiczenia"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/diet" activeClassName="active">
                                <span><i className="fas fa-newspaper"></i></span>
                                <span>{language === "EN" ? "Diet" : "Dieta"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/meals" activeClassName="active">
                                <span><i className="fas fa-apple-alt"></i></span>
                                <span>{language === "EN" ? "Meals" : "Posiłki"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/settings" activeClassName="active">
                                <span><i className="fas fa-cog"></i></span>
                                <span>{language === "EN" ? "Settings" : "Ustawienia"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/sign-in" activeClassName="active" onClick={this.logout}>
                                <span><i className="fas fa-sign-out-alt"></i></span>
                                <span>{language === "EN" ? "Logout" : "Wyloguj się"}</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="language-section">
                    <label>{language === "EN" ? "Language:" : "Język:"} </label>
                    <button className={language === "PL" ? "focus" : ""} onClick={this.setLanguage.bind(this, "PL")}>PL</button>
                    <button className={language === "EN" ? "focus" : ""} onClick={this.setLanguage.bind(this, "EN")}>EN</button>
                </div>
            </div>
        );
    }
};

export default AdministrationSideMenu;
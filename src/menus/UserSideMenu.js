import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../CallAPI";
import { LANGUAGE } from "../constants";

class UserSideMenu extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    setLanguage(language) {
        sessionStorage.setItem("language", language);
        window.location.reload();
    }

    logout() {
        this.props.handleSideMenu();
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
                            <NavLink to="/dashboard/home" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-home"></i></span>
                                <span>{language === LANGUAGE.english ? "Home" : "Strona główna"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/workouts" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-list-alt"></i></span>
                                <span>{language === LANGUAGE.english ? "Workouts" : "Treningi"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/exercises" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-dumbbell"></i></span>
                                <span>{language === LANGUAGE.english ? "Exercises" : "Ćwiczenia"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/diet" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-newspaper"></i></span>
                                <span>{language === LANGUAGE.english ? "Diet" : "Dieta"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/meals" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-apple-alt"></i></span>
                                <span>{language === LANGUAGE.english ? "Meals" : "Posiłki"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/profile" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-user"></i></span>
                                <span>{language === LANGUAGE.english ? "Profile" : "Profil"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/settings" activeClassName="active" onClick={this.props.handleSideMenu}>
                                <span><i className="fas fa-cog"></i></span>
                                <span>{language === LANGUAGE.english ? "Settings" : "Ustawienia"}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/sign-in" activeClassName="active" onClick={this.logout}>
                                <span><i className="fas fa-sign-out-alt"></i></span>
                                <span>{language === LANGUAGE.english ? "Logout" : "Wyloguj się"}</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="language-section">
                    <label>{language === LANGUAGE.english ? "Language:" : "Język:"} </label>
                    <button className={language === LANGUAGE.polish ? "focus" : ""} onClick={this.setLanguage.bind(this, "PL")}>PL</button>
                    <button className={language === LANGUAGE.english ? "focus" : ""} onClick={this.setLanguage.bind(this, LANGUAGE.english)}>EN</button>
                </div>
            </div>
        );
    }
};

export default UserSideMenu;
import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { logout } from "./CallAPI";

class AdministrationSideMenu extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        logout();
    }

    render() {
        return (
            <div className="side-menu">
                <div className="logo">Gym App</div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/home" activeClassName="active">
                                <span><i className="fas fa-home"></i></span>
                                <span>Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/users" activeClassName="active">
                                <span><i className="fas fa-users"></i></span>
                                <span>Users</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/workouts" activeClassName="active">
                                <span><i className="fas fa-list-alt"></i></span>
                                <span>Workouts</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/exercises" activeClassName="active">
                                <span><i className="fas fa-dumbbell"></i></span>
                                <span>Exercises</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/diet" activeClassName="active">
                                <span><i className="fas fa-newspaper"></i></span>
                                <span>Diet</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/meals" activeClassName="active">
                                <span><i className="fas fa-apple-alt"></i></span>
                                <span>Meals</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/administration/settings" activeClassName="active">
                                <span><i className="fas fa-cog"></i></span>
                                <span>Settings</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/sign-in" activeClassName="active" onClick={this.logout}>
                                <span><i className="fas fa-sign-out-alt"></i></span>
                                <span>Logout</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
};

export default AdministrationSideMenu;
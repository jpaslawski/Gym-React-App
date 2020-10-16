import React, { Component } from "react";
import { USER_ROLE } from "../constants";
import AdministrationSideMenu from "./AdministrationSideMenu";
import UserSideMenu from "./UserSideMenu";

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSideMenuOpen: false
        }

        this.handleSideMenu = this.handleSideMenu.bind(this);
    }

    handleSideMenu() {
        this.setState({
            isSideMenuOpen: !this.state.isSideMenuOpen
        })
    }

    render() {
        let { isSideMenuOpen } = this.state;
        let userRole = sessionStorage.getItem("role");

        return (
            <div className="menu">
                <div className="header" onClick={this.handleSideMenu}>
                    <i className={`fas ${isSideMenuOpen ? "fa-times" : "fa-bars"}`}></i>
                    <h3>Gym App</h3>
                </div>
                <div id="side_menu" >
                    {userRole && userRole === USER_ROLE.admin && <AdministrationSideMenu /> }
                    {userRole && userRole === USER_ROLE.user && <UserSideMenu /> }
                </div>
            </div>
        );
    }
};

export default Header;
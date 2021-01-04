import React, { Component } from "react";
import { USER_ROLE } from "../constants";
import AdministrationSideMenu from "./AdministrationSideMenu";
import UserSideMenu from "./UserSideMenu";

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideNav: false
        }

        this.handleMenuIcon = this.handleMenuIcon.bind(this);
    }

    handleMenuIcon() {
        this.setState({
            hideNav: !this.state.hideNav
        })
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }
    
    resize() {
        let currentHideNav = (window.innerWidth <= 600);
        if (currentHideNav !== this.state.hideNav) {
            this.setState({hideNav: currentHideNav});
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
    }

    render() {
        let { hideNav } = this.state;
        const userRole = sessionStorage.getItem("role");

        return (
            <div className="menu">
                <div className="header" onClick={this.handleMenuIcon.bind(this)}>
                    <i className={`fas ${!hideNav ? "fa-times" : "fa-bars"}`}></i>
                    <h3>Gym App</h3>
                </div>
                {!hideNav && <div>
                    {userRole && userRole === USER_ROLE.admin && <AdministrationSideMenu handleSideMenu={this.resize.bind(this)} /> }
                    {userRole && userRole === USER_ROLE.user && <UserSideMenu handleSideMenu={this.resize.bind(this)} /> }
                </div>}
            </div>
        );
    }
};

export default Header;
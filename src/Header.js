import React, { Component } from "react";
import SideMenu from "./SideMenu";

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

        return (
            <div className="menu">
                <div className="header" onClick={this.handleSideMenu}>
                    <i className={`fas ${isSideMenuOpen ? "fa-times" : "fa-bars"}`}></i>
                    <h3>Gym App</h3>
                </div>
                <div id="side_menu" >
                    <SideMenu />
                </div>
            </div>
        );
    }
};

export default Header;
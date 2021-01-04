import React, { Component } from "react";
import axios from "axios";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import Error from "../Error";
import { LANGUAGE, USER_ROLE } from "../constants";
import { Redirect } from "react-router";

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUser: {},
            isLoaded: false,
            redirect: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };
        
        this.selectUser = this.selectUser.bind(this);
    }

    selectUser(userId) {
        this.setState({
            selectedUser: this.state.users.find(user => (
                user.id === userId
            ))
        });
    }

    makeAdmin(){
        let { history } = this.props;

        axios.put("api/admin/users/" + this.state.selectedUser.id + "/makeAdmin", {})
        .then(response => {
            this.setState({
                errorMessage: "",
                selectedUser: {}
            })
            history.push("users");
            window.location.reload();
        })
        .catch(error => {
            this.setState({
                errorMessage: error.response.statusText
            })
        });
    }

    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        } else {
            axios.get("api/admin/users")
                .then(response => this.setState({
                    users: response.data,
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
    }

    render() {
        let { isLoaded, errorStatusCode } = this.state;
        let language = sessionStorage.getItem("language");

        if (this.state.redirect) {
            return (<Redirect to='/sign-in' />);
        } else if (!isLoaded) {
            return <FullPageLoader />;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="modal" id="modal">
                        <div className="modal-container">
                            <a href="# ">
                                <i className=" fas fa-times"></i>
                            </a>
                            <h3>{language === LANGUAGE.english ? "Are you sure that you want to upgrade the permissions of user " : "Czy napewno chcesz zwiększyć uprawnienia użytkownika "} {this.state.selectedUser.username}?</h3>
                            <p className="error-message ">{this.state.errorMessage}</p>
                            <input type="button" className="btn update-btn" value={language === LANGUAGE.english ? "Upgrade" : "Zwiększ"} onClick={this.makeAdmin.bind(this)} />
                            <a href="# "><input type="button" className="btn secondary-btn" value={language === LANGUAGE.english ? "Cancel" : "Anuluj"} /></a>
                        </div>
                    </div>
                    <div className="pageLabel">
                        <h1>{language === LANGUAGE.english ? "Users" : "Użytkownicy"}</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ "width": "10%" }}>ID</th>
                                <th>{language === LANGUAGE.english ? "Username" : "Nazwa użytkownika"}</th>
                                <th>Email</th>
                                <th >{language === LANGUAGE.english ? "Permissions" : "Uprawnienia"}</th>
                                <th >{language === LANGUAGE.english ? "Actions" : "Działania"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.map(({id, username, email, permissions}) => (
                                <tr key={id}>
                                    <td key={id}>{id}</td>
                                    <td key={username}>{username}</td>
                                    <td key={email}>{email}</td>
                                    <td key={permissions}><i className={permissions === USER_ROLE.admin ? "fas fa-crown" : "fas fa-user"}></i></td>
                                    <td key={email+id}>
                                    {permissions !== USER_ROLE.admin &&<a href="#modal">
                                            <button title={language === LANGUAGE.english ? "Make Admin" : "Mianuj administratorem"} onClick={this.selectUser.bind(this, id)}><i className="fas fa-angle-double-up"></i></button>
                                        </a>}
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

export default Users;
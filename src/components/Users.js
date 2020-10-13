import React, {Component} from "react";
import axios from "axios";
import FullPageLoader from "../animatedComponents/FullPageLoader";
import Error from "../Error";

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };

        this.calculateAge = this.calculateAge.bind(this);
    }

    calculateAge(birthday) {
        var jsBirthDay = new Date(birthday);
        var ageDifMs = Date.now() - jsBirthDay;
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    componentDidMount() {

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

    render() {
        let { isLoaded, errorStatusCode } = this.state;
        let language = sessionStorage.getItem("language");

        if (!isLoaded) {
            return <FullPageLoader/>;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <div className="pageLabel">
                        <h1>{language === "EN" ? "Users" : "Użytkownicy"}</h1>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th style={{"width": "5%"}}>ID</th>
                            <th>{language === "EN" ? "Username" : "Nazwa użytkownika"}</th>
                            <th>Email</th>
                            <th style={{"width": "10%"}}>{language === "EN" ? "Permissions" : "Uprawnienia"}</th>
                            <th style={{"width": "10%"}}>{language === "EN" ? "Weight" : "Waga"}</th>
                            <th style={{"width": "10%"}}>{language === "EN" ? "Height" : "Wzrost"}</th>
                            <th style={{"width": "10%"}}>{language === "EN" ? "Age" : "Wiek"}</th>
            {/*<th>Actions</th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((user) => (
                            <tr key={user.id}>
                                <td key={user.uniqueId}>{user.id}</td>
                                <td key={user.uniqueId}>{user.username}</td>
                                <td key={user.uniqueId}>{user.email}</td>
                                <td key={user.uniqueId}><i className={user.permissions === "ROLE_ADMIN" ? "fas fa-crown":"fas fa-user"}></i></td>
                                <td key={user.uniqueId}>{user.weight}</td>
                                <td key={user.uniqueId}>{user.height}</td>
                                <td key={user.uniqueId}>{this.calculateAge(user.dateOfBirth)}</td>
                                {/*<td key={user.uniqueId}><button>Edit</button></td>*/}
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
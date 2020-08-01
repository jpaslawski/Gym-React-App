import React, {Component} from "react";
import axios from "axios";
import FullPageLoader from "./FullPageLoader";
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
    }

    componentDidMount() {

        axios.get("api/users")
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

        if (!isLoaded) {
            return <FullPageLoader/>;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <h1>Users</h1>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Permissions</th>
                            <th>Weight</th>
                            <th>Height</th>
                            <th>Age</th>
            {/*<th>Actions</th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((user, index) => (
                            <tr key={user.id}>
                                <td key={user.uniqueId}>{user.id}</td>
                                <td key={user.uniqueId}>{user.username}</td>
                                <td key={user.uniqueId}>{user.email}</td>
                                <td key={user.uniqueId}><i className={user.permissions === "ROLE_ADMIN" ? "fas fa-crown":"fas fa-user"}></i></td>
                                <td key={user.uniqueId}>{user.weight}</td>
                                <td key={user.uniqueId}>{user.height}</td>
                                <td key={user.uniqueId}>{user.age}</td>
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
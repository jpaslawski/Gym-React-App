import React, { Component } from "react";
import axios from "axios";
import { withRouter} from 'react-router-dom';

class SignIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: undefined,
            password: undefined,
            errorMessage: undefined,
            redirect: false
        }

        this.signIn = this.signIn.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    signIn() {
        if (this.state.email && this.state.password) {

            const credentials = {
                email: this.state.email,
                password: this.state.password
            }

            axios.post("api/authenticate", credentials)
                .then(response => {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("role", response.data.role);
                    axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;
                    this.props.history.push("/home");
                })
                .catch(error => {
                    if (!error.response) {
                        this.setState({
                            errorMessage: "Network Error!"
                        });
                    } else {
                        this.setState({
                            errorMessage: "Wrong email or password!"
                        });
                    }
                });
        } else {
            this.setState({
                errorMessage: "Fill all requested fields!"
            });
        }
    }

    onChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        });
    }


    render() {

        let { email, password, errorMessage } = this.state;

        return (
            <div className="container">
                <div className="signin-container">
                    <h1>Welcome!</h1>
                    <form>
                        <div className={`inputs email ${email ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <h5>Email</h5>
                                <input type="text" name="email" onChange={this.onChange} />
                            </div>
                        </div>
                        <div className={`inputs pass ${password ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div>
                                <h5>Password</h5>
                                <input type="password" name="password" onChange={this.onChange} />
                            </div>
                        </div>
                        <a href="/">Forgot your password?</a>
                        <p className="error-message ">{errorMessage}</p>
                        <input type="button" className="btn" value="Sign In" onClick={this.signIn} />
                        <p>You don't have an account? <a href="/sign-up">Sign Up!</a></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(SignIn);
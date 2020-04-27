import React, { Component } from "react";
import axios from "axios";

class SignIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            email: undefined,
            password: undefined,
            repassword: undefined,
            errorMessage: undefined
        }

        this.signUp = this.signUp.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    signUp() {
        let { history } = this.props;

        if (this.state.username && this.state.email && this.state.password && this.state.repassword) {
            if (this.state.password === this.state.repassword) {

                const userData = {
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password
                }

                axios.post("api/create", userData, {
                    headers: {
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                })
                .then(response => history.push("/sign-in"))
                .catch(error => {
                    this.setState({
                        errorMessage: "Something went wrong!"
                    })
                });
            } else {
                this.setState({
                    errorMessage: "Passwords don't match!"
                })
            }
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

        let { username, email, password, repassword } = this.state;

        return (
            <div className="container">
                <div className="signin-container">
                    <h1>Create an account!</h1>
                    <form>
                        <div className={`inputs email ${username ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <h5>Username</h5>
                                <input type="text" name="username" onChange={this.onChange} />
                            </div>
                        </div>
                        <div className={`inputs email ${email ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-at"></i>
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
                        <div className={`inputs pass ${repassword ? "focus" : ""}`}>
                            <div className="i">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div>
                                <h5>Confirm Password</h5>
                                <input type="password" name="repassword" onChange={this.onChange} />
                            </div>
                        </div>
                        <p className="error-message ">{this.state.errorMessage}</p>
                        <input type="button" className="btn" value="Sign Up" onClick={this.signUp} />
                        <p>Already have an account? <a href="/sign-in">Sign In!</a></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignIn;
import React, {Component} from 'react';
import { Redirect } from "react-router-dom";

class App extends Component {

    render() {
        const redirect = sessionStorage.getItem("token") === null;

        if(redirect) {
            return (<Redirect to='/sign-in' />);
        } else {
            return (<Redirect to='/home' />);
        }
    }
}

export default App;
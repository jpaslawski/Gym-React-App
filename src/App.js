import React, {Component} from 'react';
import { Redirect } from "react-router-dom";

class App extends Component {

    state = {
        redirect: false
    };

    componentDidMount() {
        if(!sessionStorage.getItem('token')) {
            this.setState({
                redirect: true
            })
        }
    }

    render() {

        if(this.state.redirect) {
            return (<Redirect to='sign-in' />);
        } else {
            return (<Redirect to='home' />);
        }
    }
}

export default App;
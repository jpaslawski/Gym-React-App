import React, {Component} from "react";
import { Redirect } from "react-router-dom";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

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
    }

        return (
            <div className="main-content">
                <h1>Home</h1>
            </div>
        );
    }
}

export default Home;
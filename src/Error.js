import React, {Component} from "react";

class Error extends Component {

    render() {
        return (
            <div className="main-content error">
                <h1>{this.props.errorCode}</h1>
                <h2>{this.props.errorInfo}</h2>
                <h3>{this.props.errorEnd}</h3>
            </div>
        )
    }
}

export default Error;
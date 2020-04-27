import React, {Component} from "react";

import LoadingGif from '../assets/loader.gif'

class FullPageLoader extends Component {
    state = {};

    render() {
        return (
            <div className="main-content">
                <div className="loader-container">
                    <div className="loader">
                        <img alt="loading" src={LoadingGif}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default FullPageLoader;
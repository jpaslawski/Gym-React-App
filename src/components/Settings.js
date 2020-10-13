import React, {Component} from "react";

class Settings extends Component {
    render() {
        let language = sessionStorage.getItem("language");

        return (
            <div className="main-content">
                <div className="pageLabel">
                    <h1>{language === "EN" ? "Settings" : "Ustawienia"}</h1>
                </div>
            </div>
        );
    }
}

export default Settings;
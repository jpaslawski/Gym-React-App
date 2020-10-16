import React, {Component} from "react";
import { LANGUAGE } from "../constants";

class Settings extends Component {
    render() {
        const language = sessionStorage.getItem("language");

        return (
            <div className="main-content">
                <div className="pageLabel">
                    <h1>{language === LANGUAGE.english ? "Settings" : "Ustawienia"}</h1>
                </div>
                <div className="card">
                    <h4>{language === LANGUAGE.english ? "User Preferences" : "Preferencje użytkownika"}</h4>
                    <h5>{language === LANGUAGE.english ? "Application Layout:" : "Wygląd aplikacji:"}</h5>
                    <select>
                        <option>{language === LANGUAGE.english ? "Card" : "Kafelkowy"}</option>
                        <option>{language === LANGUAGE.english ? "Table" : "Tabelaryczny"}</option>
                    </select>
                    <h5>{language === LANGUAGE.english ? "Default Language:" : "Język domyślny:"}</h5>
                    <select>
                        <option>{language === LANGUAGE.english ? "Polish" : "Polski"}</option>
                        <option>{language === LANGUAGE.english ? "English" : "Angielski"}</option>
                    </select>
                    <h5>{language === LANGUAGE.english ? "Units of Measure:" : "Jednostki miary:"}</h5>
                    <select>
                        <option>{language === LANGUAGE.english ? "European" : "Europejskie"}</option>
                        <option>{language === LANGUAGE.english ? "American" : "Amerykańskie"}</option>
                    </select>

                    <div className="center-content">
                        <button style={{"margin-top":"20px"}}>{language === LANGUAGE.english ? "Save" : "Zapisz"}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;
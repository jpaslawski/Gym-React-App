import React from 'react';
import PropTypes from 'prop-types';

const { LANGUAGE, STATUS, USER_ROLE } = require("../../constants");

const MealTable = ({ meals, selectedItem, setUpdateMode, selectMeal }) => {

    let language = sessionStorage.getItem("language");
    let userRole = sessionStorage.getItem("role");

    const setMeal = (id, name, namePL, calories, protein, carbs, fat, portionWeight, status) => {
        const meal = {
            id: id,
            name: name,
            namePL: namePL,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            portionWeight: portionWeight,
            status: status
        }

        return meal;
    }

    return meals.length ? (
        <table>
            <thead>
                <tr>
                    <th>{language === LANGUAGE.english ? "Name" : "Nazwa"}</th>
                    <th><span className="shorten">{language === LANGUAGE.english ? "Calories" : "Kalorie"}</span></th>
                    <th><span className="shorten">{language === LANGUAGE.english ? "Protein" : "Białko"}</span></th>
                    <th className="carbs-col"><span className="shorten">{language === LANGUAGE.english ? "Carbs" : "Węglowodany"}</span></th>
                    <th><span className="shorten">{language === LANGUAGE.english ? "Fat" : "Tłuszcze"}</span></th>
                    <th>{language === LANGUAGE.english ? "Portion Weight" : "Waga porcji"}</th>
                    { (userRole === USER_ROLE.admin || (selectedItem === "user" && meals)) && <th>
                        <span className="shorten">{language === LANGUAGE.english ? "Actions" : "Działanie"}</span>
                    </th>}
                </tr>
            </thead>
            <tbody>
                { meals.map(({ id, name, namePL, calories, protein, carbs, fat, portionWeight, status }) => (
                    <tr key={id}>
                        <td key={name}>{(language === LANGUAGE.polish && namePL !== "") ? namePL : name}</td>
                        <td key={"calories"}>{calories} kcal</td>
                        <td key={"protein"}>{protein} g</td>
                        <td key={"carbs"}>{carbs} g</td>
                        <td key={"fat"}>{fat} g</td>
                        <td key={portionWeight}>{portionWeight} g</td>
                        { (userRole === USER_ROLE.admin || status === STATUS.private) && <td key={status} className="action-group">
                            <a href="#modal">
                                <button className="update-btn" onClick={ setUpdateMode.bind(this, name, namePL, calories, protein, carbs, fat, portionWeight, id) }>
                                    <i className="fas fa-pen" title={language === LANGUAGE.english ? "Edit" : "Aktualizuj"}></i>
                                </button>
                            </a>
                            <a href="#modal-delete">
                                <button className="error-btn" onClick={ selectMeal.bind(this, setMeal(id, name, calories, protein, carbs, fat, portionWeight, status)) }>
                                    <i className="fas fa-times" title={language === LANGUAGE.english ? "Delete" : "Usuń"}></i>
                                </button>
                            </a>
                            {status === STATUS.private && <a href="#modal-share">
                                <button className="share-btn" onClick={ selectMeal.bind(this, setMeal(id, name, calories, protein, carbs, fat, portionWeight, status)) }>
                                    <i className="fas fa-share" title={language === LANGUAGE.english ? "Share" : "Udostępnij"}></i>
                                </button>
                            </a>}
                            {status === STATUS.pending && <a href="#modal-manage">
                                <button className="share-btn" onClick={ selectMeal.bind(this, setMeal(id, name, calories, protein, carbs, fat, portionWeight, status)) }>
                                    <i className="fas fa-hand-pointer" title={language === LANGUAGE.english ? "Manage" : "Rozpatrz"}></i>
                                </button>
                            </a>}
                        </td>}
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
            <div className="no-content">
                {language === LANGUAGE.english ?
                    "No meals found! Add some by clicking the button down below..." : "Nie znaleziono żadnych posiłków! Możesz dodać posiłek za pomocą poniższego przycisku..."}
            </div>
        );
};

MealTable.propTypes = {
    meals: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        calories: PropTypes.number,
        protein: PropTypes.number,
        carbs: PropTypes.number,
        fat: PropTypes.number,
        portionWeight: PropTypes.number,
        status: PropTypes.string,
    }))
};

MealTable.defaultProps = {
    meals: [],
}

export default MealTable;
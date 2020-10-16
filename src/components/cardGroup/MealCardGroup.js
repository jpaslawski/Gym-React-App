import React from 'react';
import PropTypes from 'prop-types';

const { LANGUAGE, STATUS, USER_ROLE } = require("../../constants");

const MealCardGroup = ({ meals, setUpdateMode, selectMeal }) => {

    let language = sessionStorage.getItem("language");
    let userRole = sessionStorage.getItem("role");

    const setMeal = (id, name, calories, protein, carbs, fat, portionWeight, status) => {
        const meal = {
            id: id,
            name: name,
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
        <div className="card-container">
            { meals.map(({ id, name, calories, protein, carbs, fat, portionWeight, status }) => (
                <div className="card" key={id}>
                    <div className="card-info">
                        <h4>{name}</h4>
                        <div className="meal-card-info">
                            <h5>Calories: {calories}g</h5>
                            <h5>Protein: {protein}g</h5>
                            <h5>Carbs: {carbs}g</h5>
                            <h5>Fat: {fat}g</h5>
                            <h5>Portion Weight: {portionWeight}g</h5>
                        </div>
                    </div>
                    { (userRole === USER_ROLE.admin || status === STATUS.private) && <div className="card-buttons">
                        <a href="#modal">
                            <button className="update-btn" onClick={ setUpdateMode.bind(this, name, calories, protein, carbs, fat, portionWeight, id) }>
                                {language === LANGUAGE.english ? "Edit" : "Aktualizuj"}
                            </button>
                        </a>
                        <a href="#modal-delete">
                            <button className="error-btn" onClick={ selectMeal.bind(this, setMeal(id, name, calories, protein, carbs, fat, portionWeight, status)) }>
                                {language === LANGUAGE.english ? "Delete" : "Usuń"}
                            </button>
                        </a>
                    </div>}
                </div>
            ))}
        </div>
    ) : (
            <div className="no-content">
                {language === LANGUAGE.english ?
                    "No meals found! Add some by clicking the button down below..." : "Nie znaleziono żadnych posiłków! Możesz dodać posiłek za pomocą poniższego przycisku..."}
            </div>
        );
};

MealCardGroup.propTypes = {
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

MealCardGroup.defaultProps = {
    meals: [],
}

export default MealCardGroup;
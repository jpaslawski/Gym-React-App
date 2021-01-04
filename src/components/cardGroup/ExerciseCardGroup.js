import React from 'react';
import PropTypes from 'prop-types';
import { extractCategory } from '../../Helpers';

const { LANGUAGE, STATUS, USER_ROLE } = require("../../constants");

const ExerciseCardGroup = ({ exercises, history, setUpdateMode, selectExercise }) => {

    const redirectToExerciseDetails = (exerciseId) => {
        history.push("/exercises/" + exerciseId);
        window.location.reload();
    }

    const language = sessionStorage.getItem("language");
    const userRole = sessionStorage.getItem("role");

    return exercises.length ? (
        <div className="card-container">
            { exercises.map(({ id, name, namePL, info, infoPL, exerciseCategory, status }) => (
                <div className="card" key={id}>
                    <div className="card-info">
                        <h4 className="category">{extractCategory(exerciseCategory)}</h4>
                        <h4>{(language === LANGUAGE.polish && namePL !== "") ? namePL : name}</h4>
                        <h5>{(language === LANGUAGE.polish && infoPL !== "") ? infoPL : info}</h5>
                    </div>
                    <div className="card-buttons">
                        <button className="details-btn" onClick={ redirectToExerciseDetails.bind(this, id) }>
                            {language === LANGUAGE.english ? "Details" : "Szczegóły"}
                        </button>
                        {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal">
                            <button className="update-btn" onClick={ setUpdateMode.bind(name, info, extractCategory(exerciseCategory), id) }>
                                {language === LANGUAGE.english ? "Edit" : "Aktualizuj"}
                            </button>
                        </a>}
                        {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal-delete">
                            <button className="error-btn" onClick={ selectExercise.bind(this, id) }>
                                {language === LANGUAGE.english ? "Delete" : "Usuń"}
                            </button>
                        </a>}
                        { status === STATUS.private && <a href="#modal-share">
                            <button className="share-btn" onClick={ selectExercise.bind(this, id) }>
                                {language === LANGUAGE.english ? "Share" : "Udostępnij"}
                            </button>
                        </a>}
                        {(userRole === USER_ROLE.admin && status === STATUS.pending) && <a href="#modal-manage">
                            <button className="share-btn" onClick={ selectExercise.bind(this, id) }>
                                {language === LANGUAGE.english ? "Manage" : "Rozpatrz"}
                            </button>
                        </a>}
                    </div>
                </div>
            ))}
        </div>
    ) : (
            <div className="no-content">
                {language === LANGUAGE.english ?
                    "No exercises found! Add some by clicking the button down below..." : "Nie znaleziono żadnych ćwiczeń! Możesz dodać ćwiczenie za pomocą poniższego przycisku..."}
            </div>
        );
};

ExerciseCardGroup.propTypes = {
    exercises: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        info: PropTypes.string,
        exerciseCategory: PropTypes.object,
        status: PropTypes.string,
    }))
};

ExerciseCardGroup.defaultProps = {
    exercises: [],
}

export default ExerciseCardGroup;
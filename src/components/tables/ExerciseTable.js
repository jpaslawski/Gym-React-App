import React from 'react';
import PropTypes from 'prop-types';
import { extractCategory } from '../../Helpers';

const { LANGUAGE, STATUS, USER_ROLE } = require("../../constants");

const ExerciseTable = ({ exercises, history, setUpdateMode, selectExercise }) => {

    const redirectToExerciseDetails = (exerciseId) => {
        history.push("/exercises/" + exerciseId);
        window.location.reload();
    }

    const language = sessionStorage.getItem("language");
    const userRole = sessionStorage.getItem("role");

    return exercises.length ? (
        <table>
            <thead>
                <tr>
                    <th>{language === LANGUAGE.english ? "Exercise name" : "Nazwa ćwiczenia"}</th>
                    <th>{language === LANGUAGE.english ? "Additional Information" : "Dodatkowe informacje"}</th>
                    <th>{language === LANGUAGE.english ? "Category" : "Kategoria"}</th>
                    <th>{language === LANGUAGE.english ? "Actions" : "Działania"}</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map(({ id, name, namePL, info, infoPL, exerciseCategory, status }) => (
                    <tr key={id}>
                        <td key={name}>{(language === LANGUAGE.polish && namePL !== "") ? namePL : name}</td>
                        <td key={info} className="info-column">{(language === LANGUAGE.polish && infoPL !== "") ? infoPL : info}</td>
                        <td key={exerciseCategory}>{language === LANGUAGE.polish ? exerciseCategory.categoryPL : exerciseCategory.category}</td>
                        <td key={status} className="action-group">
                            <button className="details-btn" onClick={redirectToExerciseDetails.bind(this, id)}><i className="fas fa-info" title={language === LANGUAGE.english ? "Details" : "Szczegóły"}></i></button>
                            {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal-edit">
                                <button className="update-btn" onClick={setUpdateMode.bind(name, info, extractCategory(exerciseCategory), id)}>
                                    <i className="fas fa-pen" title={language === LANGUAGE.english ? "Edit" : "Aktualizuj"}></i>
                                </button>
                            </a>}
                            {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal-delete">
                                <button className="error-btn" onClick={selectExercise.bind(this, id)}>
                                    <i className="fas fa-times" title={language === LANGUAGE.english ? "Delete" : "Usuń"}></i>
                                </button>
                            </a>}
                            { status === STATUS.private && <a href="#modal-share">
                                <button className="share-btn" onClick={ selectExercise.bind(this, id) }>
                                    <i className="fas fa-share" title={language === LANGUAGE.english ? "Share" : "Udostępnij"}></i>
                                </button>
                            </a>}
                            {(userRole === USER_ROLE.admin && status === STATUS.pending) && <a href="#modal-manage">
                                <button className="share-btn" onClick={ selectExercise.bind(this, id) }>
                                    <i className="fas fa-hand-pointer" title={language === LANGUAGE.english ? "Manage" : "Rozpatrz"}></i>
                                </button>
                            </a>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
            <div className="no-content">
                {language === LANGUAGE.english ?
                    "No exercises found! Add some by clicking the button down below..." : "Nie znaleziono żadnych ćwiczeń! Możesz dodać ćwiczenie za pomocą poniższego przycisku..."}
            </div>
        );
};

ExerciseTable.propTypes = {
    exercises: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        info: PropTypes.string,
        exerciseCategory: PropTypes.object,
        status: PropTypes.string,
    }))
};

ExerciseTable.defaultProps = {
    exercises: [],
}

export default ExerciseTable;
import React from 'react';
import PropTypes from 'prop-types';

const { LANGUAGE, STATUS, USER_ROLE } = require("../../constants");

const WorkoutTable = ({ workouts, setUpdateMode, selectWorkout, history }) => {

    const redirectToWorkoutDetails = (workoutId) => {
        history.push("/workouts/" + workoutId);
        window.location.reload();
    }

    const language = sessionStorage.getItem("language");
    const userRole = sessionStorage.getItem("role");

    return workouts.length ? (
        <table>
            <thead>
                <tr>
                    <th>{language === LANGUAGE.english ? "Name" : "Nazwa"}</th>
                    <th>{language === LANGUAGE.english ? "Info" : "Dodatkowe informacje"}</th>
                    <th>{language === LANGUAGE.english ? "Exercise Amount" : "Liczba ćwiczeń"}</th>
                    <th>{language === LANGUAGE.english ? "Actions" : "Działania"}</th>
                </tr>
            </thead>
            <tbody>
                {workouts && workouts.map(({ id, name, info, exerciseAmount, status }) => (
                    <tr key={id}>
                        <td key={name}>{name}</td>
                        <td key={info}>{info}</td>
                        <td key={exerciseAmount}>{exerciseAmount}</td>
                        <td key={status} className="action-group">
                            <button className="details-btn" onClick={ redirectToWorkoutDetails.bind(this, id) }>
                                <i className="fas fa-info" title={language === LANGUAGE.english ? "Details" : "Szczegóły"}></i>
                            </button>
                            {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal">
                                <button className="update-btn" onClick={ setUpdateMode.bind(this, name, info, id) }>
                                    <i className="fas fa-pen" title={language === LANGUAGE.english ? "Edit" : "Aktualizuj"}></i>
                                </button>
                            </a>}
                            {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal-delete">
                                <button className="error-btn" onClick={ selectWorkout.bind(this, id) }>
                                    <i className="fas fa-times" title={language === LANGUAGE.english ? "Delete" : "Usuń"}></i>
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
                "No workouts found! Add some by clicking the button down below..." : "Nie znaleziono żadnych treningów! Możesz dodać trening za pomocą poniższego przycisku..."}
        </div>
    );
};

WorkoutTable.propTypes = {
    workouts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        info: PropTypes.string,
        exerciseAmount: PropTypes.number,
        status: PropTypes.string,
    }))
};

WorkoutTable.defaultProps = {
    workouts: [],
}

export default WorkoutTable;
import React from 'react';
import PropTypes from 'prop-types';

const { LANGUAGE, STATUS, USER_ROLE } = require("../../constants");

const WorkoutCardGroup = ({ workouts, setUpdateMode, selectWorkout, history }) => {

    const redirectToWorkoutDetails = (workoutId) => {
        history.push("/workouts/" + workoutId);
        window.location.reload();
    }

    const language = sessionStorage.getItem("language");
    const userRole = sessionStorage.getItem("role");

    return workouts.length ? (
        <div className="card-container">
            { workouts.map(({ id, name, namePL, info, infoPL, exerciseAmount, status }) => (
                <div className="card" key={id}>
                    <div className="card-info">
                        <h4 className="category">{language === LANGUAGE.english ? "Exercises" : "Ćwiczenia"}: {exerciseAmount}</h4>
                        <h4>{(language === LANGUAGE.polish && namePL !== "") ? namePL : name}</h4>
                        <h5>{(language === LANGUAGE.polish && infoPL !== "") ? infoPL : info}</h5>
                    </div>
                    <div className="card-buttons">
                        <button className="details-btn" onClick={ redirectToWorkoutDetails.bind(this, id) }>
                            {language === LANGUAGE.english ? "Details" : "Szczegóły"}
                        </button>
                        {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal">
                            <button className="update-btn" onClick={ setUpdateMode.bind(this, id) }>
                                {language === LANGUAGE.english ? "Edit" : "Aktualizuj"}
                            </button>
                        </a>}
                        {(userRole === USER_ROLE.admin || status === STATUS.private) && <a href="#modal-delete">
                            <button className="error-btn" onClick={ selectWorkout.bind(this, id) }>
                                {language === LANGUAGE.english ? "Delete" : "Usuń"}
                            </button>
                        </a>}
                        { status === STATUS.private && <a href="#modal-share">
                            <button className="share-btn" onClick={ selectWorkout.bind(this, id) }>
                                {language === LANGUAGE.english ? "Share" : "Udostępnij"}
                            </button>
                        </a>}
                        {(userRole === USER_ROLE.admin && status === STATUS.pending) && <a href="#modal-manage">
                            <button className="share-btn" onClick={ selectWorkout.bind(this, id) }>
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
                    "No workouts found! Add some by clicking the button down below..." : "Nie znaleziono żadnych treningów! Możesz dodać trening za pomocą poniższego przycisku..."}
            </div>
        );
};

WorkoutCardGroup.propTypes = {
    workouts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        info: PropTypes.string,
        exerciseAmount: PropTypes.number,
        status: PropTypes.string,
    }))
};

WorkoutCardGroup.defaultProps = {
    workouts: [],
}

export default WorkoutCardGroup;
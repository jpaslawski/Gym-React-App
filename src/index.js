import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './animations.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Users from "./components/Users";
import Exercises from "./components/Exercises";
import Diet from "./components/Diet";
import Settings from "./components/Settings";
import Home from "./components/Home";
import WorkoutDetails from "./components/WorkoutDetails";
import ExerciseDetails from "./components/ExerciseDetails";
import Workouts from "./components/Workouts";
import Header from "./Header";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Meals from "./components/Meals";
import Profile from "./components/Profile";
import axios from "axios";



axios.defaults.baseURL = "https://127.0.0.1:8443/";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "http://localhost:8000";
axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token");
axios.defaults.headers.common['Content-Type'] = "application/json; charset=utf-8";


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route exact path="/sign-in" component={SignIn} />
                <Route exact path="/sign-up" component={SignUp} />
                <Fragment>
                    <Header />
                    <Route exact path="/administration/users" component={Users} />
                    <Route exact path={["/dashboard/exercises", "/administration/exercises"]} component={Exercises} />
                    <Route exact path="/exercises/:exerciseId" component={ExerciseDetails} />
                    <Route exact path="/administration/meals" component={Meals} />
                    <Route exact path="/administration/diet" component={Diet} />
                    <Route exact path="/administration/settings" component={Settings} />
                    <Route exact path="/dashboard/profile" component={Profile} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/workouts/:workoutId" component={WorkoutDetails} />
                    <Route path={["/dashboard/workouts", "/administration/workouts"]} component={Workouts} />
                    <Route exact path="/" component={App} />
                </Fragment>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();

import React, {Component} from "react";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Error from "../Error";

class Exercises extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercises: [],
            isLoaded: false,
            errorStatusCode: undefined,
            errorMessage: undefined
        };
    }

    extractCategory(object) {
        if (object == null) {
            return "-";
        }
        let json = JSON.stringify(object);
        return JSON.parse(json).category;
    }

    componentDidMount() {
        axios.get("api/exercises")
            .then(response => this.setState({
                exercises: response.data,
                isLoaded: true
            }))
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    errorStatusCode: error.response.status,
                    errorMessage: error.response.statusText
                })
            });
    }

    render() {

        let { isLoaded, errorStatusCode } = this.state;

        if (!isLoaded) {
            return <FullPageLoader/>;
        } else if (errorStatusCode) {
            return <Error errorCode={this.state.errorStatusCode} errorInfo={this.state.errorMessage} errorEnd={"Try again later!"} />;
        } else {
            return (
                <div className="main-content">
                    <h1>Exercises</h1>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Exercise name</th>
                            <th>Additional Information</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.exercises.map((exercise) => (
                            <tr key={exercise.uniqueId}>
                                <td key={exercise.uniqueId}>{exercise.id}</td>
                                <td key={exercise.uniqueId}>{exercise.name}</td>
                                <td key={exercise.uniqueId}>{exercise.info}</td>
                                <td key={exercise.uniqueId}>
                                    {this.extractCategory(exercise.category)}
                                </td>
                                <td key={exercise.uniqueId}>
                                    <button>Details</button>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

export default Exercises;
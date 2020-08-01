import React from "react";

const ProgressBar = (props) => {

    const [style, setStyle] = React.useState({});

    const backgrounds = [
        `linear-gradient(to left, #0001ff, #3399ff)`,
        `linear-gradient(to left, #F2709C, #FF9472)`,
        `linear-gradient(to left, #009933, #33cc33)`

    ]

    setTimeout(() => {
        const newStyle = {
            background: backgrounds[props.background],
            opacity: 1,
            width: `${props.percentage}%`
        }

        setStyle(newStyle);
    }, 500);

    return (
        <div className="progress">
            <div className="progress-percentage" style={ style }>
                {props.percentage > 15 && `${props.percentage}%`}
            </div>
        </div>
    )
}

export default ProgressBar;
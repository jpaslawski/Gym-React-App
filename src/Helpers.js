const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

export default function transformDate(theDate) {
    let newDateFormat;
    let date = new Date(theDate);

    let dayOfWeek = dayNames[date.getDay() - 1];
    let day = date.getUTCDate();

    let month = monthNames[date.getMonth()];
    let year = date.getUTCFullYear();
    
    newDateFormat = dayOfWeek + ", " + day + " " + month + " " + year;

    return newDateFormat;
}

export function extractCategory(object) {
    if (object == null) {
        return "-";
    }
    let json = JSON.stringify(object);
    return JSON.parse(json).category;
}
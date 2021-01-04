import { LANGUAGE } from "./constants";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayNamesPL = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthNamesPL = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec","Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

export default function transformDate(theDate, language) {
    let newDateFormat;
    let date = new Date(theDate);

    let dayOfWeek = language === LANGUAGE.polish ? dayNamesPL[date.getDay() - 1] :  dayNames[date.getDay() - 1];
    let day = date.getUTCDate();

    let month = language === LANGUAGE.polish ? monthNamesPL[date.getMonth()] : monthNames[date.getMonth()];
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
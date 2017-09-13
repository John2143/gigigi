//Date string tag
export function dateToString(str, date = new Date()){
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let daysLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthsLong = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let d = {
        a: days[date.getDay()],
        A: daysLong[date.getDay()],
        b: months[date.getMonth()],
        B: monthsLong[date.getMonth()],
        d: date.getDate(),
        h: months[date.getMonth()],
        H: date.getHours(),
        I: date.getHours(),
        p: date.getHours() > 11 ? "PM" : "AM",
        w: date.getDay(),
        S: date.getSeconds(),
        M: date.getMinutes(),
    };

    if(d.I == 0) d.I = 12;
    else if(d.I > 12) d.I -= 12;
    d.r = `${d.I}:${d.M}:${d.S} ${d.p}`;

    return str.split("").map(x => d[x] || x).join("");
}

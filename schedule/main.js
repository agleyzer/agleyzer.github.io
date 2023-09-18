// Function to create a class card
function createClassCard(classData) {
    const card = document.createElement("div");
    card.className = "class-card";

    card.innerHTML = `
        <div class="subject">${classData.subject}</div>
        ${classData.start_time} - ${classData.end_time}, 
        ${classData.teacher} in ${classData.room}
        `;
    return card;
}

function calculateScheduleDay(currentDate) {
    const startDate = new Date('2023-09-04');
    const currentDateUTC = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );
    const startDateUTC = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((currentDateUTC - startDateUTC) / millisecondsPerDay);

    // Calculate the schedule day based on the two-week cycle, starting from 0
    let scheduleDay = daysDiff % 14;

    if (scheduleDay == 5 || scheduleDay == 6 || scheduleDay == 12 || scheduleDay == 13) {
        return -1;
    }
    if (scheduleDay >= 7 && scheduleDay <= 11) {
        return scheduleDay - 2;
    }

    return scheduleDay;
}

function isCurrentTimeAfter(targetTime) {
    const [targetHour, targetMinute] = targetTime.split(':').map(Number);

    // Create a new Date object for the current date with the target time
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), targetHour, targetMinute);

    // Compare the current time with the target time
    return currentDate > targetDate;
}

// Function to display the schedule
function displaySchedule() {
    const dateHeader = document.getElementById("date-header")
    dateHeader.innerHTML = formatHeaderDate(currentDate);

    const classContainer = document.getElementById("class-container");
    while (classContainer.firstChild) {
        classContainer.removeChild(classContainer.firstChild);
    }

    const holiday = findHoliday(currentDate);
    const scheduleDay = calculateScheduleDay(currentDate);

    if (scheduleDay == -1) {
        classContainer.innerHTML += `<div class="subject">YAY NO SCHOOL!!!</div>`;
    } else if (holiday && holiday.school_closed) {
        classContainer.innerHTML += `<div class="subject">YAY ${holiday.description.toUpperCase()}!!!</div>`;
    } else {
        const classes = schedule[scheduleDay];
        // dateHeader.innerHTML += ` ${scheduleDay+1}`;
        // Create class cards for each class and append them to the day container
        classes.forEach(classData => {
            const classCard = createClassCard(classData);
            classContainer.appendChild(classCard);
        });
    }
}

function calculateScheduleDay(currentDate) {
    const startDate = new Date('2023-09-04T00:00:00-04:00');

    const currentDateUTC = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );

    const startDateUTC = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((currentDateUTC - startDateUTC) / millisecondsPerDay);

    // Calculate the schedule day based on the two-week cycle, starting from 0
    let scheduleDay = daysDiff % 14;

    if (scheduleDay == 5 || scheduleDay == 6 || scheduleDay == 12 || scheduleDay == 13) {
        return -1;
    }
    if (scheduleDay >= 7 && scheduleDay <= 11) {
        return scheduleDay - 2;
    }

    return scheduleDay;
}

document.addEventListener("keydown", function (event) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (event.key === "ArrowLeft") {
        currentDate = new Date(currentDate.getTime() - oneDayInMilliseconds);
        displaySchedule(schedule);
    }
    if (event.key === "ArrowRight") {
        currentDate = new Date(currentDate.getTime() + oneDayInMilliseconds);
        displaySchedule(schedule);
    }
});

function formatHeaderDate(date) {
    // Define the names of months and days
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Extract date components
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${dayOfWeek} ${month} ${day}`;
}

function isToday(date) {
    today = new Date();
    return (date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate())
}

function findHoliday(date) {
    const formattedDate = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });

    const entry = schoolCalendar.find((item) => item.date === formattedDate);

    return entry;
}

let currentDate = new Date();

const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

setInterval(function () {
    if (isToday(currentDate)) {
        currentDate = new Date();
        displaySchedule()
    }
}, 1000);

document.addEventListener("DOMContentLoaded", function () {
    displaySchedule();
    if ('serviceWorker' in navigator) {   
        console.log("registering service workers");
        navigator.serviceWorker.register("serviceworker.js");
    }
});

window.addEventListener('focus', function () {
    currentDate = new Date();
    displaySchedule();
});

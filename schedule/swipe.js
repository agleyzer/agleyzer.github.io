// SWIPE CONTROL

let startX = null;
let startY = null;

// Threshold for swipe distance (adjust as needed)
const swipeThreshold = 50;

let lastTapTime = 0;
const doubleTapDelay = 300; // Adjust this value to control the double-tap speed (in milliseconds).

document.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

document.addEventListener("touchmove", function (event) {
    if (!startX || !startY) {
        return;
    }

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;

    const deltaX = startX - currentX;
    const deltaY = startY - currentY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
    }
});

document.addEventListener("touchend", function (event) {
    if (!startX || !startY) {
        return;
    }

    const currentX = event.changedTouches[0].clientX;
    const deltaX = startX - currentX;

    if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
            // Right to left swipe (left swipe)
            handleLeftSwipe();
        } else {
            // Left to right swipe (right swipe)
            handleRightSwipe();
        }
    } else {
        // double tap?
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double tap detected.
            currentDate = new Date();
            displaySchedule(schedule);
            event.preventDefault(); // Prevent the default action, such as zooming.
        }

        lastTapTime = currentTime;
    }

    startX = null;
    startY = null;
});

function handleLeftSwipe() {
    currentDate = new Date(currentDate.getTime() + oneDayInMilliseconds);
    displaySchedule(schedule);
}

function handleRightSwipe() {
    currentDate = new Date(currentDate.getTime() - oneDayInMilliseconds);
    displaySchedule(schedule);
}
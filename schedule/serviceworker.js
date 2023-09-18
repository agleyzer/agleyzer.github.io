self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open("v1")
            .then((cache) =>
                cache.addAll([
                    "index.html",
                    "main.js",
                    "calendar.js",
                    "swipe.js",
                    "icon.png"
                ]),
            ),
    );
});
```javascript
/* ============================================================
   KUSUU × NAAGII
   BOYFRIEND'S DAY VINTAGE MAGAZINE
   SCRIPT.JS
============================================================ */


/* ============================================================
   01 — ELEMENTS
============================================================ */

const loadingScreen = document.getElementById("loading-screen");
const book = document.getElementById("book");

const pages = Array.from(
    document.querySelectorAll(".page")
);

const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");

const pageCounter = document.getElementById("page-counter");

const totalPages = pages.length;


/* ============================================================
   02 — STATE
============================================================ */

let currentPage = 0;

let isTurning = false;

let touchStartX = 0;
let touchStartY = 0;


/* ============================================================
   03 — INITIAL PAGE SETUP
============================================================ */

function setupPages() {

    pages.forEach((page, index) => {

        page.style.zIndex = totalPages - index;

        page.classList.remove("flipped");

    });

    updateCounter();

}


/* ============================================================
   04 — PAGE COUNTER
============================================================ */

function updateCounter() {

    const visiblePage = Math.min(
        currentPage + 1,
        totalPages
    );

    pageCounter.textContent =
        `${visiblePage} / ${totalPages}`;

}


/* ============================================================
   05 — NEXT PAGE
============================================================ */

function nextPage() {

    if (isTurning) {
        return;
    }

    if (currentPage >= totalPages - 1) {
        return;
    }

    isTurning = true;

    const page = pages[currentPage];

    page.classList.add("flipped");

    currentPage++;

    updateCounter();

    setTimeout(() => {

        isTurning = false;

    }, 1000);

}


/* ============================================================
   06 — PREVIOUS PAGE
============================================================ */

function previousPage() {

    if (isTurning) {
        return;
    }

    if (currentPage <= 0) {
        return;
    }

    isTurning = true;

    currentPage--;

    const page = pages[currentPage];

    page.classList.remove("flipped");

    updateCounter();

    setTimeout(() => {

        isTurning = false;

    }, 1000);

}


/* ============================================================
   07 — BUTTONS
============================================================ */

nextButton.addEventListener(
    "click",
    nextPage
);

previousButton.addEventListener(
    "click",
    previousPage
);


/* ============================================================
   08 — CLICK ON PAGE
============================================================ */

book.addEventListener(
    "click",
    function (event) {

        /*
            Don't turn the page when clicking:
            - buttons
            - video controls
            - music buttons
            - links
        */

        if (
            event.target.closest("button") ||
            event.target.closest("video") ||
            event.target.closest("audio")
        ) {

            return;

        }

        const rect =
            book.getBoundingClientRect();

        const clickX =
            event.clientX - rect.left;

        const half =
            rect.width / 2;


        if (clickX > half) {

            nextPage();

        } else {

            previousPage();

        }

    }
);


/* ============================================================
   09 — TOUCH START
============================================================ */

book.addEventListener(
    "touchstart",
    function (event) {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;

    },
    {
        passive: true
    }
);


/* ============================================================
   10 — TOUCH END
============================================================ */

book.addEventListener(
    "touchend",
    function (event) {

        const touch =
            event.changedTouches[0];

        const touchEndX =
            touch.clientX;

        const touchEndY =
            touch.clientY;

        const differenceX =
            touchEndX - touchStartX;

        const differenceY =
            touchEndY - touchStartY;


        /*
            Ignore mostly vertical swipes.
        */

        if (
            Math.abs(differenceY) >
            Math.abs(differenceX)
        ) {

            return;

        }


        /*
            Minimum swipe distance.
        */

        if (
            Math.abs(differenceX) < 45
        ) {

            return;

        }


        /*
            Swipe left → next page
            Swipe right → previous page
        */

        if (differenceX < 0) {

            nextPage();

        } else {

            previousPage();

        }

    },
    {
        passive: true
    }
);


/* ============================================================
   11 — KEYBOARD CONTROLS
============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "ArrowRight" ||
            event.key === " "
        ) {

            event.preventDefault();

            nextPage();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            previousPage();

        }

    }
);


/* ============================================================
   12 — MUSIC
============================================================ */

const audioPlayer =
    document.getElementById("audio-player");

const musicButtons =
    document.querySelectorAll(".play-song");

const record =
    document.querySelector(".record");


musicButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const song =
                    button.dataset.song;


                /*
                    If the same song is currently playing,
                    pause it.
                */

                if (
                    audioPlayer.src.includes(song) &&
                    !audioPlayer.paused
                ) {

                    audioPlayer.pause();

                    button.textContent = "▶";

                    if (record) {
                        record.classList.remove("playing");
                    }

                    return;

                }


                /*
                    Stop previous buttons.
                */

                musicButtons.forEach(
                    otherButton => {

                        otherButton.textContent = "▶";

                    }
                );


                /*
                    Load selected song.
                */

                audioPlayer.src = song;

                audioPlayer.play()
                    .then(() => {

                        button.textContent = "Ⅱ";

                        if (record) {
                            record.classList.add(
                                "playing"
                            );
                        }

                    })
                    .catch(() => {

                        /*
                            Browser may block
                            playback if the file
                            doesn't exist yet.
                        */

                        button.textContent = "▶";

                    });

            }
        );

    }
);


/* ============================================================
   13 — AUDIO END
============================================================ */

audioPlayer.addEventListener(
    "ended",
    function () {

        musicButtons.forEach(
            button => {

                button.textContent = "▶";

            }
        );

        if (record) {

            record.classList.remove(
                "playing"
            );

        }

    }
);


/* ============================================================
   14 — STOP MUSIC WHEN LEAVING MUSIC PAGE
============================================================ */

function stopMusicWhenLeavingPage() {

    /*
        Music page is page index 8
        because arrays start at 0.
    */

    if (currentPage !== 8) {

        if (
            audioPlayer &&
            !audioPlayer.paused
        ) {

            audioPlayer.pause();

        }

        musicButtons.forEach(
            button => {

                button.textContent = "▶";

            }
        );

        if (record) {

            record.classList.remove(
                "playing"
            );

        }

    }

}


/* ============================================================
   15 — WRAP PAGE FUNCTIONS
============================================================ */

const originalNextPage =
    nextPage;

const originalPreviousPage =
    previousPage;


/*
    Re-check music after page changes.
*/

function nextPageWithMusicCheck() {

    originalNextPage();

    setTimeout(
        stopMusicWhenLeavingPage,
        1000
    );

}


function previousPageWithMusicCheck() {

    originalPreviousPage();

    setTimeout(
        stopMusicWhenLeavingPage,
        1000
    );

}


/*
    Replace button events with
    music-aware functions.
*/

nextButton.onclick = null;
previousButton.onclick = null;

nextButton.addEventListener(
    "click",
    nextPageWithMusicCheck
);

previousButton.addEventListener(
    "click",
    previousPageWithMusicCheck
);


/* ============================================================
   16 — PAGE TURN SOUND
============================================================ */

/*
    A tiny paper-like sound can be added later
    if you upload a page-turn sound.

    For now we don't force audio because browsers
    can block automatic sounds.
*/

function pageTurnFeedback() {

    if (
        navigator.vibrate &&
        window.innerWidth < 700
    ) {

        navigator.vibrate(12);

    }

}


/* ============================================================
   17 — ENHANCE NEXT/PREVIOUS
============================================================ */

const originalNext =
    nextPage;

const originalPrevious =
    previousPage;


function enhancedNextPage() {

    pageTurnFeedback();

    originalNext();

}


function enhancedPreviousPage() {

    pageTurnFeedback();

    originalPrevious();

}


/* ============================================================
   18 — REASSIGN CLICK EVENTS
============================================================ */

nextButton.onclick = enhancedNextPage;

previousButton.onclick =
    enhancedPreviousPage;


/* ============================================================
   19 — PREVENT DOUBLE PAGE TURN
============================================================ */

book.addEventListener(
    "dblclick",
    function (event) {

        event.preventDefault();

    }
);


/* ============================================================
   20 — LOADING SCREEN
============================================================ */

window.addEventListener(
    "load",
    function () {

        setupPages();

        setTimeout(
            function () {

                loadingScreen.classList.add(
                    "hide"
                );

            },
            1400
        );

    }
);


/* ============================================================
   21 — IMAGE ERROR HANDLING
============================================================ */

const allImages =
    document.querySelectorAll("img");


allImages.forEach(
    image => {

        image.addEventListener(
            "error",
            function () {

                /*
                    Keeps the magazine looking
                    intentional until the real
                    GitHub image is uploaded.
                */

                image.style.background =
                    "#d6c5a5";

                image.style.objectFit =
                    "cover";

                image.alt =
                    "Memory photograph";

            }
        );

    }
);


/* ============================================================
   22 — VIDEO ERROR HANDLING
============================================================ */

const videos =
    document.querySelectorAll("video");


videos.forEach(
    video => {

        video.addEventListener(
            "error",
            function () {

                video.style.background =
                    "#171411";

            }
        );

    }
);


/* ============================================================
   23 — PRELOAD IMAGES
============================================================ */

function preloadImages() {

    allImages.forEach(
        image => {

            const source =
                image.getAttribute("src");

            if (!source) {
                return;
            }

            const preload =
                new Image();

            preload.src = source;

        }
    );

}


/* ============================================================
   24 — START PRELOADING
============================================================ */

preloadImages();


/* ============================================================
   25 — PAGE VISIBILITY
============================================================ */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.hidden &&
            audioPlayer &&
            !audioPlayer.paused
        ) {

            audioPlayer.pause();

        }

    }
);


/* ============================================================
   26 — RESIZE HANDLING
============================================================ */

window.addEventListener(
    "resize",
    function () {

        /*
            Keeps the magazine centered
            when phone orientation changes.
        */

        if (
            window.innerWidth < 700
        ) {

            book.style.transform =
                "scale(1)";

        }

    }
);


/* ============================================================
   27 — INITIALIZE
============================================================ */

setupPages();
```

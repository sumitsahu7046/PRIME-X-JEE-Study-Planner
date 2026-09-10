/* =====================================================
   WG PRIME X — JEE COMMAND CENTER
   ===================================================== */


/* =====================================================
   JEE SYLLABUS DATA
   ===================================================== */

const syllabus = [

    /* ================= PHYSICS ================= */

    {
        subject: "Physics",
        chapters: [

            "Units and Measurements",
            "Kinematics",
            "Laws of Motion",
            "Work, Energy and Power",
            "Centre of Mass and System of Particles",
            "Rotational Motion",
            "Gravitation",
            "Properties of Solids",
            "Properties of Fluids",
            "Thermal Properties of Matter",
            "Thermodynamics",
            "Kinetic Theory of Gases",
            "Oscillations",
            "Waves",
            "Electrostatics",
            "Capacitance",
            "Current Electricity",
            "Moving Charges and Magnetism",
            "Magnetism and Matter",
            "Electromagnetic Induction",
            "Alternating Current",
            "Electromagnetic Waves",
            "Ray Optics",
            "Wave Optics",
            "Dual Nature of Matter",
            "Atoms",
            "Nuclei",
            "Semiconductor Electronics",
            "Experimental Physics"

        ]
    },


    /* ================= CHEMISTRY ================= */

    {
        subject: "Chemistry",
        chapters: [

            "Some Basic Concepts of Chemistry",
            "Atomic Structure",
            "Classification of Elements and Periodicity",
            "Chemical Bonding and Molecular Structure",
            "States of Matter",
            "Thermodynamics",
            "Equilibrium",
            "Redox Reactions",
            "Electrochemistry",
            "Chemical Kinetics",
            "Solutions",
            "Surface Chemistry",
            "Hydrogen",
            "s-Block Elements",
            "p-Block Elements",
            "d- and f-Block Elements",
            "Coordination Compounds",
            "General Principles and Processes of Isolation of Metals",
            "Environmental Chemistry",

            "Organic Chemistry — Basic Principles",
            "Hydrocarbons",
            "Haloalkanes and Haloarenes",
            "Alcohols, Phenols and Ethers",
            "Aldehydes, Ketones and Carboxylic Acids",
            "Amines",
            "Biomolecules",
            "Polymers",
            "Chemistry in Everyday Life",

            "Practical Chemistry"

        ]
    },


    /* ================= MATHEMATICS ================= */

    {
        subject: "Mathematics",
        chapters: [

            "Sets",
            "Relations and Functions",
            "Complex Numbers",
            "Quadratic Equations",
            "Sequences and Series",
            "Permutations and Combinations",
            "Binomial Theorem",
            "Mathematical Induction",
            "Trigonometric Ratios and Identities",
            "Trigonometric Equations",
            "Straight Lines",
            "Circle",
            "Parabola",
            "Ellipse",
            "Hyperbola",
            "Limits",
            "Continuity",
            "Differentiability",
            "Application of Derivatives",
            "Indefinite Integration",
            "Definite Integration",
            "Area Under Curves",
            "Differential Equations",
            "Matrices",
            "Determinants",
            "Vector Algebra",
            "Three Dimensional Geometry",
            "Statistics",
            "Probability",
            "Mathematical Reasoning"

        ]
    }

];


/* =====================================================
   STORAGE
   ===================================================== */

const STORAGE_KEY = "WG_PRIME_X_SYLLABUS";

const DAILY_KEY = "WG_PRIME_X_DAILY";

const MOCK_KEY = "WG_PRIME_X_MOCKS";

const NOTES_KEY = "WG_PRIME_X_NOTES";

const STREAK_KEY = "WG_PRIME_X_STREAK";


/* =====================================================
   STATE
   ===================================================== */

let completedChapters =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || {};

let dailyStates =
    JSON.parse(
        localStorage.getItem(DAILY_KEY)
    ) || [false, false, false, false];

let mocks =
    JSON.parse(
        localStorage.getItem(MOCK_KEY)
    ) || [];


/* =====================================================
   CLOCK
   ===================================================== */

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-IN", {
            hour12: false
        });
}

setInterval(updateClock, 1000);

updateClock();


/* =====================================================
   DATE
   ===================================================== */

function updateDate() {

    const now = new Date();

    document.getElementById("todayDate").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short"
        });

}

updateDate();


/* =====================================================
   SYLLABUS RENDER
   ===================================================== */

const syllabusList =
    document.getElementById("syllabusList");


function getAllChapters() {

    const all = [];

    syllabus.forEach(subject => {

        subject.chapters.forEach(chapter => {

            all.push({
                subject: subject.subject,
                chapter: chapter
            });

        });

    });

    return all;
}


function renderSyllabus() {

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase()
            .trim();


    const subjectFilter =
        document.getElementById(
            "subjectFilter"
        ).value;


    const statusFilter =
        document.getElementById(
            "statusFilter"
        ).value;


    syllabusList.innerHTML = "";


    const chapters = getAllChapters();


    let shown = 0;


    chapters.forEach((item, index) => {

        const key =
            `${item.subject}-${item.chapter}`;

        const completed =
            !!completedChapters[key];


        const searchMatch =
            item.chapter
                .toLowerCase()
                .includes(search);


        const subjectMatch =
            subjectFilter === "all" ||
            item.subject === subjectFilter;


        const statusMatch =
            statusFilter === "all" ||
            (statusFilter === "completed" && completed) ||
            (statusFilter === "pending" && !completed);


        if (
            !searchMatch ||
            !subjectMatch ||
            !statusMatch
        ) {
            return;
        }


        shown++;


        const label =
            document.createElement("label");

        label.className =
            "chapter" +
            (completed ? " completed" : "");


        label.innerHTML = `

            <input
                type="checkbox"
                ${completed ? "checked" : ""}
                data-key="${escapeHTML(key)}"
            >

            <span class="chapter-box"></span>

            <div class="chapter-info">

                <strong>
                    ${escapeHTML(item.chapter)}
                </strong>

                <small>
                    ${escapeHTML(item.subject)}
                </small>

            </div>

            <span class="chapter-status">
                ${completed ? "DONE" : "PENDING"}
            </span>

        `;


        const checkbox =
            label.querySelector("input");


        checkbox.addEventListener(
            "change",
            () => {

                completedChapters[key] =
                    checkbox.checked;

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        completedChapters
                    )
                );

                renderSyllabus();

                updateStats();

            }
        );


        syllabusList.appendChild(label);

    });


    if (shown === 0) {

        syllabusList.innerHTML = `
            <div class="empty">
                No chapters found.
            </div>
        `;

    }

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   SYLLABUS STATISTICS
   ===================================================== */

function calculateSubjectProgress(subjectName) {

    const subject =
        syllabus.find(
            item => item.subject === subjectName
        );


    if (!subject) return 0;


    let completed = 0;


    subject.chapters.forEach(chapter => {

        const key =
            `${subjectName}-${chapter}`;

        if (completedChapters[key]) {
            completed++;
        }

    });


    return Math.round(
        (completed / subject.chapters.length) * 100
    );

}


function updateStats() {

    const all = getAllChapters();

    let completed = 0;


    all.forEach(item => {

        const key =
            `${item.subject}-${item.chapter}`;

        if (completedChapters[key]) {
            completed++;
        }

    });


    const overall =
        Math.round(
            (completed / all.length) * 100
        );


    document.getElementById(
        "overallProgress"
    ).textContent =
        overall + "%";


    document.getElementById(
        "syllabusPercent"
    ).textContent =
        overall + "%";


    /* Physics */

    const physics =
        calculateSubjectProgress("Physics");


    document.getElementById(
        "physicsPercent"
    ).textContent =
        physics + "%";


    document.getElementById(
        "physicsBar"
    ).style.width =
        physics + "%";


    /* Chemistry */

    const chemistry =
        calculateSubjectProgress("Chemistry");


    document.getElementById(
        "chemistryPercent"
    ).textContent =
        chemistry + "%";


    document.getElementById(
        "chemistryBar"
    ).style.width =
        chemistry + "%";


    /* Mathematics */

    const mathematics =
        calculateSubjectProgress("Mathematics");


    document.getElementById(
        "mathPercent"
    ).textContent =
        mathematics + "%";


    document.getElementById(
        "mathBar"
    ).style.width =
        mathematics + "%";

}


/* =====================================================
   SEARCH / FILTER
   ===================================================== */

document
    .getElementById("search")
    .addEventListener(
        "input",
        renderSyllabus
    );


document
    .getElementById("subjectFilter")
    .addEventListener(
        "change",
        renderSyllabus
    );


document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        renderSyllabus
    );


/* =====================================================
   SUBJECT TABS
   ===================================================== */

document
    .querySelectorAll(".subject-tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".subject-tab")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add("active");


                const subject =
                    button.dataset.subject;


                document.getElementById(
                    "subjectFilter"
                ).value =
                    subject;


                renderSyllabus();

            }
        );

    });


/* =====================================================
   DAILY TASKS
   ===================================================== */

const dailyTasks =
    document.querySelectorAll(".task input");


function updateDaily() {

    let completed = 0;


    dailyTasks.forEach(
        (task, index) => {

            task.checked =
                !!dailyStates[index];


            if (task.checked) {

                completed++;

                task
                    .closest(".task")
                    .classList.add("done");

            } else {

                task
                    .closest(".task")
                    .classList.remove("done");

            }

        }
    );


    const percentage =
        Math.round(
            (completed / dailyTasks.length) * 100
        );


    document.getElementById(
        "todayProgress"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "dailyPercent"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "dailyBar"
    ).style.width =
        percentage + "%";


    localStorage.setItem(
        DAILY_KEY,
        JSON.stringify(dailyStates)
    );

}


dailyTasks.forEach(
    (task, index) => {

        task.addEventListener(
            "change",
            () => {

                dailyStates[index] =
                    task.checked;

                updateDaily();

                updateStreak();

            }
        );

    }
);


function resetDailyTasks() {

    dailyStates =
        [false, false, false, false];

    localStorage.setItem(
        DAILY_KEY,
        JSON.stringify(dailyStates)
    );

    updateDaily();

}


/* =====================================================
   POMODORO
   ===================================================== */

let timerSeconds = 25 * 60;

let timerInterval = null;


function updateTimer() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    document.getElementById(
        "timer"
    ).textContent =

        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0");

}


function startTimer() {

    if (timerInterval) return;


    timerInterval =
        setInterval(() => {

            if (timerSeconds <= 0) {

                clearInterval(timerInterval);

                timerInterval = null;

                alert(
                    "🔥 FOCUS SESSION COMPLETE!\n\nGreat work. Take a short break."
                );

                timerSeconds =
                    25 * 60;

                updateTimer();

                return;
            }


            timerSeconds--;

            updateTimer();

        }, 1000);

}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}


function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerSeconds =
        25 * 60;

    updateTimer();

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" &&
            event.target.tagName !== "TEXTAREA" &&
            event.target.tagName !== "INPUT"
        ) {

            event.preventDefault();


            if (timerInterval) {

                pauseTimer();

            } else {

                startTimer();

            }

        }

    }
);


/* =====================================================
   MOCK TEST TRACKER
   ===================================================== */

function saveMocks() {

    localStorage.setItem(
        MOCK_KEY,
        JSON.stringify(mocks)
    );

}


function renderMocks() {

    const list =
        document.getElementById("mockList");


    list.innerHTML = "";


    if (mocks.length === 0) {

        list.innerHTML = `
            <div class="empty">
                No mock tests recorded yet.
            </div>
        `;

        document.getElementById(
            "mockCount"
        ).textContent = "0";

        return;

    }


    document.getElementById(
        "mockCount"
    ).textContent =
        mocks.length;


    mocks.forEach(
        (mock, index) => {

            const percentage =
                mock.total > 0
                    ? Math.round(
                        (mock.score / mock.total) * 100
                    )
                    : 0;


            const item =
                document.createElement("div");


            item.className =
                "mock-item";


            item.innerHTML = `

                <strong>
                    ${escapeHTML(mock.name)}
                </strong>

                <span>
                    ${mock.score} / ${mock.total}
                </span>

                <span class="mock-percent">
                    ${percentage}%
                </span>

                <button
                    class="delete-mock"
                    onclick="deleteMock(${index})">
                    ×
                </button>

            `;


            list.appendChild(item);

        }
    );

}


function addMockTest() {

    const name =
        document
            .getElementById("mockName")
            .value
            .trim();


    const score =
        Number(
            document
                .getElementById("mockScore")
                .value
        );


    const total =
        Number(
            document
                .getElementById("mockMarks")
                .value
        );


    if (!name) {

        alert("Enter test name.");

        return;

    }


    if (
        Number.isNaN(score) ||
        Number.isNaN(total) ||
        total <= 0
    ) {

        alert("Enter valid score and total marks.");

        return;

    }


    if (score < 0 || score > total) {

        alert(
            "Score must be between 0 and total marks."
        );

        return;

    }


    mocks.push({

        name: name,

        score: score,

        total: total,

        date:
            new Date().toLocaleDateString()

    });


    saveMocks();

    renderMocks();


    document.getElementById(
        "mockName"
    ).value = "";


    document.getElementById(
        "mockScore"
    ).value = "";


    document.getElementById(
        "mockMarks"
    ).value = "";

}


function deleteMock(index) {

    mocks.splice(index, 1);

    saveMocks();

    renderMocks();

}


/* =====================================================
   NOTES
   ===================================================== */

const notes =
    document.getElementById("notes");


notes.value =
    localStorage.getItem(NOTES_KEY) || "";


notes.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            NOTES_KEY,
            notes.value
        );

    }
);


/* =====================================================
   MOTIVATION
   ===================================================== */

const quotes = [

    "Discipline beats motivation.",

    "One more question. One step closer.",

    "Your rank is built on ordinary days.",

    "Don't wait for motivation. Start.",

    "Consistency creates results.",

    "Focus on today's work.",

    "The syllabus won't finish itself.",

    "Study now. Thank yourself later."

];


function motivation() {

    const quote =
        quotes[
            Math.floor(
                Math.random() * quotes.length
            )
        ];


    alert(
        "⚡ WG PRIME X\n\n" +
        quote
    );

}


/* =====================================================
   RESET EVERYTHING
   ===================================================== */

function resetEverything() {

    const confirmReset =
        confirm(
            "This will delete syllabus progress, daily tasks, mock tests and notes.\n\nContinue?"
        );


    if (!confirmReset) return;


    localStorage.removeItem(
        STORAGE_KEY
    );

    localStorage.removeItem(
        DAILY_KEY
    );

    localStorage.removeItem(
        MOCK_KEY
    );

    localStorage.removeItem(
        NOTES_KEY
    );

    localStorage.removeItem(
        STREAK_KEY
    );


    completedChapters = {};

    dailyStates =
        [false, false, false, false];

    mocks = [];

    notes.value = "";


    renderSyllabus();

    updateStats();

    updateDaily();

    renderMocks();

    updateStreak();


    alert(
        "WG PRIME X reset complete."
    );

}


/* =====================================================
   SCROLL TO SYLLABUS
   ===================================================== */

function scrollToSyllabus() {

    document
        .getElementById("syllabusList")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   STREAK SYSTEM
   ===================================================== */

function updateStreak() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const stored =
        JSON.parse(
            localStorage.getItem(STREAK_KEY)
        ) || {

            lastDate: null,

            streak: 0

        };


    const hasCompleted =
        dailyStates.some(
            value => value === true
        );


    if (!hasCompleted) {

        document.getElementById(
            "streak"
        ).textContent =
            stored.streak + " 🔥";

        return;

    }


    if (
        stored.lastDate === today
    ) {

        document.getElementById(
            "streak"
        ).textContent =
            stored.streak + " 🔥";

        return;

    }


    if (stored.lastDate) {

        const previous =
            new Date(stored.lastDate);

        const current =
            new Date(today);


        const difference =
            Math.floor(
                (
                    current - previous
                ) /
                (
                    1000 * 60 * 60 * 24
                )
            );


        if (difference === 1) {

            stored.streak++;

        } else if (difference > 1) {

            stored.streak = 1;

        }

    } else {

        stored.streak = 1;

    }


    stored.lastDate = today;


    localStorage.setItem(
        STREAK_KEY,
        JSON.stringify(stored)
    );


    document.getElementById(
        "streak"
    ).textContent =
        stored.streak + " 🔥";

}


/* =====================================================
   INITIALIZE
   ===================================================== */

renderSyllabus();

updateStats();

updateDaily();

updateTimer();

renderMocks();

updateStreak();
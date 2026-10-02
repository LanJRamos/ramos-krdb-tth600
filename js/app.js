// ========================================
// KAMEN RIDER WATCH TRACKER
// Main JavaScript File
// ========================================


// ========================================
// INITIAL DATA
// ========================================

const defaultSeries = [];


// ========================================
// GET SERIES DATA
// ========================================

function getSeries() {

    const storedSeries =
        localStorage.getItem("kamenRiderSeries");

    if (storedSeries) {
        return JSON.parse(storedSeries);
    }

    localStorage.setItem(
        "kamenRiderSeries",
        JSON.stringify(defaultSeries)
    );

    return [];
}


// ========================================
// SAVE SERIES DATA
// ========================================

function saveSeries(series) {

    localStorage.setItem(
        "kamenRiderSeries",
        JSON.stringify(series)
    );

}


// ========================================
// LOAD SERIES FROM DATABASE
// ========================================

async function loadSeriesFromDatabase() {

    try {

        const response = await fetch("/api/series");

        const data = await response.json();

        if (!response.ok) {

            console.error(data.message);

            return;

        }


        const series = data.map(item => ({

            id: item.id,

            title: item.title,

            startYear: item.start_year,

            endYear: item.end_year,

            era: item.era,

            episodesReleased:
                item.episodes_released,

            theme: item.theme,

            status: item.status,

            watchedEpisode:
                item.watched_episode

        }));


        saveSeries(series);

    }

    catch (error) {

        console.error(
            "Failed to load series from database:",
            error
        );

    }

}


// ========================================
// CALCULATE WATCH PROGRESS
// ========================================

function calculateProgress(
    watchedEpisode,
    episodesReleased
) {

    if (episodesReleased <= 0) {
        return 0;
    }


    const progress =
        (watchedEpisode / episodesReleased) * 100;


    return Math.min(progress, 100);

}


// ========================================
// DISPLAY SERIES
// ========================================

function displaySeries(
    seriesToDisplay = getSeries()
) {

    const container =
        document.getElementById(
            "series-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (seriesToDisplay.length === 0) {

        container.innerHTML = `
            <p class="no-results">
                No series found.
            </p>
        `;

        return;
    }


    seriesToDisplay.forEach(series => {

        const progress =
            calculateProgress(
                series.watchedEpisode,
                series.episodesReleased
            );


        const card =
            document.createElement("div");


        card.className =
            "series-card";


        card.innerHTML = `

            <h2>
                ${series.title}
            </h2>


            <p class="series-info">
                ${series.startYear} — ${series.endYear}
                • ${series.era}
            </p>


            <p class="series-info">
                Episodes Released:
                ${series.episodesReleased}
            </p>


            <p class="series-info">
                Theme:
                ${series.theme}
            </p>


            <p class="series-info">
                Status:
                ${series.status}
            </p>


            <div class="watch-progress">

                <div class="progress-header">

                    <span>
                        Watched Episode
                    </span>

                    <span>
                        ${series.watchedEpisode}
                        /
                        ${series.episodesReleased}
                    </span>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>

                </div>


                <span class="progress-percentage">
                    ${progress.toFixed(0)}%
                </span>

            </div>


            <div class="card-actions">

                <button
                    class="edit-button"
                    onclick="editSeries(${series.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-button"
                    onclick="deleteSeries(${series.id})"
                >
                    Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


// ========================================
// ADD / EDIT SERIES
// ========================================

async function handleFormSubmit(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "title"
        ).value.trim();


    const startYear =
        Number(
            document.getElementById(
                "start-year"
            ).value
        );


    const era =
        document.getElementById(
            "era"
        ).value;


    const endYearInput =
        document.getElementById(
            "end-year"
        );


    const stillAiring =
        document.getElementById(
            "still-airing"
        ).checked;


    const endYear =
        stillAiring
            ? "Still Airing"
            : Number(endYearInput.value);


    const episodesReleased =
        Number(
            document.getElementById(
                "episodes"
            ).value
        );


    const theme =
        document.getElementById(
            "theme"
        ).value.trim();


    const status =
        document.getElementById(
            "status"
        ).value;


    let watchedEpisode =
        Number(
            document.getElementById(
                "watched-episode"
            ).value
        );


    // Prevent watched episodes from exceeding
    // the number of released episodes.

    watchedEpisode =
        Math.min(
            watchedEpisode,
            episodesReleased
        );


    let series =
        getSeries();


    const editingId =
        localStorage.getItem(
            "editingSeriesId"
        );


    // ========================================
    // UPDATE
    // ========================================

    if (editingId) {

    const id =
        Number(editingId);


    const updatedSeries = {

        id: id,

        title: title,

        startYear: startYear,

        endYear: endYear,

        era: era,

        episodesReleased:
            episodesReleased,

        theme: theme,

        status: status,

        watchedEpisode:
            watchedEpisode

    };


    const response =
        await fetch(
            `/api/series/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        updatedSeries
                    )
            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        alert(result.message);

        return;

    }


    const index =
        series.findIndex(
            item => item.id === id
        );


    if (index !== -1) {

        series[index] =
            updatedSeries;

    }


    localStorage.removeItem(
        "editingSeriesId"
    );

}


    // ========================================
    // CREATE
    // ========================================

    else {

        const newSeries = {

            title: title,

            startYear: startYear,

            endYear: endYear,

            era: era,

            episodesReleased:
                episodesReleased,

            theme: theme,

            status: status,

            watchedEpisode:
                watchedEpisode

        };


        const response =
            await fetch(
                "/api/series",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            newSeries
                        )
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(result.message);

            return;

        }


        // Use the ID generated by MySQL

        newSeries.id =
            result.id;


        series.push(
            newSeries
        );

    }


    saveSeries(series);


    window.location.href =
        "series.html";

}


// ========================================
// EDIT SERIES
// ========================================

function editSeries(id) {

    const series =
        getSeries();


    const selectedSeries =
        series.find(
            item => item.id === id
        );


    if (!selectedSeries) {
        return;
    }


    localStorage.setItem(
        "editingSeriesId",
        id
    );


    window.location.href =
        "series-form.html";

}


// ========================================
// LOAD EDIT DATA
// ========================================

function loadEditData() {

    const form =
        document.getElementById(
            "series-form"
        );


    if (!form) {
        return;
    }


    const editingId =
        localStorage.getItem(
            "editingSeriesId"
        );


    if (!editingId) {
        return;
    }


    const series =
        getSeries();


    const selectedSeries =
        series.find(
            item =>
                item.id === Number(editingId)
        );


    if (!selectedSeries) {
        return;
    }


    document.getElementById(
        "form-title"
    ).textContent =
        "Edit Series";


    document.getElementById(
        "submit-text"
    ).textContent =
        "Update Series";


    document.getElementById(
        "title"
    ).value =
        selectedSeries.title;


    document.getElementById(
        "start-year"
    ).value =
        selectedSeries.startYear;


    document.getElementById(
        "era"
    ).value =
        selectedSeries.era;


    document.getElementById(
        "episodes"
    ).value =
        selectedSeries.episodesReleased;


    document.getElementById(
        "theme"
    ).value =
        selectedSeries.theme;


    document.getElementById(
        "status"
    ).value =
        selectedSeries.status;


    document.getElementById(
        "watched-episode"
    ).value =
        selectedSeries.watchedEpisode;


    // End Year

    if (
        selectedSeries.endYear ===
        "Still Airing"
    ) {

        document.getElementById(
            "still-airing"
        ).checked = true;


        document.getElementById(
            "end-year"
        ).disabled = true;


        document.getElementById(
            "end-year"
        ).value = "";

    }


    else {

        document.getElementById(
            "still-airing"
        ).checked = false;


        document.getElementById(
            "end-year"
        ).disabled = false;


        document.getElementById(
            "end-year"
        ).value =
            selectedSeries.endYear;

    }

}


// ========================================
// STILL AIRING CHECKBOX
// ========================================

const stillAiringCheckbox =
    document.getElementById(
        "still-airing"
    );


const endYearInput =
    document.getElementById(
        "end-year"
    );


if (
    stillAiringCheckbox &&
    endYearInput
) {

    stillAiringCheckbox.addEventListener(
        "change",
        function () {

            if (this.checked) {

                endYearInput.disabled =
                    true;


                endYearInput.value =
                    "";

            }


            else {

                endYearInput.disabled =
                    false;

            }

        }
    );

}


// ========================================
// DELETE SERIES
// ========================================

async function deleteSeries(id) {

    const series =
        getSeries();


    const selectedSeries =
        series.find(
            item => item.id === id
        );


    if (!selectedSeries) {
        return;
    }


    const confirmation =
        confirm(
            `Are you sure you want to delete "${selectedSeries.title}"?`
        );


    if (!confirmation) {
        return;
    }


    const response =
        await fetch(
            `/api/series/${id}`,
            {
                method: "DELETE"
            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        alert(result.message);

        return;

    }


    const updatedSeries =
        series.filter(
            item => item.id !== id
        );


    saveSeries(
        updatedSeries
    );


    displaySeries(
        updatedSeries
    );


    displayCurrentlyWatching();

    updateDashboard();

}


// ========================================
// SEARCH SERIES
// ========================================

function searchSeries() {

    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const series =
        getSeries();


    const filteredSeries =
        series.filter(item =>

            item.title
                .toLowerCase()
                .includes(searchTerm)

            ||

            item.era
                .toLowerCase()
                .includes(searchTerm)

            ||

            item.theme
                .toLowerCase()
                .includes(searchTerm)

            ||

            item.status
                .toLowerCase()
                .includes(searchTerm)

            ||

            item.startYear
                .toString()
                .includes(searchTerm)

            ||

            item.endYear
                .toString()
                .toLowerCase()
                .includes(searchTerm)

        );


    displaySeries(
        filteredSeries
    );

}


// ========================================
// DISPLAY CURRENTLY WATCHING
// ========================================

function displayCurrentlyWatching() {

    const container =
        document.getElementById(
            "watching-container"
        );


    if (!container) {
        return;
    }


    const series =
        getSeries();


    const watching =
        series.filter(
            item =>
                item.status === "Watching"
        );


    container.innerHTML = "";


    // No currently watching series

    if (watching.length === 0) {

        container.innerHTML = `
            <p class="no-results">
                You are not currently watching any series.
            </p>
        `;

        return;
    }


    // Display currently watching series

    watching.forEach(series => {

        const progress =
            calculateProgress(
                series.watchedEpisode,
                series.episodesReleased
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "series-card";


        card.innerHTML = `

            <h2>
                ${series.title}
            </h2>


            <p class="series-info">
                ${series.startYear} —
                ${series.endYear}
                • ${series.era}
            </p>


            <p class="series-info">
                Episodes Released:
                ${series.episodesReleased}
            </p>


            <p class="series-info">
                Theme:
                ${series.theme}
            </p>


            <!-- Episode Tracking -->

            <div class="episode-tracking">

                <span class="episode-label">
                    Watched Episode
                </span>


                <div class="episode-controls">

                    <button
                        class="episode-button"
                        onclick="changeWatchedEpisode(${series.id}, -1)"
                    >
                        −
                    </button>


                    <span class="episode-count">
                        ${series.watchedEpisode}
                        /
                        ${series.episodesReleased}
                    </span>


                    <button
                        class="episode-button"
                        onclick="changeWatchedEpisode(${series.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <!-- Progress -->

            <div class="watch-progress">

                <div class="progress-header">

                    <span>
                        Watch Progress
                    </span>


                    <span>
                        ${progress.toFixed(0)}%
                    </span>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>

                </div>

            </div>


            <!-- Full Edit -->

            <div class="card-actions">

                <button
                    class="edit-button"
                    onclick="editSeries(${series.id})"
                >
                    Update Progress
                </button>

            </div>

        `;


        container.appendChild(
            card
        );

    });

}


// ========================================
// CHANGE WATCHED EPISODE
// ========================================

function changeWatchedEpisode(
    id,
    amount
) {

    const series =
        getSeries();


    const selectedSeries =
        series.find(
            item => item.id === id
        );


    if (!selectedSeries) {
        return;
    }


    let newEpisode =
        selectedSeries.watchedEpisode +
        amount;


    // Prevent going below 0

    newEpisode =
        Math.max(
            newEpisode,
            0
        );


    // Prevent going above released episodes

    newEpisode =
        Math.min(
            newEpisode,
            selectedSeries.episodesReleased
        );


    selectedSeries.watchedEpisode =
        newEpisode;


    saveSeries(
        series
    );


    // Refresh the dashboard

    displayCurrentlyWatching();

    updateDashboard();

}


// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateDashboard() {

    const series =
        getSeries();


    const totalSeries =
        document.getElementById(
            "total-series"
        );


    const watchingSeries =
        document.getElementById(
            "watching-series"
        );


    const completedSeries =
        document.getElementById(
            "completed-series"
        );


    // Total Series

    if (totalSeries) {

        totalSeries.textContent =
            series.length;

    }


    // Currently Watching

    if (watchingSeries) {

        const watching =
            series.filter(
                item =>
                    item.status === "Watching"
            );


        watchingSeries.textContent =
            watching.length;

    }


    // Completed

    if (completedSeries) {

        const completed =
            series.filter(
                item =>
                    item.status === "Completed"
            );


        completedSeries.textContent =
            completed.length;

    }

}


// ========================================
// EVENT LISTENERS
// ========================================


// Search

const searchInput =
    document.getElementById(
        "search-input"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchSeries
    );

}


// Form

const seriesForm =
    document.getElementById(
        "series-form"
    );


if (seriesForm) {

    seriesForm.addEventListener(
        "submit",
        handleFormSubmit
    );

}


// Add Series navigation link

const addSeriesLink =
    document.getElementById(
        "add-series-link"
    );


if (addSeriesLink) {

    addSeriesLink.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "editingSeriesId"
            );

        }
    );

}


// ========================================
// INITIALIZE
// ========================================

async function initialize() {

    await loadSeriesFromDatabase();

    displaySeries();

    displayCurrentlyWatching();

    loadEditData();

    updateDashboard();

}


initialize();
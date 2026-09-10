// ========================================
// KAMEN RIDER DATABASE
// Main JavaScript File
// ========================================


// ========================================
// INITIAL DATA
// ========================================

const defaultSeries = [
    {
        id: 1,
        title: "Kamen Rider Kuuga",
        startYear: 2000,
        endYear: 2001,
        era: "Heisei",
        episodes: 49,
        theme: "Archaeology / Insects",
        relatedMedia: 2
    },
    {
        id: 2,
        title: "Kamen Rider W",
        startYear: 2009,
        endYear: 2010,
        era: "Heisei",
        episodes: 49,
        theme: "Detectives / Mystery",
        relatedMedia: 5
    },
    {
        id: 3,
        title: "Kamen Rider Gavv",
        startYear: 2024,
        endYear: "Still Airing",
        era: "Reiwa",
        episodes: 50,
        theme: "Sweets / Monsters",
        relatedMedia: 3
    }
];


// ========================================
// GET SERIES DATA
// ========================================

function getSeries() {

    const storedSeries = localStorage.getItem("kamenRiderSeries");

    if (storedSeries) {
        return JSON.parse(storedSeries);
    }

    localStorage.setItem(
        "kamenRiderSeries",
        JSON.stringify(defaultSeries)
    );

    return defaultSeries;
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
// DISPLAY SERIES
// ========================================

function displaySeries(seriesToDisplay = getSeries()) {

    const container = document.getElementById("series-container");

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

        const card = document.createElement("div");

        card.className = "series-card";

        card.innerHTML = `
            <h2>${series.title}</h2>

            <p class="series-info">
                ${series.startYear} — ${series.endYear}
                • ${series.era}
            </p>

            <p class="series-info">
                ${series.episodes} Episodes Released
            </p>

            <p class="series-info">
                Theme: ${series.theme}
            </p>

            <p class="series-info">
                Related Media: ${series.relatedMedia}
            </p>

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

function handleFormSubmit(event) {

    event.preventDefault();


    const title =
        document.getElementById("title").value.trim();

    const startYear =
        Number(document.getElementById("start-year").value);

    const era =
        document.getElementById("era").value;

    const endYearInput =
        document.getElementById("end-year");

    const stillAiring =
        document.getElementById("still-airing").checked;

    const endYear =
        stillAiring
            ? "Still Airing"
            : Number(endYearInput.value);

    const episodes =
        Number(document.getElementById("episodes").value);

    const theme =
        document.getElementById("theme").value.trim();

    const relatedMedia =
        Number(document.getElementById("related-media").value);


    let series = getSeries();


    // Check whether we're editing an existing series
    const editingId =
        localStorage.getItem("editingSeriesId");


    // ========================================
    // UPDATE EXISTING SERIES
    // ========================================

    if (editingId) {

        const id = Number(editingId);

        const index = series.findIndex(
            item => item.id === id
        );


        if (index !== -1) {

            series[index] = {

                id: id,

                title: title,

                startYear: startYear,

                endYear: endYear,

                era: era,

                episodes: episodes,

                theme: theme,

                relatedMedia: relatedMedia

            };

        }

        localStorage.removeItem("editingSeriesId");

    }


    // ========================================
    // CREATE NEW SERIES
    // ========================================

    else {

        const newId = series.length > 0
            ? Math.max(...series.map(item => item.id)) + 1
            : 1;


        const newSeries = {

            id: newId,

            title: title,

            startYear: startYear,

            endYear: endYear,

            era: era,

            episodes: episodes,

            theme: theme,

            relatedMedia: relatedMedia

        };


        series.push(newSeries);

    }


    saveSeries(series);

    window.location.href = "series.html";

}


// ========================================
// EDIT SERIES
// ========================================

function editSeries(id) {

    const series = getSeries();

    const selectedSeries = series.find(
        item => item.id === id
    );


    if (!selectedSeries) {
        return;
    }


    localStorage.setItem(
        "editingSeriesId",
        id
    );


    window.location.href = "series-form.html";

}


// ========================================
// LOAD EDIT DATA
// ========================================

function loadEditData() {

    const form =
        document.getElementById("series-form");


    if (!form) {
        return;
    }


    const editingId =
        localStorage.getItem("editingSeriesId");


    if (!editingId) {
        return;
    }


    const series = getSeries();

    const selectedSeries = series.find(
        item => item.id === Number(editingId)
    );


    if (!selectedSeries) {
        return;
    }


    // Change page text

    document.getElementById("form-title").textContent =
        "Edit Series";

    document.getElementById("submit-text").textContent =
        "Update Series";


    // Fill form

    document.getElementById("title").value =
        selectedSeries.title;

    document.getElementById("start-year").value =
        selectedSeries.startYear;

    document.getElementById("era").value =
        selectedSeries.era;

    document.getElementById("episodes").value =
        selectedSeries.episodes;

    document.getElementById("theme").value =
        selectedSeries.theme;

    document.getElementById("related-media").value =
        selectedSeries.relatedMedia;


    // Handle End Year

    if (selectedSeries.endYear === "Still Airing") {

        document.getElementById("still-airing").checked = true;

        document.getElementById("end-year").disabled = true;

        document.getElementById("end-year").value = "";

    }

    else {

        document.getElementById("still-airing").checked = false;

        document.getElementById("end-year").disabled = false;

        document.getElementById("end-year").value =
            selectedSeries.endYear;

    }

}


// ========================================
// STILL AIRING CHECKBOX
// ========================================

const stillAiringCheckbox =
    document.getElementById("still-airing");

const endYearInput =
    document.getElementById("end-year");


if (stillAiringCheckbox && endYearInput) {

    stillAiringCheckbox.addEventListener(
        "change",
        function () {

            if (this.checked) {

                endYearInput.disabled = true;

                endYearInput.value = "";

            }

            else {

                endYearInput.disabled = false;

            }

        }
    );

}


// ========================================
// DELETE SERIES
// ========================================

function deleteSeries(id) {

    const series = getSeries();

    const selectedSeries = series.find(
        item => item.id === id
    );


    if (!selectedSeries) {
        return;
    }


    const confirmation = confirm(
        `Are you sure you want to delete "${selectedSeries.title}"?`
    );


    if (!confirmation) {
        return;
    }


    const updatedSeries = series.filter(
        item => item.id !== id
    );


    saveSeries(updatedSeries);

    displaySeries(updatedSeries);

    updateDashboard();

}


// ========================================
// SEARCH SERIES
// ========================================

function searchSeries() {

    const searchInput =
        document.getElementById("search-input");


    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value.toLowerCase().trim();


    const series = getSeries();


    const filteredSeries = series.filter(item =>

        item.title.toLowerCase().includes(searchTerm) ||

        item.era.toLowerCase().includes(searchTerm) ||

        item.theme.toLowerCase().includes(searchTerm) ||

        item.startYear.toString().includes(searchTerm) ||

        item.endYear.toString().toLowerCase().includes(searchTerm)

    );


    displaySeries(filteredSeries);

}


// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateDashboard() {

    const series = getSeries();


    const totalSeries =
        document.getElementById("total-series");

    const totalEras =
        document.getElementById("total-eras");

    const latestYear =
        document.getElementById("latest-year");


    if (!totalSeries || !totalEras || !latestYear) {
        return;
    }


    totalSeries.textContent =
        series.length;


    const eras = [
        ...new Set(series.map(item => item.era))
    ];


    totalEras.textContent =
        eras.length;


    if (series.length > 0) {

        const newest = Math.max(
            ...series.map(item => item.startYear)
        );

        latestYear.textContent =
            newest;

    }

    else {

        latestYear.textContent =
            "-";

    }

}


// ========================================
// EVENT LISTENERS
// ========================================


// Search

const searchInput =
    document.getElementById("search-input");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchSeries
    );

}


// Form

const seriesForm =
    document.getElementById("series-form");


if (seriesForm) {

    seriesForm.addEventListener(
        "submit",
        handleFormSubmit
    );

}


// Add Series navigation link

const addSeriesLink =
    document.getElementById("add-series-link");


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

displaySeries();

loadEditData();

updateDashboard();
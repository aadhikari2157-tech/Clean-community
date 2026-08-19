const form = document.getElementById("reportForm");

const nameInput = document.getElementById("name");
const locationInput = document.getElementById("location");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");

const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");

const reportsList = document.getElementById("reportsList");
const totalCount = document.getElementById("totalCount");
const solvedCount = document.getElementById("solvedCount");

const searchBox = document.getElementById("searchBox");
const categoryFilter = document.getElementById("categoryFilter");


// Get reports from localStorage
function getReports() {

    return JSON.parse(
        localStorage.getItem("reports")
    ) || [];

}


// Save reports to localStorage
function saveReports(reports) {

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );

}


// Submit Report
form.onsubmit = function(event) {

    event.preventDefault();

    formError.textContent = "";
    formSuccess.textContent = "";


    const name = nameInput.value.trim();

    const location = locationInput.value.trim();

    const category = categoryInput.value;

    const description = descriptionInput.value.trim();


    // Validation
    if (
        !name ||
        !location ||
        !category ||
        !description
    ) {

        formError.textContent =
            "Please fill in all fields.";

        return;

    }


    // Create report
    const report = {

        id: Date.now(),

        name: name,

        location: location,

        category: category,

        description: description,

        date: new Date().toLocaleDateString(),

        status: "Pending"

    };


    // Get existing reports
    const reports = getReports();


    // Add new report to beginning
    reports.unshift(report);


    // Save reports
    saveReports(reports);


    // Show success message
    formSuccess.textContent =
        "Report submitted successfully!";


    // Clear form
    form.reset();


    // Refresh reports
    displayReports();

};


// Display Reports
function displayReports() {

    const reports = getReports();

    const search =
        searchBox.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    // Filter reports
    const filteredReports =
        reports.filter(function(report) {

            const searchMatch =

                report.location
                    .toLowerCase()
                    .includes(search)

                ||

                report.category
                    .toLowerCase()
                    .includes(search)

                ||

                report.description
                    .toLowerCase()
                    .includes(search);


            const categoryMatch =

                selectedCategory === "All"

                ||

                report.category === selectedCategory;


            return searchMatch && categoryMatch;

        });


    // Total reports
    totalCount.textContent =
        reports.length;


    // Solved reports
    solvedCount.textContent =

        reports.filter(function(report) {

            return report.status === "Solved";

        }).length;


    // No reports found
    if (filteredReports.length === 0) {

        reportsList.innerHTML =
            "<p class='empty-msg'>No reports found.</p>";

        return;

    }


    // Display report cards
    reportsList.innerHTML =

        filteredReports.map(function(report) {

            return `

                <div class="report-card ${
                    report.status === "Solved"
                        ? "solved"
                        : ""
                }">

                    <h3>
                        ${report.category}
                    </h3>


                    <p class="meta">
                        ${report.location} |
                        ${report.date}
                    </p>


                    <p class="desc">
                        ${report.description}
                    </p>


                    <p class="meta">
                        Reported by:
                        ${report.name}
                    </p>


                    <span class="status ${
                        report.status.toLowerCase()
                    }">

                        ${report.status}

                    </span>


                    <div class="card-actions">

                        ${
                            report.status === "Pending"

                            ? `

                                <button
                                    class="solve-btn"
                                    onclick="solveReport(${report.id})"
                                >
                                    Mark as Solved
                                </button>

                              `

                            : ""
                        }


                        <button
                            class="delete-btn"
                            onclick="deleteReport(${report.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


// Mark report as solved
function solveReport(id) {

    const reports = getReports();


    const report = reports.find(
        function(report) {

            return report.id === id;

        }
    );


    if (report) {

        report.status = "Solved";

    }


    saveReports(reports);

    displayReports();

}


function deleteReport(id) {

    const reports = getReports();


    const newReports =
        reports.filter(function(report) {

            return report.id !== id;

        });


    saveReports(newReports);

    displayReports();

}


// Search reports
searchBox.oninput = displayReports;


// Filter reports
categoryFilter.onchange = displayReports;


// Load reports when page opens
displayReports();
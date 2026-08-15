const STORAGE_KEY = "cleanCommunityReports";

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

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
    navLinks.classList.remove("show");
  });
});

function getReports() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  formError.textContent = "";
  formSuccess.textContent = "";

  const name = nameInput.value.trim();
  const location = locationInput.value.trim();
  const category = categoryInput.value;
  const description = descriptionInput.value.trim();

  if (!name || !location || !category || !description) {
    formError.textContent = "Please fill in all fields before submitting.";
    return;
  }

  const newReport = {
    id: Date.now(),
    name,
    location,
    category,
    description,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    status: "Pending"
  };

  const reports = getReports();
  reports.unshift(newReport);
  saveReports(reports);

  formSuccess.textContent = "Report submitted successfully!";
  form.reset();
  renderReports();

  setTimeout(() => (formSuccess.textContent = ""), 3000);
});

function renderReports() {
  const reports = getReports();
  const search = searchBox.value.toLowerCase();
  const filterCategory = categoryFilter.value;

  const filtered = reports.filter(r => {
    const matchesSearch =
      r.location.toLowerCase().includes(search) ||
      r.category.toLowerCase().includes(search) ||
      r.description.toLowerCase().includes(search);
    const matchesCategory = filterCategory === "All" || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  totalCount.textContent = reports.length;
  solvedCount.textContent = reports.filter(r => r.status === "Solved").length;

  if (filtered.length === 0) {
    reportsList.innerHTML = `<p class="empty-msg">No community reports yet. Be the first to report a problem!</p>`;
    return;
  }

  reportsList.innerHTML = filtered.map(r => `
    <div class="report-card ${r.status === "Solved" ? "solved" : ""}">
      <h3>${r.category}</h3>
      <div class="meta">📍 ${r.location} &nbsp;•&nbsp; ${r.date}</div>
      <p class="desc">${r.description}</p>
      <div class="meta">Reported by: ${r.name}</div>
      <span class="status ${r.status === "Solved" ? "solved" : "pending"}">${r.status}</span>
      <div class="card-actions">
        ${r.status === "Pending" ? `<button class="solve-btn" onclick="markSolved(${r.id})">Mark as Solved</button>` : ""}
        <button class="delete-btn" onclick="deleteReport(${r.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function markSolved(id) {
  const reports = getReports();
  const report = reports.find(r => r.id === id);
  if (report) report.status = "Solved";
  saveReports(reports);
  renderReports();
}

function deleteReport(id) {
  if (!confirm("Are you sure you want to delete this report?")) return;
  const reports = getReports().filter(r => r.id !== id);
  saveReports(reports);
  renderReports();
}

searchBox.addEventListener("input", renderReports);
categoryFilter.addEventListener("change", renderReports);

renderReports();
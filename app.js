
// ─── Constants ───────────────────────────────────────────────
const API_URL = "https://jsonplaceholder.typicode.com/users";
const userGrid = document.getElementById("user-grid");
const statusMsg = document.getElementById("status-message");
const fetchBtn = document.getElementById("fetch-btn");

// ─── Fetch Users ─────────────────────────────────────────────
async function fetchUsers() {
  // Show loading state
  setStatus("loading", "Fetching users from API…");
  fetchBtn.disabled = true;
  userGrid.innerHTML = "";

  try {
    // Await the HTTP request to the public API
    const response = await fetch(API_URL);

    // Check if the server responded with a success status (200–299)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Await parsing of the JSON response body
    const users = await response.json();

    // Guard: make sure we actually received an array
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("No user data was returned by the API.");
    }

    // Render the users to the page
    renderUsers(users);
    setStatus("success", `✓ Successfully loaded ${users.length} users.`);

  } catch (error) {
    // Catch network errors, JSON parse errors, or our custom errors
    setStatus("error", `✗ Error: ${error.message}`);
    userGrid.innerHTML = `<p class="error-detail">Could not load user data. Please check your connection and try again.</p>`;
  } finally {
    // Re-enable the button whether the request succeeded or failed
    fetchBtn.disabled = false;
  }
}


function renderUsers(users) {
  // Use a document fragment for efficient DOM insertion (one reflow)
  const fragment = document.createDocumentFragment();

  users.forEach((user, index) => {
    // Destructure the fields we need from each user object
    const { name, email, address } = user;
    const city = address?.city ?? "Unknown City";

    // Build the card element
    const card = document.createElement("div");
    card.className = "user-card";

    // Stagger the card animation using CSS custom property
    card.style.setProperty("--delay", `${index * 60}ms`);

    // Generate initials for the avatar (e.g. "Leanne Graham" → "LG")
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    // Inject the card's inner HTML
    card.innerHTML = `
      <div class="card-avatar" aria-hidden="true">${initials}</div>
      <div class="card-body">
        <h2 class="card-name">${escapeHTML(name)}</h2>
        <p class="card-detail">
          <span class="card-icon" aria-label="Email">✉</span>
          <a href="mailto:${escapeHTML(email)}" class="card-link">${escapeHTML(email)}</a>
        </p>
        <p class="card-detail">
          <span class="card-icon" aria-label="City">📍</span>
          <span>${escapeHTML(city)}</span>
        </p>
      </div>
    `;

    fragment.appendChild(card);
  });

 
  userGrid.appendChild(fragment);
}

// ─── Helpers ──────────────────────────────────────────────────


function setStatus(type, message) {
  statusMsg.textContent = message;
  statusMsg.className = `status status--${type}`;
}


function escapeHTML(str) {
  const div = document.createElement("div");s
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─── Event Listener ───────────────────────────────────────────

// Trigger fetch when the button is clicked
fetchBtn.addEventListener("click", fetchUsers);

// Auto-fetch when the page loads for a smooth first experience
window.addEventListener("DOMContentLoaded", fetchUsers);

const events = [
  {
    id: 1,
    title: "CodeVerse 2026",
    category: "Technology",
    date: "Oct 28, 2026",
    time: "10:00 AM",
    location: "Main Auditorium",
    emoji: "💻",
    color: "tech",
    description:
      "Explore coding challenges, AI ideas and exciting technology projects with fellow students."
  },
  {
    id: 2,
    title: "Rhythm & Roots",
    category: "Cultural",
    date: "Oct 30, 2026",
    time: "4:00 PM",
    location: "Open Air Theatre",
    emoji: "🎭",
    color: "culture",
    description:
      "Celebrate music, dance and culture through performances by talented students."
  },
  {
    id: 3,
    title: "Design Your Future",
    category: "Workshop",
    date: "Nov 2, 2026",
    time: "11:00 AM",
    location: "Innovation Lab",
    emoji: "🎨",
    color: "workshop",
    description:
      "Discover creative problem-solving and learn how to turn ideas into useful designs."
  },
  {
    id: 4,
    title: "Campus Champions",
    category: "Sports",
    date: "Nov 5, 2026",
    time: "8:00 AM",
    location: "College Sports Ground",
    emoji: "🏆",
    color: "sports",
    description:
      "Bring your team spirit and take part in a fun celebration of campus sports."
  }
];

const eventGrid = document.getElementById("eventGrid");
const savedGrid = document.getElementById("savedGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const savedCount = document.getElementById("savedCount");

const eventDialog = document.getElementById("eventDialog");
const eventDetails = document.getElementById("eventDetails");
const registerDialog = document.getElementById("registerDialog");

let savedEvents = JSON.parse(
  localStorage.getItem("campusVibeSaved") || "[]"
);

function renderEvents(list, container) {
  container.innerHTML = "";

  list.forEach(function (event) {
    const isSaved = savedEvents.includes(event.id);

    container.innerHTML += `
      <article class="event-card">
        <div class="event-cover ${event.color}">
          <span>${event.emoji}</span>
          <span class="category">${event.category}</span>
        </div>

        <div class="event-info">
          <h3>${event.title}</h3>

          <p class="event-meta">
            📅 ${event.date}<br>
            🕒 ${event.time}<br>
            📍 ${event.location}
          </p>

          <div class="card-actions">
            <button class="details-button"
              onclick="showDetails(${event.id})">
              Explore
            </button>

            <button class="small-button"
              onclick="toggleSave(${event.id})">
              ${isSaved ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
        </div>
      </article>
    `;
  });
}

function filterEvents() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredEvents = events.filter(function (event) {
    const matchesSearch =
      event.title.toLowerCase().includes(searchText) ||
      event.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderEvents(filteredEvents, eventGrid);

  document.getElementById("emptyMessage").hidden =
    filteredEvents.length !== 0;
}

function toggleSave(id) {
  if (savedEvents.includes(id)) {
    savedEvents = savedEvents.filter(function (savedId) {
      return savedId !== id;
    });
  } else {
    savedEvents.push(id);
  }

  localStorage.setItem(
    "campusVibeSaved",
    JSON.stringify(savedEvents)
  );

  updateSavedEvents();
  filterEvents();
}

function updateSavedEvents() {
  const myEvents = events.filter(function (event) {
    return savedEvents.includes(event.id);
  });

  renderEvents(myEvents, savedGrid);
  savedCount.textContent = myEvents.length;

  document.getElementById("savedEmpty").hidden =
    myEvents.length !== 0;
}

function showDetails(id) {
  const event = events.find(function (item) {
    return item.id === id;
  });

  eventDetails.innerHTML = `
    <div class="dialog-cover">${event.emoji}</div>
    <span class="category">${event.category}</span>
    <h2>${event.title}</h2>
    <p class="dialog-description">${event.description}</p>
    <p class="dialog-meta">
      📅 ${event.date}<br>
      🕒 ${event.time}<br>
      📍 ${event.location}
    </p>
    <button class="primary-button"
      onclick="openRegistration(${event.id})">
      Register for Event →
    </button>
  `;

  eventDialog.showModal();
}

function openRegistration(id) {
  document.getElementById("selectedEvent").value = id;
  document.getElementById("registrationMessage").textContent = "";

  eventDialog.close();
  registerDialog.showModal();
}

document.getElementById("closeDialog").addEventListener("click", function () {
  eventDialog.close();
});

document.getElementById("closeRegister").addEventListener("click", function () {
  registerDialog.close();
});

searchInput.addEventListener("input", filterEvents);
categoryFilter.addEventListener("change", filterEvents);

document.getElementById("registrationForm").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    const studentName =
      document.getElementById("studentName").value.trim();

    const eventId =
      Number(document.getElementById("selectedEvent").value);

    const selectedEvent = events.find(function (item) {
      return item.id === eventId;
    });

    document.getElementById("registrationMessage").textContent =
      `Thanks, ${studentName}! Your demo registration for ${selectedEvent.title} is complete.`;

    this.reset();
  }
);

filterEvents();
updateSavedEvents();

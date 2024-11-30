let clientsCurrentDate = new Date();

function renderClientsTab() {
  const mainContent = document.getElementById("mainContent");

  function fetchClients() {
    fetch("https://calendar-backend-v203.onrender.com/clients")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        return response.json();
      })
      .then((data) => {
        clients = data;
        console.log("Clients fetched:", clients);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }

  fetchClients();

  mainContent.innerHTML = `
    

    <div class="clients-calendar calendar">
      <div class="calendar-header">
        <button class="calendar-nav-btn" id="clientsPrevMonth">&lt;</button>
        <span class="calendar-month" id="clientsMonthYear"></span>
        <button class="calendar-nav-btn" id="clientsNextMonth">&gt;</button>
      </div>
      <div class="calendar-grid" id="clientsCalendarGrid">
        <!-- Days will be dynamically generated -->
      </div>
    </div>
    <br>
    <div class="clients-header">
      <input type="text" id="searchClient" placeholder="Search Client by Surname..." />
    </div>

    <div class="clients-details">
      <h2>Client Details</h2>
      <div id="clientsDetails">
        <p>Search for a client to view their payment history.</p>
      </div>
    </div>
  `;

  generateClientsCalendar(clientsCurrentDate);

  document.getElementById("clientsPrevMonth").addEventListener("click", () => {
    clientsCurrentDate.setMonth(clientsCurrentDate.getMonth() - 1);
    generateClientsCalendar(clientsCurrentDate);
  });

  document.getElementById("clientsNextMonth").addEventListener("click", () => {
    clientsCurrentDate.setMonth(clientsCurrentDate.getMonth() + 1);
    generateClientsCalendar(clientsCurrentDate);
  });

  document.getElementById("searchClient").addEventListener("input", (e) => {
    const clientName = e.target.value.trim().toLowerCase();
    // If the search field is empty, clear highlights and reset details
  if (!clientName) {
    document.getElementById("clientsDetails").innerHTML =
      "<p>No client selected.</p>";

    // Regenerate calendar without any client data (reset highlights)
    generateClientsCalendar(clientsCurrentDate, null);
    return;
  }

    const filteredClients = Object.entries(clients).filter(([name]) =>
      name.toLowerCase().includes(clientName)
    );

    if (filteredClients.length === 0) {
      document.getElementById("clientsDetails").innerHTML =
        "<p>No matching clients found.</p>";
      return;
    }

    const selectedClient = filteredClients[0]; // Assume the first match is selected
    displayClientDetails(selectedClient[0], selectedClient[1]);
    generateClientsCalendar(clientsCurrentDate, selectedClient[1]);
  });
}

function generateClientsCalendar(date, clientData = null) {
  const clientsCalendarGrid = document.getElementById("clientsCalendarGrid");
  const clientsMonthYear = document.getElementById("clientsMonthYear");
  const clientsDaysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  clientsCalendarGrid.innerHTML = "";
  clientsMonthYear.textContent = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;

  clientsDaysOfWeek.forEach((day) => {
    const dayName = document.createElement("div");
    dayName.textContent = day;
    dayName.classList.add("day-name");
    clientsCalendarGrid.appendChild(dayName);
  });

  const rawFirstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const firstDay = rawFirstDay === 0 ? 6 : rawFirstDay - 1;
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    clientsCalendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateButton = document.createElement("button");
    dateButton.textContent = day;
    dateButton.classList.add("date");

    const currentDate = new Date(date.getFullYear(), date.getMonth(), day);

    if (clientData) {
      const paymentRecord = Object.values(clientData).find(
        (entry) => new Date(entry.paymentDate).toDateString() === currentDate.toDateString()
      );

      if (paymentRecord) {
        if (paymentRecord.paymentStatus === "Paid in full") {
          dateButton.style.backgroundColor = "green";
          dateButton.style.color = "white";
        } else {
          dateButton.style.backgroundColor = "red";
          dateButton.style.color = "white";
          
        }
      }
    }

    clientsCalendarGrid.appendChild(dateButton);
  }
}

function displayClientDetails(clientName, clientData) {
    let detailsHTML = `<h3>${clientName}'s Payment History</h3><table class="activity-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount (£)</th>
          <th>Status</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>`;
  
    Object.entries(clientData).forEach(([bookingId, record]) => {
      detailsHTML += `
        <tr>
          <td>${new Date(record.paymentDate).toLocaleDateString()}</td>
          <td>${record.payment}</td>
          <td>${record.paymentStatus}</td>
          <td><button class="modify-btn" data-client="${clientName}" data-booking="${bookingId}">Modify</button></td>
        </tr>`;
    });
  
    detailsHTML += "</tbody></table>";
    document.getElementById("clientsDetails").innerHTML = detailsHTML;
  
    // Add event listeners for Modify buttons
    document.querySelectorAll(".modify-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const clientName = button.getAttribute("data-client");
        const bookingId = button.getAttribute("data-booking");
        modifyPayment(clientName, bookingId);
      });
    });
  }
  

  function modifyPayment(clientName, bookingId) {
    const clientRecord = clients[clientName][bookingId];
    const newPayment = prompt(
      `Enter new payment amount for booking ID ${bookingId} on ${new Date(
        clientRecord.paymentDate
      ).toLocaleDateString()}:`,
      clientRecord.payment
    );
  
    if (newPayment !== null) {
      clientRecord.payment = newPayment;
      clientRecord.paymentStatus =
        parseFloat(newPayment) >= 20 ? "Paid in full" : "Partially paid";
  
      // Send updated data to backend
      fetch(`https://calendar-backend-v203.onrender.com/update-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          bookingId,
          payment: clientRecord.payment,
          paymentStatus: clientRecord.paymentStatus,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update payment");
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message || "Payment updated successfully.");
          generateClientsCalendar(clientsCurrentDate, clients[clientName]);
          displayClientDetails(clientName, clients[clientName]);
        })
        .catch((error) => {
          console.error("Error updating payment:", error);
          alert("Failed to update payment.");
        });
    }
  }
  


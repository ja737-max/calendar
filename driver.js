let drivers = [];
let clients = [];

function renderDriversTab() {
    const mainContent = document.getElementById("mainContent");
    let driversCurrentDate = new Date();
    
    // Fetch drivers from backend and update the local cache
  function fetchDrivers() {
    fetch("http://localhost:3000/drivers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }
        return response.json();
      })
      .then((data) => {
        drivers = data; // Update local cache
        console.log("Drivers fetched:", drivers);
        //renderDriverDetails(); // Update UI with fetched data
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  }

  fetchDrivers();
  
    mainContent.innerHTML = `
    <div class="drivers-header">
      <button id="addDriverBtn" class="add-driver-btn">+ Add Driver</button>
      <input type="text" id="searchDriver" placeholder="Search Driver..." />   
    </div>
    

    <div class="drivers-calendar calendar">
      <div class="calendar-header">
        <button class="calendar-nav-btn" id="driversPrevMonth">&lt;</button>
        <span class="calendar-month" id="driversMonthYear"></span>
        <button class="calendar-nav-btn" id="driversNextMonth">&gt;</button>
      </div>
      <div class="calendar-grid" id="driversCalendarGrid">
        <!-- Days will be dynamically generated -->
      </div>
    </div>

    <div class="drivers-actions">
      <h2>Driver Actions</h2>
      <div id="driversDetails">
        <p>Select a date to add a driver or view details.</p>
      </div>
    </div>


<!-- Add Driver Modal -->
    <div id="addDriverModal" class="modal hidden">
      <div class="modal-content">
        <button class="close-btn" id="closeModalBtn">&times;</button>
        <h2 class="modal-title">Add Driver</h2>
        <form id="addDriverForm">
          <div class="form-group">
            <label>
              <input type="text" id="firstName" placeholder="First name" required />
              <span class="icon"><i class="fa fa-user"></i></span>
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="text" id="lastName" placeholder="Last name" required />
              <span class="icon"><i class="fa fa-user"></i></span>
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="email" id="email" placeholder="Email" required />
              <span class="icon"><i class="fa fa-envelope"></i></span>
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="text" id="phone" placeholder="Phone" required />
              <span class="icon"><i class="fa fa-phone"></i></span>
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="text" id="carModel" placeholder="Car model" required />
              <span class="icon"><i class="fa fa-car"></i></span>
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="text" id="licensePlate" placeholder="License plate" required />
              <span class="icon"><i class="fa fa-car"></i></span>
            </label>
          </div>
          <div class="form-group color-picker">
  <span class="color-label">Color:</span>
  <div class="color-options">
    <!-- Color options -->
    <button type="button" class="color-option blue" data-color="#0000FF"></button>
    <button type="button" class="color-option red" data-color="#FF0000"></button>
    <button type="button" class="color-option green" data-color="#00FF00"></button>
    <button type="button" class="color-option yellow" data-color="#FFFF00"></button>
    <button type="button" class="color-option orange" data-color="#FFA500"></button>
    <button type="button" class="color-option purple" data-color="#800080"></button>
    <button type="button" class="color-option pink" data-color="#FFC0CB"></button>
    <button type="button" class="color-option brown" data-color="#A52A2A"></button>
    <button type="button" class="color-option gray" data-color="#808080"></button>
    <button type="button" class="color-option cyan" data-color="#00FFFF"></button>
    <button type="button" class="color-option lime" data-color="#00FF00"></button>
    <button type="button" class="color-option teal" data-color="#008080"></button>
    <button type="button" class="color-option magenta" data-color="#FF00FF"></button>
    <button type="button" class="color-option navy" data-color="#000080"></button>
    <button type="button" class="color-option olive" data-color="#808000"></button>
  </div>
</div>

          <div class="form-group">
            <label>
              <input id="colorCode" type="text" placeholder="Selected color code" readonly />
              <span class="icon"><i class="fa fa-palette"></i></span>
            </label>
          </div>
          <div class="form-group">
            <button type="submit" class="submit-btn">Add Driver</button>
          </div>
        </form>
      </div>
    </div>

  <!-- Add client Modal -->

<!-- Add Client Modal -->
<div id="addClientModal" class="modal hidden">
  <div class="modal-content">
    <button class="close-btn" id="closeClientModalBtn">&times;</button>
    <h2 class="modal-title">Add Client</h2>
    <form id="addClientForm">
      <div class="form-group">
        <label>
          <select id="driverDropdown" required>
            <option value="">Select Driver</option>
          </select>
          <span class="icon"><i class="fa fa-car"></i></span>
        </label>
      </div>
      <div class="form-group">
        <label>
          <select id="clientNameDropdown" required>
            <option value="new">Add New Client</option>
          </select>
          <input type="text" id="newClientName" placeholder="Enter new client name" />
          
        </label>
      </div>
      <div class="form-group">
        <label>
          <select id="clientCurrency" required>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <span class="icon"><i class="fa fa-money-bill"></i></span>
        </label>
      </div>
      <div class="form-group">
        <label>
          <input type="date" id="clientPaymentDate" required  />
          <span class="icon"><i class="fa fa-calendar"></i></span>
        </label>
      </div>
      <div class="form-group">
        <label>
          <input type="text" id="clientAmount" placeholder="Amount" value="0" />
          <span class="icon"><i class="fa fa-money-bill-wave"></i></span>
        </label>
      </div>
      <div class="form-group payment-status-picker">
        <span class="color-label">Color code for payment status</span>
        <div class="status-options">
          <button type="button" class="status-option paid" data-status="Paid in full">Paid in full</button>
          <button type="button" class="status-option partially-paid" data-status="Partially paid">
            Partially paid
          </button>
          <button type="button" class="status-option not-paid" data-status="Not paid">Not paid</button>
        </div>
      </div>
      <div class="form-group">
        <input type="hidden" id="paymentStatus" value="" />
        <button type="submit" class="submit-btn">Add Client</button>
      </div>
    </form>
  </div>
</div>
 
  `;


  document.getElementById("searchDriver").addEventListener("input", (e) => {
    const driverName = e.target.value.trim();
  
    if (!driverName) {
      // Clear details when input is empty
      document.getElementById("driversDetails").innerHTML = "<p>No driver selected.</p>";
      return;
    }
  
    fetch(`http://localhost:3000/driver-details?driverName=${encodeURIComponent(driverName)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch driver details");
        }
        return response.json();
      })
      .then((data) => {
        const driverDetails = data.driverDetails;
  
        if (driverDetails.length === 0) {
          document.getElementById("driversDetails").innerHTML = `<p>No records found for driver: ${driverName}.</p>`;
          return;
        }
  
        // Calculate weekly totals
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Sunday

    // Normalize dates to compare only the date portion
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999); // Include the full last day
  
        let totalPassengers = 0;
        let totalReceived = 0;
        let totalMissing = 0;
  
        const weeklyDetails = driverDetails.filter((detail) => {
          const paymentDate = new Date(detail.paymentDate);
          return paymentDate >= startOfWeek && paymentDate <= endOfWeek;
        });
  
        weeklyDetails.forEach((detail) => {
          totalPassengers++;
          totalReceived += detail.paymentStatus === "Paid in full" ? 20 : parseFloat(detail.payment);
          totalMissing += detail.paymentStatus !== "Paid in full" ? 20 - parseFloat(detail.payment) : 0;
        });
  
        // Render weekly details with remaining amount
        let detailsHTML = `
          <h3>Weekly Accounting (${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()})</h3>
          <p><strong>Total Passengers:</strong> ${totalPassengers}</p>
          <p><strong>Total Received:</strong> £${totalReceived.toFixed(2)}</p>
          <p><strong>Total Missing:</strong> £${totalMissing.toFixed(2)}</p>
          <h3>Driver Activity</h3>
          <table class="activity-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Passenger</th>
                <th>Payment Status</th>
                <th>Received (£)</th>
                <th>Remaining (£)</th>
              </tr>
            </thead>
            <tbody>
        `;
  
        weeklyDetails.forEach((detail) => {
          const receivedAmount = detail.paymentStatus === "Paid in full" ? 20 : parseFloat(detail.payment);
          const remainingAmount = detail.paymentStatus !== "Paid in full" ? 20 - parseFloat(detail.payment) : 0;
  
          detailsHTML += `
            <tr>
              <td>${new Date(detail.paymentDate).toLocaleDateString()}</td>
              <td>${detail.clientName}</td>
              <td>${detail.paymentStatus}</td>
              <td>${receivedAmount.toFixed(2)}</td>
              <td>${remainingAmount.toFixed(2)}</td>
            </tr>
          `;
        });
  
        detailsHTML += `
            </tbody>
          </table>
        `;
  
        document.getElementById("driversDetails").innerHTML = detailsHTML;
      })
      .catch((error) => {
        console.error("Error fetching driver details:", error);
        document.getElementById("driversDetails").innerHTML = "<p>An error occurred while fetching driver details.</p>";
      });
  });
  
  

  document.querySelectorAll(".status-option").forEach((button) => {
    button.addEventListener("click", function () {
      // Remove the selected class from all buttons
      document.querySelectorAll(".status-option").forEach((btn) => btn.classList.remove("selected"));
  
      // Add the selected class to the clicked button
      this.classList.add("selected");
  
      // Update the hidden input field with the selected status
      document.getElementById("paymentStatus").value = this.getAttribute("data-status");
    });
  });
  





// Function to populate drivers dropdown
function populateDriverDropdown() {
  const driverDropdown = document.getElementById("driverDropdown");
  driverDropdown.innerHTML = `
    <option value="">Select Driver</option>
    ${drivers
      .map((driver) => `<option value="${driver.firstName} ${driver.lastName}">${driver.firstName} ${driver.lastName}</option>`)
      .join("")}
  `;
}

function populateClientDropdown(clients) {
  const clientDropdown = document.getElementById("clientNameDropdown");

  // Clear existing options except the "Add New Client" option
  clientDropdown.innerHTML = `<option value="new">Add New Client</option>`;

  // Sort clients by surname (last part of the name)
  const sortedClients = clients.sort((a, b) => {
    const surnameA = a.name.split(" ").slice(-1)[0].toLowerCase(); // Get last name
    const surnameB = b.name.split(" ").slice(-1)[0].toLowerCase();
    return surnameA.localeCompare(surnameB);
  });

  // Add sorted clients to dropdown
  sortedClients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.name; // Full name
    option.textContent = client.name; // Full name
    clientDropdown.appendChild(option);
  });
}

// Fetch clients from backend and populate dropdown
function fetchAndPopulateClients() {
  fetch("http://localhost:3000/clients")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      return response.json();
    })
    .then((data) => {
      clients = data;
      console.log("clients: ", clients)
      const clientsArray = Object.entries(data).map(([clientName]) => ({
        name: clientName,
      }));
      populateClientDropdown(clientsArray); // Populate dropdown
    })
    .catch((error) => {
      console.error("Error fetching clients:", error);
    });
}

// Toggle visibility for the new client name input
document.getElementById("clientNameDropdown").addEventListener("change", (e) => {
  const newNameField = document.getElementById("newClientName");
  if (e.target.value === "new") {
    console.log("show:");
    newNameField.classList.remove("hidden"); // Show input
    newNameField.required = true;
  } else {
    console.log("hide:");
    newNameField.classList.add("hidden"); // Hide input
    newNameField.value = ""; // Reset value
    newNameField.required = false;
  }
});



// Handle form submission
document.getElementById("addClientForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const clientNameDropdown = document.getElementById("clientNameDropdown");
  const clientName =
    clientNameDropdown.value === "new"
      ? document.getElementById("newClientName").value
      : clientNameDropdown.value;

  const clientData = {
    clientName,
    driverName: document.getElementById("driverDropdown").value,
    payment: document.getElementById("clientAmount").value,
    paymentDate: document.getElementById("clientPaymentDate").value,
    paymentStatus: document.getElementById("paymentStatus").value,
    currency: document.getElementById("clientCurrency").value,
  };

  // Send data to the backend
  fetch("http://localhost:3000/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add client data");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      document.getElementById("addClientModal").classList.add("hidden");
      document.getElementById("addClientForm").reset();
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while adding client data.");
    });
});


// Close client modal
document.getElementById("closeClientModalBtn").addEventListener("click", () => {
  document.getElementById("addClientModal").classList.add("hidden");
});


  // Form submission
  document.getElementById("addDriverForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form data
    const driver = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      carModel: document.getElementById("carModel").value,
      licensePlate: document.getElementById("licensePlate").value,
      color: document.getElementById("colorCode").value,
    };

    // Save to backend
    fetch("http://localhost:3000/drivers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driver),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add driver");
        }
        return response.text();
      })
      .then((message) => {
        alert(message);
        fetchDrivers();
        // Reset form and close modal
        document.getElementById("addDriverModal").classList.add("hidden");
        document.getElementById("addDriverForm").reset();
        document.getElementById("colorCode").value = ""; // Reset color
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while adding the driver");
      });
  });


 // Handle color selection
document.querySelectorAll('.color-option').forEach((color) => {
  color.addEventListener('click', function () {
    // Remove selected class from all colors
    document.querySelectorAll('.color-option').forEach((btn) =>
      btn.classList.remove('selected')
    );

    // Add selected class to the clicked color
    this.classList.add('selected');

    // Update the color code input
    const colorCode = this.getAttribute('data-color');
    document.getElementById('colorCode').value = colorCode;
  });
});

    
  
    generateDriversCalendar(driversCurrentDate);
  
    document.getElementById("driversPrevMonth").addEventListener("click", () => {
      driversCurrentDate.setMonth(driversCurrentDate.getMonth() - 1);
      generateDriversCalendar(driversCurrentDate);
    });
  
    document.getElementById("driversNextMonth").addEventListener("click", () => {
      driversCurrentDate.setMonth(driversCurrentDate.getMonth() + 1);
      generateDriversCalendar(driversCurrentDate);
    });
  
    // Show modal when "Add Driver" button is clicked
  document.getElementById("addDriverBtn").addEventListener("click", () => {
    document.getElementById("addDriverModal").classList.remove("hidden");
  });

  // Close modal when "Close" button is clicked
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    document.getElementById("addDriverModal").classList.add("hidden");
  });

  
    
  
    document.getElementById("searchDriver").addEventListener("input", (e) => {
      const driverName = e.target.value.trim();
      const driverDetails = driverData[driverName];
      const detailsContainer = document.getElementById("driversDetails");
  
      if (driverDetails) {
        detailsContainer.innerHTML = `<p>Driver ${driverName} has ${driverDetails.length} records.</p>`;
      } else {
        detailsContainer.innerHTML = "<p>No records found for this driver.</p>";
      }
    });
  
  
  function generateDriversCalendar(date) {
    const driversCalendarGrid = document.getElementById("driversCalendarGrid");
    const driversMonthYear = document.getElementById("driversMonthYear");
    const driversDaysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  
    driversCalendarGrid.innerHTML = "";
    driversMonthYear.textContent = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  
    driversDaysOfWeek.forEach((day) => {
      const dayName = document.createElement("div");
      dayName.textContent = day;
      dayName.classList.add("day-name");
      driversCalendarGrid.appendChild(dayName);
    });
  
    const rawFirstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const firstDay = rawFirstDay === 0 ? 6 : rawFirstDay - 1;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      driversCalendarGrid.appendChild(emptyCell);
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateButton = document.createElement("button");
      dateButton.textContent = day;
      dateButton.classList.add("date");
      dateButton.addEventListener("dblclick", () => {
        document.getElementById("addClientModal").classList.remove("hidden");
        populateDriverDropdown();
        fetchAndPopulateClients();
      });
      driversCalendarGrid.appendChild(dateButton);
    }
  }
  
}


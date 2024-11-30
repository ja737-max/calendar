
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const mainContent = document.getElementById("mainContent");
  
    let activitiesCurrentDate = new Date();
  
    const activitiesData = {
      "2024-11-23": [
        { title: "Training Session", details: "4 drivers", time: "2:00 PM - 4:00 PM" },
        { title: "Pick Up", details: "5 drivers", time: "4:00 PM - 6:00 PM" },
      ],
      "2024-11-21": [
        { title: "Team Meeting", details: "10 participants", time: "10:00 AM - 11:30 AM" },
      ],
    };
  
    // Default content (Activities Tab)
    renderActivitiesTab();
  
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"));
        // Add active class to the clicked tab
        tab.classList.add("active");
  
        // Clear the main content
        mainContent.innerHTML = "";
  
        // Render content based on the clicked tab
        const tabName = tab.dataset.tab;
        if (tabName === "activities") {
          renderActivitiesTab();
        } else if (tabName === "drivers") {
          renderDriversTab(); 
        } else if (tabName === "clients") {
          renderClientsTab();
        }
      });
    });
  
    function renderActivitiesTab() {
      mainContent.innerHTML = `
        <div class="activities-calendar calendar">
          <div class="calendar-header">
            <button class="calendar-nav-btn" id="activitiesPrevMonth">&lt;</button>
            <span class="calendar-month" id="activitiesMonthYear"></span>
            <button class="calendar-nav-btn" id="activitiesNextMonth">&gt;</button>
          </div>
          <div class="calendar-grid" id="activitiesCalendarGrid">
            <!-- Days will be dynamically generated -->
          </div>
        </div>
  
        <div class="activities-list">
          <h2>Today's Activities</h2>
          <div id="activitiesList">
            <p>Select a date to see activities.</p>
          </div>
        </div>
      `;
  
      generateActivitiesCalendar(activitiesCurrentDate);
  
      // Add event listeners for navigation buttons
      document.getElementById("activitiesPrevMonth").addEventListener("click", () => {
        activitiesCurrentDate.setMonth(activitiesCurrentDate.getMonth() - 1);
        generateActivitiesCalendar(activitiesCurrentDate);
      });
  
      document.getElementById("activitiesNextMonth").addEventListener("click", () => {
        activitiesCurrentDate.setMonth(activitiesCurrentDate.getMonth() + 1);
        generateActivitiesCalendar(activitiesCurrentDate);
      });
    }
  
    function generateActivitiesCalendar(date) {
      const activitiesCalendarGrid = document.getElementById("activitiesCalendarGrid");
      const activitiesMonthYear = document.getElementById("activitiesMonthYear");
      const activitiesDaysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  
      activitiesCalendarGrid.innerHTML = "";
      activitiesMonthYear.textContent = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  
      activitiesDaysOfWeek.forEach((day) => {
        const dayName = document.createElement("div");
        dayName.textContent = day;
        dayName.classList.add("day-name");
        activitiesCalendarGrid.appendChild(dayName);
      });
  
      const rawFirstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      const firstDay = rawFirstDay === 0 ? 6 : rawFirstDay - 1;
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        activitiesCalendarGrid.appendChild(emptyCell);
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const dateButton = document.createElement("button");
        dateButton.textContent = day;
        dateButton.classList.add("date");
        dateButton.addEventListener("click", () => {
          showActivities(date, day);
        });
        activitiesCalendarGrid.appendChild(dateButton);
      }
    }
  
    function showActivities(date, day) {
      const selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
        selectedDate.getDate()
      ).padStart(2, "0")}`;
  
      document.querySelectorAll(".calendar-grid .date").forEach((btn) => btn.classList.remove("selected"));
      event.target.classList.add("selected");
  
      const activitiesList = document.getElementById("activitiesList");
      activitiesList.innerHTML = "";
  
      const dayActivities = activitiesData[formattedDate];
      if (dayActivities) {
        dayActivities.forEach((activity) => {
          const activityItem = document.createElement("div");
          activityItem.classList.add("activity-item");
  
          activityItem.innerHTML = `
            <div class="activity-icon">
              <img src="https://media.istockphoto.com/id/2130484271/vector/cars-line-icon-auto-car-mini-van-truck-tractor-4x4-sedan.jpg?b=1&s=170x170&k=20&c=AP62AdPjNase_62rFPwJI7MEw3E3I6EtDzeZyjRFOzs=" alt="Activity Icon">
            </div>
            <div class="activity-details">
              <p class="activity-title">${activity.title}</p>
              <div class="activity-meta">
                <p class="activity-details-info">${activity.details}</p>
                <p class="activity-time">${activity.time}</p>
              </div>
            </div>
            <div class="activity-action">&gt;</div>
          `;
  
          activitiesList.appendChild(activityItem);
        });
      } else {
        activitiesList.innerHTML = "<p>No activities for this date.</p>";
      }
    }
  });
  
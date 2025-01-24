// Validate the form on submit
function validateForm() {
  let valid = true;
  const inputs = ["input1", "input2", "input3", "input4"];

  inputs.forEach(function (inputId, index) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById("error" + (index + 1));

    if (!input.value.trim()) {
      errorSpan.textContent = "Please fill this field";
      errorSpan.style.display = "inline";
      valid = false;
    } else {
      errorSpan.style.display = "none";
    }
  });

  if (valid) {
    // Check if we're in edit mode
    const editingId = document.getElementById("editingId").value;
    if (editingId) {
      updateInfo(parseInt(editingId));
    } else {
      addInfo();
    }
  }
  return false;
}

// Add information to server
async function addInfo() {
  const input1 = document.getElementById("input1").value;
  const input2 = document.getElementById("input2").value;
  const input3 = document.getElementById("input3").value;
  const input4 = document.getElementById("input4").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input1, input2, input3, input4 }),
    });

    if (response.ok) {
      loadTableData();
      document.getElementById("infoForm").reset();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update existing information
async function updateInfo(id) {
  const input1 = document.getElementById("input1").value;
  const input2 = document.getElementById("input2").value;
  const input3 = document.getElementById("input3").value;
  const input4 = document.getElementById("input4").value;

  try {
    const response = await fetch(`http://127.0.0.1:5000/entries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input1, input2, input3, input4 }),
    });

    if (response.ok) {
      loadTableData();
      document.getElementById("infoForm").reset();
      document.getElementById("editingId").value = ""; // Clear editing ID
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load table data from server
async function loadTableData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/entries");
    const entries = await response.json();
    const tableBody = document.querySelector("#infoTable tbody");
    tableBody.innerHTML = "";

    entries.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.input1}</td>
        <td>${entry.input2}</td>
        <td>${entry.input3}</td>
        <td>${entry.input4}</td>
        <td>${entry.id}</td>
        <td>
          <button class="edit-btn" onclick="editInfo(${entry.id})">Edit</button>
          <button class="delete-btn" onclick="deleteInfo(${entry.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Edit information
async function editInfo(id) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/entries/${id}`);
    const entry = await response.json();

    document.getElementById("input1").value = entry.input1;
    document.getElementById("input2").value = entry.input2;
    document.getElementById("input3").value = entry.input3;
    document.getElementById("input4").value = entry.input4;

    // Store the ID of the entry being edited
    document.getElementById("editingId").value = entry.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete information
async function deleteInfo(id) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/entries/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadTableData();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Filter entries
async function filterInfo() {
  const query = document.getElementById("searchPatient").value.toLowerCase();

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/entries/search?q=${query}`
    );
    const filteredEntries = await response.json();

    const tableBody = document.querySelector("#infoTable tbody");
    tableBody.innerHTML = "";

    filteredEntries.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.input1}</td>
        <td>${entry.input2}</td>
        <td>${entry.input3}</td>
        <td>${entry.input4}</td>
        <td>${entry.id}</td>
        <td>
          <button class="edit-btn" onclick="editInfo(${entry.id})">Edit</button>
          <button class="delete-btn" onclick="deleteInfo(${entry.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Toggle form visibility based on search input
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = query.trim() !== "" ? "none" : "block";
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load data on page load
window.onload = loadTableData;

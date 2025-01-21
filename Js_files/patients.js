window.onload = function () {
  loadTableData();
};

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
    addInfo();
  }
  return false;
}

// Add information to localStorage
function addInfo() {
  const input1 = document.getElementById("input1").value;
  const input2 = document.getElementById("input2").value;
  const input3 = document.getElementById("input3").value;
  const input4 = document.getElementById("input4").value;

  // Generate a unique ID
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const newId = entries.length > 0 ? entries[entries.length - 1].id + 1 : 1;

  const newEntry = { id: newId, input1, input2, input3, input4 };
  entries.push(newEntry);
  localStorage.setItem("entries", JSON.stringify(entries));
  loadTableData();

  // Reset form
  document.getElementById("infoForm").reset();
}

// Load table data from localStorage
function loadTableData() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
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
        <button class="edit-btn" onclick="editInfo(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteInfo(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Edit information
function editInfo(index) {
  const entries = JSON.parse(localStorage.getItem("entries"));
  const entry = entries[index];
  document.getElementById("input1").value = entry.input1;
  document.getElementById("input2").value = entry.input2;
  document.getElementById("input3").value = entry.input3;
  document.getElementById("input4").value = entry.input4;

  // Remove entry to avoid duplication
  deleteInfo(index);
}

// Delete information
function deleteInfo(index) {
  let entries = JSON.parse(localStorage.getItem("entries"));
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));
  loadTableData();
}

// Filter patients
function filterInfo() {
  const query = document.getElementById("searchPatient").value.toLowerCase();
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const filteredEntries = entries.filter((entry) =>
    entry.input1.toLowerCase().includes(query)
  );

  const tableBody = document.querySelector("#infoTable tbody");
  tableBody.innerHTML = "";

  filteredEntries.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.input1}</td>
      <td>${entry.input2}</td>
      <td>${entry.input3}</td>
      <td>${entry.input4}</td>
      <td>${entry.id}</td>
      <td>
        <button class="edit-btn" onclick="editInfo(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteInfo(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

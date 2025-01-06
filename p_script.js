window.onload = function() {
    loadTableData();
};

// Add information to localStorage
function addInfo() {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;
    const input4 = document.getElementById('input4').value;
    const input5 = document.getElementById('input5').value;

    let valid = true;

    // Validate each input field and show error if empty
    if (!input1) {
        document.getElementById('error1').textContent = "Please fill this field";
        document.getElementById('error1').style.display = 'inline';
        valid = false;
    } else {
        document.getElementById('error1').style.display = 'none';
    }

    if (!input2) {
        document.getElementById('error2').textContent = "Please fill this field";
        document.getElementById('error2').style.display = 'inline';
        valid = false;
    } else {
        document.getElementById('error2').style.display = 'none';
    }

    if (!input3) {
        document.getElementById('error3').textContent = "Please fill this field";
        document.getElementById('error3').style.display = 'inline';
        valid = false;
    } else {
        document.getElementById('error3').style.display = 'none';
    }

    if (!input4) {
        document.getElementById('error4').textContent = "Please fill this field";
        document.getElementById('error4').style.display = 'inline';
        valid = false;
    } else {
        document.getElementById('error4').style.display = 'none';
    }

    if (!input5) {
        document.getElementById('error5').textContent = "Please fill this field";
        document.getElementById('error5').style.display = 'inline';
        valid = false;
    } else {
        document.getElementById('error5').style.display = 'none';
    }

    // If all fields are filled, add the data to localStorage
    if (valid) {
        const newEntry = { input1, input2, input3, input4, input5 };
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(newEntry);
        localStorage.setItem('entries', JSON.stringify(entries));
        loadTableData();
        document.getElementById('infoForm').reset();
    }
}

// Load table data from localStorage
function loadTableData() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const tableBody = document.querySelector('#infoTable tbody');
    tableBody.innerHTML = '';

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.input1}</td>
            <td>${entry.input2}</td>
            <td>${entry.input3}</td>
            <td>${entry.input4}</td>
            <td>${entry.input5}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editInfo(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteInfo(${index})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit information
function editInfo(index) {
    const entries = JSON.parse(localStorage.getItem('entries'));
    const entry = entries[index];
    document.getElementById('input1').value = entry.input1;
    document.getElementById('input2').value = entry.input2;
    document.getElementById('input3').value = entry.input3;
    document.getElementById('input4').value = entry.input4;
    document.getElementById('input5').value = entry.input5;

    // Remove the entry and re-add it after update
    deleteInfo(index);
}

// Delete information
function deleteInfo(index) {
    let entries = JSON.parse(localStorage.getItem('entries'));
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    loadTableData();
}

        // Load saved data from localStorage on page load
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

            if (input1 && input2 && input3 && input4 && input5) {
                const newEntry = { input1, input2, input3, input4, input5 };
                let entries = JSON.parse(localStorage.getItem('entries')) || [];
                entries.push(newEntry);
                localStorage.setItem('entries', JSON.stringify(entries));
                loadTableData();
                document.getElementById('infoForm').reset();
            } else {
                alert("Please fill in all fields.");
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

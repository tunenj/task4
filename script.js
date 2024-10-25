document.addEventListener('DOMContentLoaded', () => {
    const medicineClassInput = document.getElementById('medicineClassInput');
    const suggestionsContainer = document.getElementById('suggestions');
    const loadingIndicator = document.getElementById('loading');

    medicineClassInput.addEventListener('mouseenter', () => {
        loadingIndicator.style.display = 'block'; 
        fetchMedicineClasses();
    });

    medicineClassInput.addEventListener('input', () => {
        const query = medicineClassInput.value;
        if (query) {
            filterSuggestions(query);
        } else {
            suggestionsContainer.innerHTML = ''; 
        }
    });

    // Fetch the medicine classes from the API
    async function fetchMedicineClasses() {
        try {
            const response = await fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class');
            const data = await response.json();
            console.log('API Response:', data);
            displaySuggestions(data);
        } catch (error) {
            console.error('Error fetching medicine classes:', error);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    
    function displaySuggestions(data) {
        suggestionsContainer.innerHTML = '';

        if (Array.isArray(data)) {
            data.forEach(item => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                
               
                if (item.class_name || item.name) {
                    suggestionItem.textContent = item.class_name || item.name;
                    suggestionItem.onclick = () => {
                        medicineClassInput.value = item.class_name || item.name; 
                        fetchMedicineClassById(item.id); 
                        suggestionsContainer.innerHTML = ''; 
                    };
                    suggestionsContainer.appendChild(suggestionItem);
                } else {
                    console.error('name not found in item:', item);
                }
            });
        } else {
            console.error('Unexpected data format:', data);
        }
    }

  
function displaySuggestions(data) {
    suggestionsContainer.innerHTML = ''; 

    if (Array.isArray(data)) {
        data.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            if (item.name) {
                suggestionItem.textContent = item.name;
                suggestionItem.onclick = () => {
                    medicineClassInput.value = item.name; 
                    suggestionsContainer.innerHTML = ''; 

                   
                    fetchMedicineClassById(item.id);
                };
                suggestionsContainer.appendChild(suggestionItem);
            } else {
                console.error('name not found in item:', item);
            }
        });
    } else {
        console.error('Unexpected data format:', data);
    }
}

async function fetchMedicineClassById(medicineId) {
    const medicineList = document.getElementById("medicineList");
    medicineList.innerHTML = ''; 

    try {
        const response = await fetch(`https://cliniqueplushealthcare.com.ng/prescriptions/get_drug_class_by_id/${medicineId}`);
        const medicineClassArray = await response.json();

        console.log("API Response for Medicine Class by ID:", medicineClassArray); 

        if (Array.isArray(medicineClassArray) && medicineClassArray.length > 0) {
            medicineClassArray.forEach(med => {
                console.log(med); 
                const medicineItem = document.createElement("div");
                medicineItem.innerText = med.medicine_name; 
                medicineItem.className = "medicine-item";  

                
                medicineItem.onclick = function() {
                    document.getElementById("medicineNameInput").value = med.medicine_name;
                    medicineList.style.display = "none"; 
                };

                medicineList.appendChild(medicineItem);
            });

            medicineList.style.display = "block";
        } else {
            medicineList.innerHTML = "<div>No medicines found for this class.</div>";
        }
    } catch (error) {
        console.error("Error fetching medicine class by ID:", error);
        medicineList.innerHTML = "<div>Error loading medicines. Please try again.</div>";
    }
}


    
    function filterSuggestions(query) {
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');
        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(query.toLowerCase())) {
                item.style.display = 'block'; 
            } else {
                item.style.display = 'none'; 
            }
        });
    }

  
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("medicineClassDropdown");
    const medicineList = document.getElementById("medicineList");
    const inputClass = document.getElementById("medicineClassInput");
    const inputName = document.getElementById("medicineNameInput");
    const closeButton = document.getElementById("closeDropdown");

  
    if (dropdown && !dropdown.contains(event.target) && event.target !== inputClass && event.target !== closeButton) {
        dropdown.style.display = "none";
    }

 
    if (medicineList && !medicineList.contains(event.target) && event.target !== inputName) {
        medicineList.style.display = "none"; 
    }
 });

});

document.addEventListener('DOMContentLoaded', function() {
    const medicineClassInput = document.getElementById('medicineClassInput');
    const suggestions = document.getElementById('suggestions');
    const closeBtn = document.getElementById('closeSuggestionsBtn');
    const tableBody = document.getElementById("prescribed-drugs-list");
    const noDrugMessage = document.getElementById("no-drug-message"); 

   
    if (!tableBody) {
        console.error("Table body with id 'prescribed-drugs-list' not found.");
        return;
    }

  
    document.getElementById("add-button").addEventListener("click", function() {
        const medicineClass = document.getElementById("medicineClassInput").value;
        const medicineName = document.getElementById("medicineNameInput").value;
        const dose = document.getElementById("dose").value;
        const duration = document.getElementById("duration").value;
        const instructions = document.getElementById("instructions").value;

       
        if (!medicineClass || !medicineName || !dose || !duration) {
            alert("Please fill all fields before adding a prescription!");
            return;
        }

    
        if (noDrugMessage) {
            noDrugMessage.style.display = 'none';
        }

    
        const row = document.createElement("tr");

    
        row.innerHTML = `
            <td>${tableBody.children.length + 1}</td> <!-- S/N -->
            <td>${medicineName}</td>
            <td>${medicineClass}</td>
            <td>${dose}</td>
            <td>${duration}</td>
            <td>${instructions}</td>
            <td><button class="remove-button">Remove</button></td>
        `;

        tableBody.appendChild(row);

        row.querySelector(".remove-button").addEventListener("click", function() {
            row.remove();
            updateSerialNumbers(); 
            if (tableBody.children.length === 0) {
                noDrugMessage.style.display = ''; 
            }
        });
    });

   
    function updateSerialNumbers() {
        const rows = document.querySelectorAll("#prescribed-drugs-list tr");
        rows.forEach((row, index) => {
            row.querySelector("td").textContent = index + 1;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const donePrescribingBtn = document.getElementById('done-prescribing-btn');
    const savePrescriptionSection = document.getElementById('save-prescription-section');
    const savePrescriptionBtn = document.getElementById('save-prescription-btn');


    donePrescribingBtn.addEventListener('click', function() {
        donePrescribingBtn.style.display = 'none'; 
        savePrescriptionSection.style.display = 'block';
    });

    savePrescriptionBtn.addEventListener('click', function() {
        const remarks = document.getElementById('remarks').value;
        
        if (remarks.trim() === "") {
            alert("Please provide remarks before saving the prescription.");
            return;
        }
        alert("Prescription saved successfully with remarks: " + remarks);
    });
});




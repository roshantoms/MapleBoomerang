// Wait for the animation to complete before showing country buttons
setTimeout(() => {
    document.querySelector('.country-selector').style.opacity = '1';
}, 1500);

function showForm(country) {
  const overlay = document.querySelector('.forms-overlay');
  
  // Hide all forms
  document.querySelectorAll('.form-container').forEach(form => {
    form.style.display = 'none';
  });
  
  // Show the selected form
  const form = document.getElementById(`${country}-form`);
  form.style.display = 'block';
  
  // Add close button if not already there
  if (!form.querySelector('.close-form')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-form';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => {
      overlay.classList.remove('active');
    };
    form.prepend(closeBtn);
  }
  
  // Hide any existing results
  document.getElementById(`${country}-result`).style.display = 'none';
  
  // Show overlay
  overlay.classList.add('active');
}

// Close form when clicking outside
document.querySelector('.forms-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
});

// Helper function to calculate age from birthdate
function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Helper function to calculate years between two dates
function calculateYearsBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.floor(years));
}

// Function to change work location visibility
function changeWorkLocation(select) {
    const group = select.closest('.work-experience-group');
    const selectedValue = select.value;
    
    // Hide all options
    group.querySelectorAll('.work-location-option').forEach(option => {
        option.classList.remove('active');
        option.querySelectorAll('input[type="date"]').forEach(input => {
            input.removeAttribute('required');
        });
    });
    
    // Show selected option
    const activeOption = group.querySelector(`.work-location-option.${selectedValue}`);
    activeOption.classList.add('active');
    activeOption.querySelectorAll('input[type="date"]').forEach(input => {
        input.setAttribute('required', 'true');
    });
}

// Function to add work experience fields
function addWorkExp(type) {
    const containerId = `${type}-work-experiences`;
    const container = document.getElementById(containerId);
    
    const newGroup = document.createElement('div');
    newGroup.className = 'work-experience-group';
    
    if (type === 'canada') {
        newGroup.innerHTML = `
            <button type="button" class="remove-work-exp" onclick="removeWorkExp(this)">×</button>
            <div class="date-input-group">
                <div>
                    <label>Start Date</label>
                    <input type="date" class="work-start" required>
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" class="work-end" required>
                </div>
            </div>
        `;
    } else { // australia
        newGroup.innerHTML = `
            <button type="button" class="remove-work-exp" onclick="removeWorkExp(this)">×</button>
            <div class="work-location-selector">
                <label>Location</label>
                <select class="work-location" onchange="changeWorkLocation(this)">
                    <option value="outside">Outside Australia</option>
                    <option value="inside">In Australia</option>
                </select>
            </div>
            
            <div class="work-location-option outside active">
                <div class="date-input-group">
                    <div>
                        <label>Start Date (Outside Australia)</label>
                        <input type="date" class="work-start-outside" required>
                    </div>
                    <div>
                        <label>End Date (Outside Australia)</label>
                        <input type="date" class="work-end-outside" required>
                    </div>
                </div>
            </div>
            
            <div class="work-location-option inside">
                <div class="date-input-group">
                    <div>
                        <label>Start Date (In Australia)</label>
                        <input type="date" class="work-start-inside" required>
                    </div>
                    <div>
                        <label>End Date (In Australia)</label>
                        <input type="date" class="work-end-inside" required>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.appendChild(newGroup);

    const initialLocationSelect = newGroup.querySelector('.work-location');
    if (initialLocationSelect) {
        changeWorkLocation(initialLocationSelect); // Call it to set initial required attributes
    }
}

// Helper function to remove work experience fields
function removeWorkExp(button) {
    const group = button.parentElement;
    const container = group.parentElement;
    
    // Don't allow removing the last work experience
    if (container.querySelectorAll('.work-experience-group').length > 1) {
        container.removeChild(group);
    }
}

// Helper function to calculate total years from multiple date ranges (Canada)
function calculateTotalYearsCanada(containerId) {
    const groups = document.querySelectorAll(`#${containerId} .work-experience-group`);
    let totalYears = 0;
    
    groups.forEach(group => {
        const startDate = group.querySelector('.work-start').value;
        const endDate = group.querySelector('.work-end').value;
        
        if (startDate && endDate) {
            totalYears += calculateYearsBetween(startDate, endDate);
        }
    });
    
    return totalYears;
}

// Helper function to calculate total years from multiple date ranges (Australia)
function calculateTotalYearsAustralia(containerId) {
    const groups = document.querySelectorAll(`#${containerId} .work-experience-group`);
    let outsideYears = 0;
    let insideYears = 0;

    groups.forEach(group => {
        const locationSelect = group.querySelector('.work-location');
        const location = locationSelect ? locationSelect.value : 'outside'; // default to outside

        if (location === 'outside') {
            const startInput = group.querySelector('.work-start-outside');
            const endInput = group.querySelector('.work-end-outside');

            // Only consider if inputs are visible (i.e., required) and have values
            if (startInput && endInput && startInput.hasAttribute('required') && startInput.value && endInput.value) {
                outsideYears += calculateYearsBetween(startInput.value, endInput.value);
            }
        }

        if (location === 'inside') {
            const startInput = group.querySelector('.work-start-inside');
            const endInput = group.querySelector('.work-end-inside');

            // Only consider if inputs are visible (i.e., required) and have values
            if (startInput && endInput && startInput.hasAttribute('required') && startInput.value && endInput.value) {
                insideYears += calculateYearsBetween(startInput.value, endInput.value);
            }
        }
    });
    
    return { outsideYears, insideYears };
}

// Canada Calculator
document.getElementById('canadaCalculator').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get values
    const birthdate = document.getElementById('canada-birthdate').value;
    const age = calculateAge(birthdate);
    const education = parseInt(document.getElementById('canada-education').value);
    const experience = calculateTotalYearsCanada('canada-work-experiences');
    const ielts = parseInt(document.getElementById('canada-ielts').value);
    const relatives = parseInt(document.getElementById('canada-relatives').value);
    
    // Calculate points
    let agePoints = 0;
    if (age >= 18 && age <= 35) agePoints = 12;
    else if (age == 36) agePoints = 11;
    else if (age == 37) agePoints = 10;
    else if (age == 38) agePoints = 9;
    else if (age == 39) agePoints = 8;
    else if (age == 40) agePoints = 7;
    else if (age == 41) agePoints = 6;
    else if (age == 42) agePoints = 5;
    else if (age == 43) agePoints = 4;
    else if (age == 44) agePoints = 3;
    else if (age == 45) agePoints = 2;
    else if (age == 46) agePoints = 1;
    else if (age > 47) agePoints = 0;
    
    let experiencePoints = 0;
    if (experience >= 1 && experience < 2) experiencePoints = 9;
    else if (experience >= 2 && experience < 4) experiencePoints = 11;
    else if (experience >= 4 && experience < 6) experiencePoints = 13;
    else if (experience >= 6) experiencePoints = 15;
    
    const totalPoints = agePoints + education + experiencePoints + ielts + relatives;
    
    // Display result
    const resultDiv = document.getElementById('canada-result');
    const pointsDiv = document.getElementById('canada-points');
    const messageDiv = document.getElementById('canada-message');
    
    pointsDiv.textContent = `Total Points: ${totalPoints}`;
    
    if (totalPoints >= 67) {
        resultDiv.className = 'result eligible';
        messageDiv.textContent = 'This candidate meets the eligibility criteria and may proceed with the application.';
    } else {
        resultDiv.className = 'result ineligible';
        messageDiv.textContent = `This candidate does not meet the minimum points requirement of 67. They need ${67 - totalPoints} more point(s).`;
    }
    
    resultDiv.style.display = 'block';
});

// Australia Calculator
document.getElementById('australiaCalculator').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get values
    const birthdate = document.getElementById('australia-birthdate').value;
    const age = calculateAge(birthdate);
    const ielts = parseInt(document.getElementById('australia-ielts').value);
    const education = parseInt(document.getElementById('australia-education').value);
    
    // Calculate work experience
    const { outsideYears, insideYears } = calculateTotalYearsAustralia('australia-work-experiences');
    
    let experience = 0;
    if (outsideYears >= 3 && outsideYears < 5) experience = 5;
    else if (outsideYears >= 5 && outsideYears < 8) experience = 10;
    else if (outsideYears >= 8) experience = 15;
    
    let ausExperience = 0;
    if (insideYears >= 1 && insideYears < 3) ausExperience = 5;
    else if (insideYears >= 3 && insideYears < 5) ausExperience = 10;
    else if (insideYears >= 5 && insideYears < 8) ausExperience = 15;
    else if (insideYears >= 8) ausExperience = 20;
    
    const partner = parseInt(document.getElementById('australia-partner').value);
    
    // Calculate age points
    let agePoints = 0;
    if (age >= 18 && age <= 24) agePoints = 25;
    else if (age >= 25 && age <= 32) agePoints = 30;
    else if (age >= 33 && age <= 39) agePoints = 25;
    else if (age >= 40 && age <= 44) agePoints = 15;
    else if (age >= 45) agePoints = 0;
    
    // Calculate total points
    const totalPoints = agePoints + ielts + education + experience + ausExperience + partner;
    
    // Display result
    const resultDiv = document.getElementById('australia-result');
    const pointsDiv = document.getElementById('australia-points');
    const messageDiv = document.getElementById('australia-message');
    
    pointsDiv.textContent = `Total Points: ${totalPoints}`;
    
    if (totalPoints >= 65) {
        resultDiv.className = 'result eligible';
        messageDiv.textContent = 'This candidate meets the eligibility criteria and may proceed with the application.';
    } else {
        resultDiv.className = 'result ineligible';
        messageDiv.textContent = `This candidate does not meet the minimum points requirement 65. They need ${65 - totalPoints} more point(s).`;
    }
    
    resultDiv.style.display = 'block';
});

// Dark Mode Toggle
const toggleBtn = document.getElementById('darkModeToggle');
const icon = document.getElementById('toggleIcon');
const body = document.body;

// Set icon based on saved theme
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');

  icon.classList.toggle('fa-sun', isDark);
  icon.classList.toggle('fa-moon', !isDark);

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
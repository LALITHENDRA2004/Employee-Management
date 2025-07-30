// Base URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/employees';

// DOM elements
const employeeForm = document.getElementById('employee-form');
const employeeTable = document.getElementById('employee-tbody');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const successDiv = document.getElementById('success-message');

// Form fields
const employeeIdField = document.getElementById('employee-id');
const firstNameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const emailField = document.getElementById('email');

let isEditMode = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
    
    // Form submit event
    employeeForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel button event
    cancelBtn.addEventListener('click', resetForm);
});

// Load all employees
async function loadEmployees() {
    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        displayEmployees(employees);
        hideMessages();
    } catch (error) {
        console.error('Error loading employees:', error);
        showError('Failed to load employees. Please check if the backend server is running.');
    } finally {
        showLoading(false);
    }
}

// Display employees in table
function displayEmployees(employees) {
    employeeTable.innerHTML = '';
    
    if (employees.length === 0) {
        employeeTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">No employees found</td></tr>';
        return;
    }
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee(${employee.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
        employeeTable.appendChild(row);
    });
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const employeeData = {
        firstName: firstNameField.value.trim(),
        lastName: lastNameField.value.trim(),
        email: emailField.value.trim()
    };
    
    if (isEditMode) {
        await updateEmployee(employeeIdField.value, employeeData);
    } else {
        await createEmployee(employeeData);
    }
}

// Create new employee
async function createEmployee(employeeData) {
    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showSuccess('Employee created successfully!');
        resetForm();
        loadEmployees();
    } catch (error) {
        console.error('Error creating employee:', error);
        showError('Failed to create employee. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Update employee
async function updateEmployee(id, employeeData) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showSuccess('Employee updated successfully!');
        resetForm();
        loadEmployees();
    } catch (error) {
        console.error('Error updating employee:', error);
        showError('Failed to update employee. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Edit employee
async function editEmployee(id) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employee = await response.json();
        
        // Fill form with employee data
        employeeIdField.value = employee.id;
        firstNameField.value = employee.firstName;
        lastNameField.value = employee.lastName;
        emailField.value = employee.email;
        
        // Switch to edit mode
        isEditMode = true;
        formTitle.textContent = 'Edit Employee';
        submitBtn.textContent = 'Update Employee';
        cancelBtn.style.display = 'inline-block';
        
        hideMessages();
    } catch (error) {
        console.error('Error loading employee:', error);
        showError('Failed to load employee data.');
    } finally {
        showLoading(false);
    }
}

// Delete employee
async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showSuccess('Employee deleted successfully!');
        loadEmployees();
    } catch (error) {
        console.error('Error deleting employee:', error);
        showError('Failed to delete employee. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Reset form to add mode
function resetForm() {
    employeeForm.reset();
    employeeIdField.value = '';
    isEditMode = false;
    formTitle.textContent = 'Add New Employee';
    submitBtn.textContent = 'Add Employee';
    cancelBtn.style.display = 'none';
    hideMessages();
}

// Utility functions for messages
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
}

function showSuccess(message) {
    hideMessages();
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

function showError(message) {
    hideMessages();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideMessages() {
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';
}

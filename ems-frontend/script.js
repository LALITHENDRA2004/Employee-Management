// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/employees'; // Adjust this to match your Spring Boot backend URL

// Global State
let employees = [];
let currentEmployeeId = null;
let isEditMode = false;

// DOM Elements
const employeeGrid = document.getElementById('employeeGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const employeeModal = document.getElementById('employeeModal');
const deleteModal = document.getElementById('deleteModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtn = document.getElementById('saveBtn');
const toast = document.getElementById('toast');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize Application
async function initializeApp() {
    showLoading();
    await fetchEmployees();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Employee Button
    document.getElementById('addEmployeeBtn').addEventListener('click', openAddModal);
    
    // Modal close buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeEmployeeModal);
    document.getElementById('closeDeleteModalBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    
    // Form submission
    employeeForm.addEventListener('submit', handleFormSubmit);
    
    // Delete confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteConfirm);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Close modal when clicking outside
    employeeModal.addEventListener('click', function(e) {
        if (e.target === employeeModal) {
            closeEmployeeModal();
        }
    });
    
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// API Functions
async function fetchEmployees() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        employees = await response.json();
        displayEmployees(employees);
        hideLoading();
    } catch (error) {
        console.error('Error fetching employees:', error);
        showToast('Failed to load employees. Please check your connection and try again.', 'error');
        hideLoading();
        showEmptyState();
    }
}

async function createEmployee(employeeData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }
        
        const newEmployee = await response.json();
        employees.push(newEmployee);
        displayEmployees(employees);
        showToast('Employee added successfully!', 'success');
        return newEmployee;
    } catch (error) {
        console.error('Error creating employee:', error);
        showToast('Failed to add employee. Please try again.', 'error');
        throw error;
    }
}

async function updateEmployee(id, employeeData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }
        
        const updatedEmployee = await response.json();
        const index = employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            employees[index] = updatedEmployee;
        }
        displayEmployees(employees);
        showToast('Employee updated successfully!', 'success');
        return updatedEmployee;
    } catch (error) {
        console.error('Error updating employee:', error);
        showToast('Failed to update employee. Please try again.', 'error');
        throw error;
    }
}

async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        employees = employees.filter(emp => emp.id !== id);
        displayEmployees(employees);
        showToast('Employee deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting employee:', error);
        showToast('Failed to delete employee. Please try again.', 'error');
        throw error;
    }
}

// UI Functions
function displayEmployees(employeeList) {
    if (employeeList.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    employeeGrid.innerHTML = employeeList.map(employee => `
        <div class="employee-card" data-employee-id="${employee.id}">
            <div class="employee-info">
                <h3 class="employee-name">${escapeHtml(employee.firstName)} ${escapeHtml(employee.lastName)}</h3>
                <div class="employee-email">
                    <i class="fas fa-envelope"></i>
                    ${escapeHtml(employee.email)}
                </div>
            </div>
            <div class="employee-actions">
                <button class="btn btn-secondary btn-icon" onclick="openEditModal(${employee.id})" title="Edit Employee">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-icon" onclick="openDeleteModal(${employee.id})" title="Delete Employee">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showLoading() {
    loadingSpinner.style.display = 'flex';
    employeeGrid.style.display = 'none';
    emptyState.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    employeeGrid.style.display = 'grid';
}

function showEmptyState() {
    emptyState.style.display = 'block';
    employeeGrid.style.display = 'none';
}

function hideEmptyState() {
    emptyState.style.display = 'none';
    employeeGrid.style.display = 'grid';
}

// Modal Functions
function openAddModal() {
    isEditMode = false;
    currentEmployeeId = null;
    modalTitle.textContent = 'Add New Employee';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Employee';
    resetForm();
    showModal(employeeModal);
}

function openEditModal(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    isEditMode = true;
    currentEmployeeId = employeeId;
    modalTitle.textContent = 'Edit Employee';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Employee';
    
    // Populate form with employee data
    document.getElementById('firstName').value = employee.firstName;
    document.getElementById('lastName').value = employee.lastName;
    document.getElementById('email').value = employee.email;
    
    clearErrors();
    showModal(employeeModal);
}

function openDeleteModal(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    currentEmployeeId = employeeId;
    document.getElementById('deleteEmployeeDetails').textContent = 
        `${employee.firstName} ${employee.lastName} (${employee.email})`;
    
    showModal(deleteModal);
}

function closeEmployeeModal() {
    hideModal(employeeModal);
    resetForm();
    currentEmployeeId = null;
    isEditMode = false;
}

function closeDeleteModal() {
    hideModal(deleteModal);
    currentEmployeeId = null;
}

function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Form Functions
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(employeeForm);
    const employeeData = {
        firstName: formData.get('firstName').trim(),
        lastName: formData.get('lastName').trim(),
        email: formData.get('email').trim()
    };
    
    // Disable save button during submission
    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        if (isEditMode) {
            await updateEmployee(currentEmployeeId, employeeData);
        } else {
            await createEmployee(employeeData);
        }
        closeEmployeeModal();
    } catch (error) {
        // Error handling is done in the API functions
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

function validateForm() {
    clearErrors();
    let isValid = true;
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!firstName) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    } else if (firstName.length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    if (!lastName) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else if (isEmailTaken(email)) {
        showFieldError('email', 'This email is already registered');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    field.classList.add('error');
    errorElement.textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.form-input');
    
    errorElements.forEach(element => element.textContent = '');
    inputElements.forEach(element => element.classList.remove('error'));
}

function resetForm() {
    employeeForm.reset();
    clearErrors();
}

// Delete Functions
async function handleDeleteConfirm() {
    if (!currentEmployeeId) return;
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    
    try {
        await deleteEmployee(currentEmployeeId);
        closeDeleteModal();
    } catch (error) {
        // Error handling is done in the API function
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
    }
}

// Search Function
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayEmployees(employees);
        return;
    }
    
    const filteredEmployees = employees.filter(employee => 
        employee.firstName.toLowerCase().includes(searchTerm) ||
        employee.lastName.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm)
    );
    
    displayEmployees(filteredEmployees);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isEmailTaken(email) {
    return employees.some(employee => 
        employee.email.toLowerCase() === email.toLowerCase() && 
        employee.id !== currentEmployeeId
    );
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showToast(message, type = 'success') {
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set icon based on type
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toastIcon.className = iconMap[type] || iconMap.success;
    toastMessage.textContent = message;
    
    // Remove existing type classes and add new one
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Global functions for button onclick handlers
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
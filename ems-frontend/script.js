// API Configuration
const API_BASE_URL = 'https://employee-management-dcf9.onrender.com/api/employees';

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
const profileButton = document.getElementById('profile-button');
const userInfoDiv = document.getElementById('user-info');
const accountDetails = document.getElementById('account-details');
const accountUsername = document.getElementById('account-username');
const logoutBtn = document.getElementById('logout-button');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  initializeUserInfo();
});

// Initialize Application - fetch employees
async function initializeApp() {
  showLoading();
  await fetchEmployees();
}

// Setup Event Listeners
function setupEventListeners() {
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

  // Search functionality (with debounce)
  let debounceTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => handleSearch(e), 300);
  });

  // Close modals by clicking outside
  employeeModal.addEventListener('click', (e) => {
    if (e.target === employeeModal) closeEmployeeModal();
  });
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });

  // Profile button toggles user account details
  profileButton.addEventListener('click', toggleAccountDetails);

  // Logout button handler
  logoutBtn.addEventListener('click', handleLogout);

  // Close account details if click outside
  document.addEventListener('click', (event) => {
    if (!userInfoDiv.contains(event.target)) {
      accountDetails.style.display = 'none';
      profileButton.setAttribute('aria-expanded', 'false');
    }
  });
}

// User Info Initialization and Redirect if not logged in
function initializeUserInfo() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'login.html';
    return;
  }
  // Show user info section
  userInfoDiv.style.display = 'flex';

  // Profile button: first uppercase letter
  const initial = loggedInUser.charAt(0).toUpperCase();
  profileButton.textContent = initial;
  profileButton.setAttribute('aria-expanded', 'false');
  profileButton.setAttribute('aria-haspopup', 'true');
  profileButton.setAttribute('aria-label', 'User menu');

  // Populating new profile dropdown fields
  const headerAvatar = document.getElementById('header-avatar');
  if (headerAvatar) headerAvatar.textContent = initial;
  if (accountUsername) accountUsername.textContent = loggedInUser;
}

// Toggle user account details panel visibility
function toggleAccountDetails() {
  if (accountDetails.style.display === 'block') {
    accountDetails.style.display = 'none';
    profileButton.setAttribute('aria-expanded', 'false');
  } else {
    accountDetails.style.display = 'block';
    profileButton.setAttribute('aria-expanded', 'true');
  }
}

// Handle logout action
function handleLogout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = './loginpage/login.html';
}

// ------------ API Functions ------------

async function fetchEmployees() {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    employees = await response.json();
    displayEmployees(employees);
    hideLoading();
  } catch (error) {
    console.error('Error fetching employees:', error);
    showToast('Failed to load employees.', 'error');
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
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      },
      body: JSON.stringify(employeeData),
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
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }
    const updatedEmployee = await response.json();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) employees[index] = updatedEmployee;
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
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    employees = employees.filter(emp => emp.id !== id);
    displayEmployees(employees);
    showToast('Employee deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting employee:', error);
    showToast('Failed to delete employee. Please try again.', 'error');
    throw error;
  }
}


// ------------ UI Functions ------------

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

// ------------- Modal Functions -------------

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

// ------------ Form Functions ------------

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const formData = new FormData(employeeForm);
  const employeeData = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    email: formData.get('email').trim()
  };

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
    console.error("Error creating/updating employee:", error);
    showToast("Failed to add/update employee. This email is already registered", 'error');
    showFieldError('email', 'This email is already registered');
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
  errorElements.forEach(el => (el.textContent = ''));
  inputElements.forEach(el => el.classList.remove('error'));
}

function resetForm() {
  employeeForm.reset();
  clearErrors();
}

// ------------ Delete Functions -------------

async function handleDeleteConfirm() {
  if (!currentEmployeeId) return;

  const confirmBtn = document.getElementById('confirmDeleteBtn');
  confirmBtn.disabled = true;
  const originalText = confirmBtn.innerHTML;
  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

  try {
    await deleteEmployee(currentEmployeeId);
    closeDeleteModal();
  } catch (_) { } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = originalText;
  }
}

// ------------ Search Function ------------

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

// ------------ Utility Functions ------------

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isEmailTaken(email) {
  return employees.some(
    (employee) => employee.email.toLowerCase() === email.toLowerCase() && employee.id !== currentEmployeeId
  );
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ------------ Toast Notification ------------

function showToast(message, type = 'success') {
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  };

  toastIcon.className = iconMap[type] || iconMap.success;
  toastMessage.textContent = message;

  toast.className = `toast ${type}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Expose modal open functions globally for inline onclick handlers
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

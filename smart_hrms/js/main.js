// Store and load data from localStorage
function getStore(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// App state
let role = getStore('role', 'Admin');
let darkMode = getStore('dark', false);

// Change role and update UI
function setRole(newRole) {
  role = newRole;
  setStore('role', newRole);
  document.getElementById('currentRole').innerText = newRole;
  applyRolePermissions(newRole);
}

// Toggle light/dark theme
function toggleTheme() {
  darkMode = !darkMode;
  setStore('dark', darkMode);
  document.body.classList.toggle('dark', darkMode);

  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
    icon.title = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// Show/hide buttons based on role
function applyRolePermissions(currentRole) {
  const addBtns = document.querySelectorAll('.btn-add');
  const editBtns = document.querySelectorAll('.btn-edit');
  const deleteBtns = document.querySelectorAll('.btn-delete');
  const restrictedElements = document.querySelectorAll('[data-role-restricted]');

  if (currentRole === 'Admin') {
    addBtns.forEach(b => b.style.display = '');
    editBtns.forEach(b => b.style.display = '');
    deleteBtns.forEach(b => b.style.display = '');
  } else if (currentRole === 'HR') {
    addBtns.forEach(b => b.style.display = '');
    editBtns.forEach(b => b.style.display = '');
    deleteBtns.forEach(b => b.style.display = 'none');
  } else {
    addBtns.forEach(b => b.style.display = 'none');
    editBtns.forEach(b => b.style.display = 'none');
    deleteBtns.forEach(b => b.style.display = 'none');
  }

  restrictedElements.forEach(el => {
    const allowedRoles = el.dataset.roleRestricted.split(',');
    el.style.display = allowedRoles.includes(currentRole) ? '' : 'none';
  });
}

// Sidebar toggle for mobile
function initSidebarToggle() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebarMenu');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth < 992) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    }
  });
}

// Monthly/Yearly report links
function initReportLinks() {
  const btnMonthly = document.getElementById("btnMonthly");
  const btnYearly = document.getElementById("btnYearly");

  if (btnMonthly) {
    btnMonthly.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "reports.html?type=monthly";
    });
  }
  if (btnYearly) {
    btnYearly.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "reports.html?type=yearly";
    });
  }
}

// Start app
function initApp() {
  document.body.classList.toggle('dark', darkMode);

  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
    icon.title = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  document.getElementById('currentRole').innerText = role;

  document.querySelectorAll('.role-select').forEach(item => {
    item.addEventListener('click', () => setRole(item.getAttribute('data-role')));
  });

  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  applyRolePermissions(role);
  initSidebarToggle();
  initReportLinks();
}

// Run after page loads
document.addEventListener('DOMContentLoaded', initApp);

const Employees = (() => {
  let data = JSON.parse(localStorage.getItem('employees') || '[]');
  let sortConfig = { key: null, direction: 'asc' };

  function saveToStorage() {
    localStorage.setItem('employees', JSON.stringify(data));
  }

  function render() {
    const tbody = document.getElementById('empTbody');
    tbody.innerHTML = '';

    let sortedData = [...data];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        let valA = a[sortConfig.key]?.toString().toLowerCase() || '';
        let valB = b[sortConfig.key]?.toString().toLowerCase() || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    sortedData.forEach(emp => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" data-id="${emp.id}"></td>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.role}</td>
        <td>${emp.joinDate}</td>
        <td>${emp.status}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary btn-edit" onclick="Employees.edit(${emp.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-delete" onclick="Employees.remove(${emp.id})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    saveToStorage();
  }

  function search(q) {
    const rows = document.querySelectorAll('#empTbody tr');
    rows.forEach(r => {
      r.style.display = r.innerText.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
    });
  }

  function openAddModal() {
    document.getElementById('empId').value = '';
    document.getElementById('empModalTitle').innerText = 'Add Employee';
    document.getElementById('empName').value = '';
    document.getElementById('empDept').value = '';
    document.getElementById('empRole').value = '';
    document.getElementById('empJoin').value = '';
    document.getElementById('empStatus').value = 'Active';
    new bootstrap.Modal(document.getElementById('empModal')).show();

    // Focus on name input after modal shows
    setTimeout(() => document.getElementById('empName').focus(), 200);
  }

  function edit(id) {
    const emp = data.find(e => e.id === id);
    if (!emp) return;
    document.getElementById('empId').value = emp.id;
    document.getElementById('empModalTitle').innerText = 'Edit Employee';
    document.getElementById('empName').value = emp.name;
    document.getElementById('empDept').value = emp.department;
    document.getElementById('empRole').value = emp.role;
    document.getElementById('empJoin').value = emp.joinDate;
    document.getElementById('empStatus').value = emp.status;
    new bootstrap.Modal(document.getElementById('empModal')).show();

    setTimeout(() => document.getElementById('empName').focus(), 200);
  }

  function save(e) {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const newEmp = {
      id: id ? parseInt(id) : Date.now(),
      name: document.getElementById('empName').value,
      department: document.getElementById('empDept').value,
      role: document.getElementById('empRole').value,
      joinDate: document.getElementById('empJoin').value,
      status: document.getElementById('empStatus').value
    };

    if (id) {
      const idx = data.findIndex(e => e.id === parseInt(id));
      data[idx] = newEmp;
    } else {
      data.push(newEmp);
    }

    render();
    bootstrap.Modal.getInstance(document.getElementById('empModal')).hide();
  }

  function remove(id) {
    const emp = data.find(e => e.id === id);
    if (!emp) return;
    if (confirm(`Are you sure you want to delete ${emp.name}?`)) {
      data = data.filter(e => e.id !== id);
      render();
    }
  }

  function sortBy(key) {
    if (sortConfig.key === key) {
      sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortConfig.key = key;
      sortConfig.direction = 'asc';
    }
    render();
  }
    function init() {
    renderFavorites();
    initReportLinks();
    App.init(); // Apply role & theme
  }


  return { render, search, openAddModal, edit, save, remove, sortBy };
})();

document.addEventListener('DOMContentLoaded', () => {
  Employees.render();

  // Enable sorting when clicking on table headers
  document.querySelectorAll('#empTable thead th').forEach((th, index) => {
    const sortKeys = ['', 'name', 'department', 'role', 'joinDate', 'status', '']; // match column order
    if (sortKeys[index]) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => Employees.sortBy(sortKeys[index]));
    }
  });
});

const Reports = (() => {
  let chartInstances = {};

  function createCharts(viewType = 'yearly') {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    };

    // Example datasets for demo
    const monthlyJoinData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Monthly Hires",
        data: [2, 3, 4, 6, 3, 5, 4, 2, 3, 6, 5, 7],
        backgroundColor: "#28a745",
        borderColor: "#28a745",
        fill: false,
        tension: 0.3
      }]
    };

    const yearlyJoinData = {
      labels: ["2021", "2022", "2023", "2024"],
      datasets: [{
        label: "Employees Joined",
        data: [25, 30, 35, 20],
        backgroundColor: "#007bff"
      }]
    };

    const deptData = {
      labels: ["Engineering", "HR", "Sales", "Marketing"],
      datasets: [{
        data: [12, 5, 7, 4],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"]
      }]
    };

    // Destroy existing charts before re-creating (avoid duplicate canvas)
    Object.values(chartInstances).forEach(chart => chart.destroy());

    // Always create department pie chart
    chartInstances.deptPie = new Chart(document.getElementById('deptPie'), {
      type: 'pie',
      data: deptData,
      options: chartOptions
    });

    if (viewType === 'monthly') {
      chartInstances.joinChart = new Chart(document.getElementById('joinBar'), {
        type: 'bar',
        data: monthlyJoinData,
        options: chartOptions
      });
      chartInstances.hiresLine = new Chart(document.getElementById('hiresLine'), {
        type: 'line',
        data: monthlyJoinData,
        options: chartOptions
      });
    } else {
      chartInstances.joinChart = new Chart(document.getElementById('joinBar'), {
        type: 'bar',
        data: yearlyJoinData,
        options: chartOptions
      });
      chartInstances.hiresLine = new Chart(document.getElementById('hiresLine'), {
        type: 'line',
        data: yearlyJoinData,
        options: chartOptions
      });
    }

    // Resume Stats (mock data)
    document.getElementById('avgScore').innerText = viewType === 'monthly' ? "82" : "78";
    document.getElementById('commonMissing').innerText = "Python, SQL";
  }

  function initReportLinks() {
    // Sidebar Monthly / Yearly buttons (present on all pages)
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

  function init() {
    initReportLinks();

    // If we're actually on reports.html
    if (document.getElementById('deptPie')) {
      // Detect which view to load from query param
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "yearly";
      createCharts(type);

      // Inside-page menu switching
      document.querySelectorAll('#reportsMenu a').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          const type = btn.textContent.trim().toLowerCase(); // "monthly" or "yearly"
          createCharts(type);
        });
      });
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Reports.init);

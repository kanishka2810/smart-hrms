const Weather = (() => {
  const apiKey = ""; // Optional OpenWeather API key
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  function renderFavorites() {
    const list = document.getElementById('favoriteList');
    list.innerHTML = '';
    favorites.forEach(city => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = city;
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-outline-danger btn-delete';
      btn.textContent = 'X';
      btn.onclick = () => {
        favorites = favorites.filter(c => c !== city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function search() {
    const city = document.getElementById('weatherSearch').value.trim();
    if (!city) return;

    // Mock API data
    const weatherData = {
      temp: "28°C",
      humidity: "60%",
      wind: "10 km/h",
      condition: "Sunny",
      sunrise: "6:15 AM",
      sunset: "6:45 PM"
    };

    document.getElementById('weatherCurrent').innerHTML = `
      <p><strong>Temperature:</strong> ${weatherData.temp}</p>
      <p><strong>Humidity:</strong> ${weatherData.humidity}</p>
      <p><strong>Wind:</strong> ${weatherData.wind}</p>
      <p><strong>Condition:</strong> ${weatherData.condition}</p>
      <p><strong>Sunrise:</strong> ${weatherData.sunrise}</p>
      <p><strong>Sunset:</strong> ${weatherData.sunset}</p>
    `;

    // Forecast mock
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const day = document.createElement('div');
      day.className = 'p-2 border rounded text-center';
      day.style.minWidth = '100px';
      day.innerHTML = `<strong>Day ${i}</strong><br>30°C<br>Sunny`;
      forecast.appendChild(day);
    }
  }

  function saveFavorite() {
    const city = document.getElementById('weatherSearch').value.trim();
    if (city && !favorites.includes(city)) {
      favorites.push(city);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites();
    }
  }

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

  function init() {
    renderFavorites();
    initReportLinks();
    App.init(); // Apply role & theme
  }

  return { search, saveFavorite, init };
})();

document.addEventListener('DOMContentLoaded', Weather.init);

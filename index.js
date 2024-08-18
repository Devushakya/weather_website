const userInfoContainer = document.querySelector(".weather-data-all");
const searchForm = document.querySelector("[search-tab]");
const grantAccessContainer = document.querySelector(".location");
const loadingScreen = document.querySelector(".loading");
const userTab = document.querySelector("[user-weather]");
const searchTab = document.querySelector("[search-weather]");
const nocityTab = document.querySelector(".nocity");

getfromSessionStorage();

let oldTab = userTab;
const API_KEY = "043227f5329dafa931735fbe1cfd42e0";
oldTab.classList.add("current-tab");

function switchTab(newTab) {
  if (newTab !== oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    // Hide all containers
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchForm.classList.remove("active");
    nocityTab.classList.remove("active");
    loadingScreen.classList.remove("active");

    if (newTab === searchTab) {
      // Show search form
      searchForm.classList.add("active");
    } else {
      // Show user weather or grant access screen
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => switchTab(userTab));
searchTab.addEventListener("click", () => switchTab(searchTab));

function getfromSessionStorage() {
  const local_coordinates = sessionStorage.getItem("user-coordinates");
  if (!local_coordinates) {
    // Show grant access screen
    grantAccessContainer.classList.add("active");
  } else {
    // Fetch and display user weather info
    const coordinates = JSON.parse(local_coordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  nocityTab.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    nocityTab.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    nocityTab.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const city = document.querySelector(".city_data");
  const country = document.querySelector(".country_img");
  const mainweather = document.querySelector(".main-weather");
  const weatherimg = document.querySelector(".weather-image");
  const temperature = document.querySelector(".data-temp");
  const wind = document.querySelector(".winddata");
  const humidity = document.querySelector(".humiddata");
  const cloud = document.querySelector(".clouddata");

  city.innerText = weatherInfo?.name;
  country.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  mainweather.innerText = weatherInfo?.weather?.[0]?.description;
  weatherimg.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp} °C`;
  wind.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloud.innerText = `${weatherInfo?.clouds?.all}%`;
}

const accessbtn = document.querySelector(".access_btn");
accessbtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No geolocation support available.");
  }
});

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector(".search_input");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value;
  if (city === "") return;

  fetchsearchweatherinfo(city);
});

async function fetchsearchweatherinfo(city) {
  loadingScreen.classList.add("active");
  nocityTab.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  userInfoContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      loadingScreen.classList.remove("active");
      throw new Error();
    }
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    nocityTab.classList.add("active");
  }
}

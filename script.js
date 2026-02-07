let extended = [];
let naviLoc = [];
let citiesExt = [];
let coordinates = [];
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

const main = document.querySelector("main");
const searchHTML = `
    <div class="search">
        <label for="city-search">Enter a city:</label>
        <select name="regions" id="region-search" class="region-dropdown">
            <option value="region">Region</option>
        </select>
        <select id="city-search" name="cities" class="city-dropdown"> 
            <option value="city">City</option>
        </select>
        <button class="search-btn">Search</button>
    </div>
`;

main.insertAdjacentHTML('afterbegin', searchHTML);


const areaDropdown = document.querySelector(".region-dropdown");
const cityDropdown = document.querySelector(".city-dropdown");


span.onclick = function() {
  modal.style.display = "none";
  document.querySelector(".modal-text").textContent = "";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
	document.querySelector(".modal-text").textContent = "";
  }
}

const openModal = function (text) {
	modal.style.display = "block";
	document.querySelector(".modal-text").textContent = text;
}


if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition((position) => {
		naviLoc.push("Your location", position.coords.latitude, position.coords.longitude)
		GetWeather(naviLoc)
	},
	(error) => {
		openModal("Can't find user location. Enter your city below.")
	});
} else {
	openModal("Location is not supported.")
}

async function getDropdown() {
  const url = "https://api.hh.ru/areas";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    const regions = data[0].areas;
		regions.forEach((area) => {
			let option = document.createElement('option');
			option.id = area.id;
			option.value = area.name;          
			option.textContent = area.name;
			areaDropdown.appendChild(option);
		});
	areaDropdown.addEventListener("change", function() {
		let dropdownValue = areaDropdown.value;
		for (let i = 0; i < regions.length; i++) {
			if (regions[i].name == dropdownValue) {
				let cities = regions[i].areas;
				if (cities.length) {
					citiesExt = [];
					citiesExt.push(cities);
					cityDropdown.innerHTML = '';
					cities.forEach((city) => {
						let option = document.createElement('option');
						option.id = city.id;
						option.value = city.name;        
						option.textContent = city.name;
						cityDropdown.appendChild(option);
					});
				} else {
					citiesExt = [];
					citiesExt.push([regions[i]]);
					cityDropdown.innerHTML = '';
					let option = document.createElement('option');
					option.id = regions[i].id;
					option.value = regions[i].name;        
					option.textContent = regions[i].name;
					cityDropdown.appendChild(option);
				}
			};
		};
	});
	document.querySelector(".search-btn").addEventListener("click", function () {
		extended = [];
		let cityStr = document.querySelector(".city-dropdown").value;
		if (cityStr) {
			for (let i = 0; i < citiesExt[0].length; i++) {
				if (citiesExt[0][i].name == cityStr) {
					coordinates = [];
					coordinates.push(cityStr)
					coordinates.push(citiesExt[0][i].lat);
					coordinates.push(citiesExt[0][i].lng);
				};
			};
			GetWeather(coordinates);
		} else {
			openModal("Input is incorrect.");
    };
});
  } catch (error) {
    console.error(error.message);
  }
}

getDropdown();

async function GetWeather(coordinates) {
    try {
        let lat = coordinates[1];
        let lon = coordinates[2];


        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min`);
        const weatherResponseJson = await weatherResponse.json();

        const innerWeather = weatherResponseJson.daily;

		const newCity = document.createElement('div');
        newCity.className = 'city';

        const tools = document.createElement('div');
        tools.className = 'tools';

        let cityName = document.createElement('h2');
        cityName.classList.add("city-name");
        cityName.textContent = coordinates[0];

        let closeButton = document.createElement("button");
        closeButton.classList.add("delete");
        closeButton.type = "button";
        closeButton.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cross</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-467.000000, -1039.000000)" fill="#30364F"> <path d="M489.396,1061.4 C488.614,1062.18 487.347,1062.18 486.564,1061.4 L479.484,1054.32 L472.404,1061.4 C471.622,1062.18 470.354,1062.18 469.572,1061.4 C468.79,1060.61 468.79,1059.35 469.572,1058.56 L476.652,1051.48 L469.572,1044.4 C468.79,1043.62 468.79,1042.35 469.572,1041.57 C470.354,1040.79 471.622,1040.79 472.404,1041.57 L479.484,1048.65 L486.564,1041.57 C487.347,1040.79 488.614,1040.79 489.396,1041.57 C490.179,1042.35 490.179,1043.62 489.396,1044.4 L482.316,1051.48 L489.396,1058.56 C490.179,1059.35 490.179,1060.61 489.396,1061.4 L489.396,1061.4 Z M485.148,1051.48 L490.813,1045.82 C492.376,1044.26 492.376,1041.72 490.813,1040.16 C489.248,1038.59 486.712,1038.59 485.148,1040.16 L479.484,1045.82 L473.82,1040.16 C472.257,1038.59 469.721,1038.59 468.156,1040.16 C466.593,1041.72 466.593,1044.26 468.156,1045.82 L473.82,1051.48 L468.156,1057.15 C466.593,1058.71 466.593,1061.25 468.156,1062.81 C469.721,1064.38 472.257,1064.38 473.82,1062.81 L479.484,1057.15 L485.148,1062.81 C486.712,1064.38 489.248,1064.38 490.813,1062.81 C492.376,1061.25 492.376,1058.71 490.813,1057.15 L485.148,1051.48 L485.148,1051.48 Z" id="cross" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>';

        closeButton.addEventListener("click", function() {
            newCity.remove();
        });

        tools.appendChild(cityName);
        tools.appendChild(closeButton);
        newCity.appendChild(tools);

        const container = document.createElement('div');
        container.className = 'city-forecast';

        for (let i = 0; i < 5; i++) {
            let weatherType = descriptions[innerWeather.weather_code[i]].day.description;
            let weatherImg = descriptions[innerWeather.weather_code[i]].day.image;
            extended.push({
                date: innerWeather.time[i],
                temp_min: innerWeather.temperature_2m_min[i],
                temp_max: innerWeather.temperature_2m_max[i],
                weather: weatherType,
                image: weatherImg
            });
        };





        extended.forEach((date) => {
            const content = `
                    <div class="forecast day${date.date}">
                        <img src="${date.image}" class="weather-img" alt="${date.weather}" >
                        <p class="weather">${date.weather}</p>
                        <p class="high">H: ${date.temp_max}°</p>
                        <p class="low">L: ${date.temp_min}°</p>
                    </div>
            `;

            container.innerHTML += content;
        });

		newCity.appendChild(container);

        main.appendChild(newCity);
    } catch (error) {
        console.error(`Caught error ${error}`)};  
};


const descriptions = {
	"0":{
		"day":{
			"description":"Sunny",
			"image":"http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night":{
			"description":"Clear",
			"image":"http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"1":{
		"day":{
			"description":"Mainly Sunny",
			"image":"http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night":{
			"description":"Mainly Clear",
			"image":"http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"2":{
		"day":{
			"description":"Partly Cloudy",
			"image":"http://openweathermap.org/img/wn/02d@2x.png"
		},
		"night":{
			"description":"Partly Cloudy",
			"image":"http://openweathermap.org/img/wn/02n@2x.png"
		}
	},
	"3":{
		"day":{
			"description":"Cloudy",
			"image":"http://openweathermap.org/img/wn/03d@2x.png"
		},
		"night":{
			"description":"Cloudy",
			"image":"http://openweathermap.org/img/wn/03n@2x.png"
		}
	},
	"45":{
		"day":{
			"description":"Foggy",
			"image":"http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night":{
			"description":"Foggy",
			"image":"http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"48":{
		"day":{
			"description":"Rime Fog",
			"image":"http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night":{
			"description":"Rime Fog",
			"image":"http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"51":{
		"day":{
			"description":"Light Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"53":{
		"day":{
			"description":"Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"55":{
		"day":{
			"description":"Heavy Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Heavy Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"56":{
		"day":{
			"description":"Light Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"57":{
		"day":{
			"description":"Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"61":{
		"day":{
			"description":"Light Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Light Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"63":{
		"day":{
			"description":"Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"65":{
		"day":{
			"description":"Heavy Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Heavy Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"66":{
		"day":{
			"description":"Light Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Light Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"67":{
		"day":{
			"description":"Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"71":{
		"day":{
			"description":"Light Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Light Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"73":{
		"day":{
			"description":"Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"75":{
		"day":{
			"description":"Heavy Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Heavy Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"77":{
		"day":{
			"description":"Snow Grains",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow Grains",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"80":{
		"day":{
			"description":"Light Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"81":{
		"day":{
			"description":"Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"82":{
		"day":{
			"description":"Heavy Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Heavy Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"85":{
		"day":{
			"description":"Light Snow Showers",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Light Snow Showers",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"86":{
		"day":{
			"description":"Snow Showers",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow Showers",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"95":{
		"day":{
			"description":"Thunderstorm",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Thunderstorm",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"96":{
		"day":{
			"description":"Light Thunderstorms With Hail",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Light Thunderstorms With Hail",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"99":{
		"day":{
			"description":"Thunderstorm With Hail",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Thunderstorm With Hail",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	}
}

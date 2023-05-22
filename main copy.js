class Road {
  firstCity;
  secondCity;
  distance;

  constructor(firstCity, secondCity, distance) {
    this.firstCity = firstCity;
    this.secondCity = secondCity;
    this.distance = distance;
  }

  getName() {
    return `${this.firstCity.name}  ----- ${this.distance} ---->  ${this.secondCity.name}`;
  }
}

class City {
  name;
  roads;

  constructor(name) {
    this.name = name;
    this.roads = [];
  }

  getRoads() {
    return this.roads;
  }

  connectRoad(road) {
    this.roads.push(road);
  }
}

class CitiesServices {
  cities;

  constructor() {
    this.cities = [];
  }

  checkString(arg) {
    if (!arg || typeof arg !== "string") {
      throw new Error(
        "Error - CitiesServices -  Não foi passado o argumento esperado que é uma string"
      );
    }
  }

  checkNumber(arg) {
    if (!arg || typeof arg !== "number") {
      throw new Error(
        "Error - CitiesServices - Não foi passado o argumento esperado que é um número"
      );
    }
  }

  getCities() {
    return this.cities;
  }

  getCity(cityName) {
    this.checkString(cityName);

    const city = this.cities.find((city) => city.name === cityName);

    if (!city) {
      throw new Error("Error - CitiesServices - Essa cidade não existe");
    }

    return city;
  }

  createCity(cityName) {
    this.checkString(cityName);
    const cityAlreadyExists = this.cities.find(
      (city) => city.name === cityName
    );

    if (cityAlreadyExists) {
      throw new Error("Error - CitiesServices - Essa cidade já existe");
    }

    const city = new City(cityName);
    this.cities = [...this.cities, city];
  }

  deleteCity(cityName) {
    this.checkString(cityName);

    const indexToRemove = this.cities.findIndex(
      (city) => city.name === cityName
    );
    if (indexToRemove === -1) {
      throw new Error("Error - CitiesServices - Essa cidade não existe");
    }

    array.splice(indexToRemove, 1);
  }

  // Pensei em criar uma classe RoadsServices, porém como road é altamente atreladas as cidades não achei necessário
  getRoads() {
    const map = {};
    const roads = [];

    for (const city of this.cities) {
      for (const road of city.roads) {
        const roadName = road.getName();
        if (!map[roadName]) {
          map[roadName] = true;
          roads.push(road);
        }
      }
    }

    return roads;
  }

  createRoad(firstCityName, secondCityName, distance) {
    this.checkString(firstCityName);
    this.checkString(secondCityName);
    this.checkNumber(distance);

    if (firstCityName === secondCityName) {
      throw new Error(
        "Error - CitiesServices - Não é possível criar um caminho para  a própria cidade"
      );
    }

    const firstCity = this.getCity(firstCityName);

    const roadAlreadyExists = firstCity
      .getRoads()
      .find(
        (road) =>
          road.firstCity.name === secondCityName ||
          road.secondCity.name === secondCityName
      );

    if (roadAlreadyExists && distance === roadAlreadyExists.distance) {
      throw new Error("Error - CitiesServices - Essa estrada já existe");
    } else if (roadAlreadyExists) {
      roadAlreadyExists.distance = distance;
      return;
    }

    const secondCity = this.getCity(secondCityName);

    const newRoad = new Road(firstCity, secondCity, distance);

    firstCity.connectRoad(newRoad);
    secondCity.connectRoad(newRoad);
  }

  deleteRoad(roadName) {
    this.checkString(roadName);

    const road = this.getRoads().find((road) => road.getName() === roadName);

    const firstCity = this.getCity(road.firstCity.name);
    const secondCity = this.getCity(road.secondCity.name);
  }
}

const citiesServices = new CitiesServices();

// "Escutador" de eventos
document.addEventListener("click", (event) => {
  try {
    // Verificando ação de click
    switch (event.target.id) {
      case "add-city-button":
        handleAddCity();
        break;
      case "add-relation-button":
        handleAddRelation();
        break;
      default:
    }
    // Lidando com Erros
  } catch (err) {
    window.alert(err.message);
  }
});

// Queries de estradas
const cityList = document.querySelector("#city-list");

const cityInput = document.querySelector("#city-input");

const addCityButton = document.querySelector("#add-city-button");

// Queries de cidades
const relationList = document.querySelector("#relation-list");

const firstCitySelect = document.querySelector("#first-city-select");
const secondCitySelect = document.querySelector("#second-city-select");
const distanceInput = document.querySelector("#distance-input");
const addRelationButton = document.querySelector("#add-relation-button");

// Funções executoras dos eventos
const handleAddCity = () => {
  const cityName = cityInput.value;

  citiesServices.createCity(cityName);

  createItemInCityList(cityName);
  createOptionInCitiesSelects(cityName);
};

const createItemInCityList = (cityName) => {
  const li = document.createElement("li");
  li.textContent = cityName;
  cityList.appendChild(li);
};

const createOptionInCitiesSelects = (cityName) => {
  const firstOption = document.createElement("option");
  const secondOption = document.createElement("option");

  firstOption.textContent = cityName;
  secondOption.textContent = cityName;

  firstCitySelect.appendChild(firstOption);
  secondCitySelect.appendChild(secondOption);
};

const handleAddRelation = () => {
  const firstCityName = firstCitySelect.value;
  const secondCityName = secondCitySelect.value;
  const distance = Number(distanceInput.value);

  citiesServices.createRoad(firstCityName, secondCityName, distance);
  updateRoadsList();
};

const updateRoadsList = () => {
  // Deletando itens da lista exceto o primeiro
  relationList.querySelectorAll("li").forEach((li, index) => {
    if (index > 0) {
      deleteItemToList(relationList, li);
    }
  });

  // Preenchendo lista com items
  citiesServices.getRoads().forEach((road) => {
    addItemToList(relationList, createListItemElement(road.getName()));
  });
};

const deleteItemToList = (listElement, item) => {
  listElement.removeChild(item);
};

const addItemToList = (listElement, item) => {
  listElement.appendChild(item);
};

const createListItemElement = (textContent) => {
  const p = document.createElement("p");
  const li = document.createElement("li");
  p.textContent = textContent;
  li.appendChild(p);
  return li;
};

const addCityInput = document.querySelector("#add-city-input");
const citySelects = document.querySelectorAll(".city-select");

const cityList = document.querySelector("#city-list");
const distanceInput = document.querySelector("#distance-input");
const relationList = document.querySelector("#relation-list");

let data = [];

class City {
  name;
  roads;

  constructor(name) {
    this.name = name;
    this.roads = [];
  }

  addRoad(linkedCity, distance = 0) {
    if (!linkedCity) {
      throw new Error("Não foi passada cidade para criar caminho");
    }

    if (linkedCity.name === this.name) {
      throw new Error(
        "Não é possível adicionar um caminho da cidade para ela mesma"
      );
    }

    if (this.checkIfRoadAlreadyExists(linkedCity, distance)) {
      throw new Error("Caminho já adicionado");
    }

    const newRoad = {
      node1: this,
      node2: linkedCity,
      distance: distance,
    };

    this.roads.push(newRoad);
    linkedCity.roads.push(newRoad);
  }

  removeRoad(linkedCity) {
    const index = this.roads.findIndex(
      (road) =>
        road.node1.name === this.name && road.node2.name === linkedCity.name
    );

    if (index !== -1) {
      this.roads.splice(index, 1);
      linkedCity.roads.splice(index, 1);
    }
  }

  updateRoad(linkedCity, distance) {
    const road = this.roads.find((road) => road.node2.name === linkedCity.name);

    if (road) {
      road.distance = distance;
      linkedCity.updateRoad(this, distance);

      const relationItem = document.querySelector(
        `li[data-city-name-one="${this.name}"][data-city-name-two="${linkedCity.name}"]`
      );

      if (relationItem) {
        relationItem.dataset.distance = distance;
        relationItem.innerHTML = `${this.name} --- ${distance} --> ${linkedCity.name}`;
      }
    }
  }

  checkIfRoadAlreadyExists(linkedCity, distance) {
    const road = this.roads.find((road) => road.node2.name === linkedCity.name);

    if (road && road.distance !== distance) {
      return false;
    }

    if (road) {
      return true;
    }

    return false;
  }

  checkIfRoadExists(linkedCity) {
    const roadExistsForward = !!this.roads.find(
      (road) => road.node2.name === linkedCity.name
    );

    const roadExistsBackward = !!linkedCity.roads.find(
      (road) => road.node2.name === this.name
    );

    return roadExistsForward && roadExistsBackward;
  }
}

const handleAddCity = () => {
  const cityName = addCityInput.value;

  if (!cityName || typeof cityName !== "string") {
    throw new Error("Não foi passado nome de cidade");
  }

  if (data.some((city) => city.name === cityName)) {
    throw new Error("Essa cidade já foi adicionada");
  }

  const newCity = new City(cityName);

  createCityItem(cityName);
  createCityOption(cityName);

  data = [...data, newCity];

  // Listando cidades
  console.log("Lista de Cidades");
  data.map((city) => console.log(city));
};

const handleAddRelation = () => {
  const cityNameOne = citySelects[0].value;
  const cityNameTwo = citySelects[1].value;

  if (
    !cityNameOne ||
    typeof cityNameOne !== "string" ||
    !cityNameTwo ||
    typeof cityNameTwo !== "string"
  ) {
    throw new Error("Não foram selecionadas cidades");
  }

  if (cityNameOne === cityNameTwo) {
    throw new Error("Não é possível criar um caminho para a própria cidade");
  }

  const cityOne = data.find((city) => city.name === cityNameOne);
  const cityTwo = data.find((city) => city.name === cityNameTwo);
  const distance = Number(distanceInput.value) ?? 0;

  const roadExists =
    cityOne.checkIfRoadExists(cityTwo) || cityTwo.checkIfRoadExists(cityOne);

  if (roadExists) {
    throw new Error("Caminho já adicionado");
  }

  createRelationItem(cityNameOne, cityNameTwo, distance);
  cityOne.addRoad(cityTwo, distance);
};

const handleRemoveRelation = (event) => {
  const relationItem = event.target.parentNode;
  const [cityNameOne, , cityNameTwo] = relationItem.innerHTML.split(" ");
  const cityOne = data.find((city) => city.name === cityNameOne);
  const cityTwo = data.find((city) => city.name === cityNameTwo);

  cityOne.removeRoad(cityTwo);

  relationItem.remove();
};

const createCityItem = (cityName) => {
  const li = document.createElement("li");
  li.innerHTML = cityName;

  cityList.appendChild(li);
};

const createCityOption = (cityName) => {
  Array.from(citySelects).map((citySelect) => {
    const option = document.createElement("option");
    option.value = cityName;
    option.innerHTML = cityName;

    citySelect.appendChild(option);
  });
};

const createRelationItem = (cityNameOne, cityNameTwo, distance) => {
  const li = document.createElement("li");
  li.innerHTML = `${cityNameOne} --- ${distance} --> ${cityNameTwo}`;
  li.dataset.cityNameOne = cityNameOne;
  li.dataset.cityNameTwo = cityNameTwo;
  li.dataset.distance = distance;

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "Remover";
  removeButton.addEventListener("click", handleRemoveRelation);

  li.appendChild(removeButton);

  relationList.appendChild(li);
};

// Código funcional
document.addEventListener("click", (event) => {
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
});

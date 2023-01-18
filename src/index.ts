/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
import './styles/style.scss';
import createCarBox from './ui';

displayAllCars();

const sectionGarage = document.querySelector('.garage')!;
const sectionWinners = document.querySelector('.winners')!;
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu__item');

menu?.addEventListener('click', (event) => {
  const eventTarget = event.target as HTMLElement;
  const eventTargetSection = eventTarget?.dataset.target;
  if (eventTargetSection === 'garage') {
    sectionGarage?.classList.add('show');
    sectionWinners?.classList.remove('show');
  }
  if (eventTargetSection === 'winners') {
    sectionWinners?.classList.add('show');
    sectionGarage?.classList.remove('show');
  }
  menuItems.forEach((item) => {
    item.classList.remove('active');
  });
  eventTarget.classList.add('active');
});

// CREATE CAR
const createCarBtn = document.querySelector('.create-btn')!;

const createCarColor = document.querySelector('.create-car__color') as HTMLSelectElement;
const createCarName = document.querySelector('.create-car__name') as HTMLInputElement;
const createCarSelectBrand = document.querySelector('.create-car__brands') as HTMLSelectElement;

async function createCar(carDetails: object) {
  let carId: number;
  const response = await fetch('http://127.0.0.1:3000/garage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carDetails),
  });
  const data = await response.json();
  carId = data.id;
  return carId;
}

function removeCar(carId: number) {
  fetch(`http://127.0.0.1:3000/garage/${carId}`, {
    method: 'DELETE',
  });
}

function updateCar(carId: number, carDetails: object) {
  fetch(`http://127.0.0.1:3000/garage/${carId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carDetails),
  });
}

function changeCar(singCarBox: HTMLElement, carName: string, carColor: string) {
  const carBoxName = singCarBox.querySelector('.car__box-name')!;
  const carBoxColor = singCarBox.querySelector('.create-car__color')!;
  carBoxName.innerHTML = carName;
  carBoxColor.innerHTML = carColor;
}

async function getCar(carID?: number) {
  let url = 'http://127.0.0.1:3000/garage';
  if (carID) {
    url += `/${carID}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  const cars: Array<{name: string, color: string, id: number}> = data;
  return cars;
}
createCarBtn.addEventListener('click', () => {
  const carDetails = {
    name: `${createCarSelectBrand.value} ${createCarName.value}`,
    color: createCarColor.value,
  };
  createCarSelectBrand.value = 'Audi';
  createCarName.value = '';
  createCar(carDetails).then((catId) => {
    displayCar(carDetails.name, carDetails.color, catId);
  });
});

// UPDATE CAR

const garageCars = document.querySelector('.garage__cars') as HTMLElement;
// const editCar = document.querySelector('.edit-car') as HTMLElement;
// const updateBtn = document.querySelector('.update-btn') as HTMLButtonElement;

garageCars.addEventListener('click', (event: Event) => {
  const eventTarget = event?.target as HTMLElement;
  const eventTargetClosest = eventTarget.closest('.car__box') as HTMLElement;
  const editCar = eventTargetClosest.querySelector('.edit-car') as HTMLElement;
  // const updateCarBtn = eventTargetClosest.querySelector('.update-btn') as HTMLButtonElement;
  // const updateBTN = eventTargetClosest.querySelector('.update-btn') as HTMLButtonElement;
  if (eventTarget.classList.contains('car__box__remove')) {
    const carId = eventTargetClosest?.getAttribute('data-id')!;
    removeCar(+carId);
    eventTargetClosest?.remove();
  }
  if (eventTarget.classList.contains('car__box__edit')) {
    editCar.classList.remove('show');
    editCar.classList.add('show');
  }
  if (eventTarget.classList.contains('update-btn')) {
    updateCurrentCar(eventTargetClosest);
  }
  console.log(eventTargetClosest);
});

// updateBtn?.addEventListener('click', (event: Event) => {
//   const eventTarget = event?.target as HTMLElement;
//   const eventTargetClosest = eventTarget?.closest('.car__box') as HTMLElement;
//   const updateCarBrand = eventTargetClosest?.querySelector('.create-car__brands') as HTMLSelectElement;
//   const updateCarName = eventTargetClosest?.querySelector('.create-car__name') as HTMLInputElement;
//   const updateCarColor = eventTargetClosest?.querySelector('.create-car__color') as HTMLInputElement;
//   const updateCarDetails = {
//     name: `${updateCarBrand.value} ${updateCarName.value}`,
//     color: updateCarColor.value,
//   };
//   updateCarBrand.value = 'Audi';
//   updateCarName.value = '';
//   const carId = eventTargetClosest?.getAttribute('data-id')!;
//   updateCar(+carId, updateCarDetails);
//   editCar.classList.remove('show');
//   editCar.classList.add('hide');
//   changeCar(eventTargetClosest, updateCarDetails.name, updateCarDetails.color);
// });

function updateCurrentCar(eventTargetBox: HTMLElement) {
  const updateCarBrand = eventTargetBox?.querySelector('.create-car__brands') as HTMLSelectElement;
  const updateCarName = eventTargetBox?.querySelector('.create-car__name') as HTMLInputElement;
  const updateCarColor = eventTargetBox?.querySelector('.create-car__color') as HTMLInputElement;
  const editCar = eventTargetBox.querySelector('.edit-car') as HTMLElement;
  const updateCarDetails = {
    name: `${updateCarBrand.value} ${updateCarName.value}`,
    color: updateCarColor.value,
  };
  updateCarBrand.value = 'Audi';
  updateCarName.value = '';
  const carId = eventTargetBox?.getAttribute('data-id')!;
  updateCar(+carId, updateCarDetails);
  editCar.classList.remove('show');
  editCar.classList.add('hide');
  changeCar(eventTargetBox, updateCarDetails.name, updateCarDetails.color);
}
// Display All CARS
function displayCar(carName: string, carColor: string, carId: number) {
  const carBox = createCarBox(carName, carColor, carId);
  garageCars.insertAdjacentHTML('beforeend', carBox);
}

function displayAllCars() {
  getCar().then((response) => {
    response.map((item) => {
      const carBox = createCarBox(item.name, item.color, item.id);
      garageCars.insertAdjacentHTML('beforeend', carBox);
      return '';
    });
  });
}

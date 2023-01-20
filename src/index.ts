/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
import './styles/style.scss';
import createCarBox from './ui';
import randomWords from './randomWords';

const carBrands = ['Audi', 'BMW', 'Citroen', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Kia', 'Mazda', 'Mersedes', 'Mini', 'Mitsubishi', 'Peugeot', 'Pontiac', 'Porsche', 'Suzuki', 'Tesla', 'Volkswagen', 'Volvo'];
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

// const paggination = document.querySelector('.pagination') as HTMLElement;
const paginationCurrentPage = document.querySelector('.pagination__current') as HTMLButtonElement;
const paginationTotalPages = document.querySelector('.pagination__total') as HTMLButtonElement;

const paginationBtns = document.querySelector('.pagination-btn') as HTMLElement;

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

async function startCar(carId: number): Promise<{velocity: number, distance: number}> {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${carId}&status=started`, {
    method: 'PATCH',
  });
  const data = await response.json();
  return data;
}
async function driveMode(carId: number): Promise<{success: boolean}> {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${carId}&status=drive`, {
    method: 'PATCH',
  });
  const data = await response.json();
  return data;
}
createCarBtn.addEventListener('click', async () => {
  const carDetails = {
    name: `${createCarSelectBrand.value} ${createCarName.value}`,
    color: createCarColor.value,
  };
  createCarSelectBrand.value = 'Audi';
  createCarName.value = '';
  // createCar(carDetails).then((catId) => {
  //   displayCar(carDetails.name, carDetails.color, catId);
  // })
  await createCar(carDetails);
  pagination(+paginationCurrentPage.innerHTML).then((cars) => {
    displayAllCars(cars);
  });
  displayCarsTotalNum();
  displayTotalPages();
});

// UPDATE CAR

const garageCars = document.querySelector('.garage__cars') as HTMLElement;
// const editCar = document.querySelector('.edit-car') as HTMLElement;
// const updateBtn = document.querySelector('.update-btn') as HTMLButtonElement;

garageCars.addEventListener('click', async (event: Event) => {
  const eventTarget = event?.target as HTMLElement;
  const eventTargetClosest = eventTarget.closest('.car__box') as HTMLElement;
  const editCar = eventTargetClosest.querySelector('.edit-car') as HTMLElement;
  const carId = eventTargetClosest?.getAttribute('data-id')!;
  // const updateCarBtn = eventTargetClosest.querySelector('.update-btn') as HTMLButtonElement;
  // const updateBTN = eventTargetClosest.querySelector('.update-btn') as HTMLButtonElement;
  if (eventTarget.classList.contains('car__box__remove')) {
    removeCar(+carId);
    eventTargetClosest?.remove();
    displayCarsTotalNum();
    pagination(+paginationCurrentPage.innerHTML).then((cars) => {
      displayAllCars(cars);
    });
  }
  if (eventTarget.classList.contains('car__box__edit')) {
    editCar.classList.remove('show');
    editCar.classList.add('show');
  }
  if (eventTarget.classList.contains('update-btn')) {
    updateCurrentCar(eventTargetClosest);
  }
  if (eventTarget.classList.contains('car__box__start')) {
    let element = eventTargetClosest.querySelector('.car-img')! as HTMLElement;
    const time = await getTime(+carId);
    singleAnimate(time, element);
    console.log(time);
    // const canDrive = await driveMode(+carId);
    // if (canDrive.success) {
    //   singleAnimate(time, element);
    // }
  }
  console.log(eventTargetClosest);
});
function singleAnimate(time: number, element: HTMLElement) {
  let start = Date.now();
  let timer = setInterval(() => {
    let timePassed = Date.now() - start;

    if (timePassed >= time) {
      clearInterval(timer);
      return;
    }
    draw(timePassed, element);
  }, 50);
}
function draw(timePassed: number, HtmlElement: HTMLElement) {
  let element = HtmlElement;
  element.style.transform = `translateX(${timePassed / 10}px)`;
}
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
// function displayCar(carName: string, carColor: string, carId: number) {
//   const carBox = createCarBox(carName, carColor, carId);
//   garageCars.insertAdjacentHTML('beforeend', carBox);
// }

function displayAllCars(cars:Array<{name: string, color: string, id: number}>) {
  // getCar().then((response) => {
  //   response.map((item) => {
  //     const carBox = createCarBox(item.name, item.color, item.id);
  //     garageCars.insertAdjacentHTML('beforeend', carBox);
  //     return '';
  //   });
  // });
  garageCars.innerHTML = '';
  cars.map((item:{name: string, color: string, id: number}) => {
    const carBox = createCarBox(item.name, item.color, item.id);
    garageCars.insertAdjacentHTML('beforeend', carBox);
    return '';
  });
}

// ADD 100 CARS
const add100CarsBtn = document.querySelector('.add-cars') as HTMLButtonElement;
add100CarsBtn.addEventListener('click', () => {
  for (let i = 0; i < 10; i += 1) {
    const randomBrandNum = generateRandomNumber(carBrands.length - 1);
    const randomNameNum = generateRandomNumber(randomWords.length);
    const randomColor = generateRandomColor();
    const carDetails = {
      name: `${carBrands[randomBrandNum]} ${randomWords[randomNameNum]}`,
      color: `#${randomColor}`,
    };
    createCar(carDetails);
    // .then((cardId) => {
    //   displayCar(carDetails.name, carDetails.color, cardId);
    // });
  }
  // pagination().then((cars) => {
  //   displayAllCars(cars);
  // });
  pagination(+paginationCurrentPage.innerHTML).then((cars) => {
    displayAllCars(cars);
  });
  displayCarsTotalNum();
  displayTotalPages();
});

function generateRandomNumber(max: number): number {
  const randomNum = Math.floor(Math.random() * max) + 1;
  return randomNum;
}
function generateRandomColor(): string {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

// CARS NUM and PAGINATION
const carsTotalNum = document.querySelector('.cars-amount__num') as HTMLElement;
function displayCarsTotalNum() {
  getCar().then((cars) => {
    carsTotalNum.innerHTML = `${cars.length}`;
  });
}
displayCarsTotalNum();

paginationBtns.addEventListener('click', async (event) => {
  let eventTarget = event.target as HTMLElement;
  const totalPages = +paginationTotalPages.innerHTML;
  console.log(totalPages);
  let currentPage = +paginationCurrentPage.innerHTML;
  // const allCars = await getCar();
  if (eventTarget.classList.contains('btn-prev')) {
    return;
  }
  if (eventTarget.classList.contains('btn-next')) {
    currentPage += 1;
    pagination(+currentPage).then((cars) => {
      displayAllCars(cars);
    });
    paginationCurrentPage.innerHTML = `${currentPage}`;
  }
});
function displayTotalPages() {
  getCar().then((cars) => {
    paginationTotalPages.innerHTML = `${Math.floor(cars.length / 7) + 1}`;
  });
}
displayTotalPages();

async function pagination(currentPage: number, _totalPages?:number) {
  let carsPerPage: Array<{name: string, color: string, id: number}>;
  const cars = await getCar();
  let sart = 7 * (currentPage - 1);
  carsPerPage = cars.slice(sart, sart + 7);
  return carsPerPage;
}

window.addEventListener('load', () => {
  // console.log(paginationCurrentPage.innerHTML);
  pagination(+paginationCurrentPage.innerHTML).then((cars) => {
    displayAllCars(cars);
  });
});

// ANIMATE CAR
// let start: null | number = null;
// let element = document.getElementById('h1');

// function step(timestamp) {
//   if (!start) start = timestamp;
//   let progress = timestamp - start;
//   element.style.transform = `translateX(${Math.min(progress / 10, 200)}px)`;
//   if (progress < 2000) {
//     window.requestAnimationFrame(step);
//   }
// }
async function getTime(carId: number) {
  let velocity: number;
  let distance: number;
  let time: number;
  const response = await startCar(carId);
  velocity = response.velocity;
  distance = response.distance;
  time = distance / velocity;
  return time;
}

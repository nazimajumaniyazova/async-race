/* eslint-disable no-array-constructor */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
import './styles/style.scss';
import createCarBox, { createWinnerBox } from './ui';
import randomWords from './randomWords';

const carBrands = ['Audi', 'BMW', 'Citroen', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Kia', 'Mazda', 'Mersedes', 'Mini', 'Mitsubishi', 'Peugeot', 'Pontiac', 'Porsche', 'Suzuki', 'Tesla', 'Volkswagen', 'Volvo'];
const sectionGarage = document.querySelector('.garage')!;
const sectionWinners = document.querySelector('.winners')!;
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu__item');
const winnersList = document.querySelector('.winners-list')!;

// let animations:Array<number>;
let animations:Array<{id: number}> = [];
let carsOnPage: Array<HTMLElement> = [];
let winnerCar: {id: number, wins: number, time: number};
// let carsOnPage = new Map<number, HTMLElement>();
menu?.addEventListener('click', async (event) => {
  const eventTarget = event.target as HTMLElement;
  const eventTargetSection = eventTarget?.dataset.target;
  if (eventTargetSection === 'garage') {
    sectionGarage?.classList.add('show');
    sectionWinners?.classList.remove('show');
  }
  if (eventTargetSection === 'winners') {
    sectionWinners?.classList.add('show');
    sectionGarage?.classList.remove('show');
    await displayWinnersList();
  }
  menuItems.forEach((item) => {
    item.classList.remove('active');
  });
  eventTarget.classList.add('active');
});

async function displayWinnersList() {
  winnersList.innerHTML = '';
  const winners = await getWinners();
  winners.map(async (winner: {id: number, wins: number, time: number}, index: number) => {
    const carDetails: {name: string, color: string, id: number} = await getSingletCar(winner.id);
    const winnerBox = createWinnerBox(carDetails.name, carDetails.color, winner.id, winner.time, winner.wins, index + 1);
    winnersList.insertAdjacentHTML('beforeend', winnerBox);
    return '';
  });
}
// CREATE CAR
const createCarBtn = document.querySelector('.create-btn')!;

const createCarColor = document.querySelector('.create-car__color') as HTMLSelectElement;
const createCarName = document.querySelector('.create-car__name') as HTMLInputElement;
const createCarSelectBrand = document.querySelector('.create-car__brands') as HTMLSelectElement;

const paginationCurrentPage = document.querySelector('.pagination__current') as HTMLButtonElement;
const paginationTotalPages = document.querySelector('.pagination__total') as HTMLButtonElement;

const paginationBtns = document.querySelector('.pagination-btn') as HTMLElement;

const raceAllBtn = document.querySelector('.race-btn') as HTMLButtonElement;

const allBtns = document.querySelectorAll('.btn') as NodeListOf<HTMLButtonElement>;
let carsBtns: NodeListOf<HTMLButtonElement>;
const resetBtn = document.querySelector('.reset-btn') as HTMLButtonElement;
resetBtn.disabled = true;
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
  //  const carBoxColor = singCarBox.querySelector('.create-car__color')!;
  const carBoxColor = singCarBox.querySelector('.car-img')! as HTMLElement;
  carBoxName.innerHTML = carName;
  carBoxColor.style.backgroundColor = carColor;
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
async function getSingletCar(carID: number) {
  const response = await fetch(`http://127.0.0.1:3000/garage/${carID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}
async function startOrStopCar(carId: number, status: 'started' | 'stopped'): Promise<{velocity: number, distance: number}> {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${carId}&status=${status}`, {
    method: 'PATCH',
  });
  const data = await response.json();
  return data;
}
async function driveMode(carId: number) {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${carId}&status=drive`, {
    method: 'PATCH',
  }).catch();
  if (response.status !== 200) {
    return { success: false };
  }
  const data = await response.json();
  return data;
}

async function createWinner(winnerDetails: object) {
  const response = await fetch('http://127.0.0.1:3000/winners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(winnerDetails),
  });
  return response;
  // const data = await response.json();
  // fetch('http://127.0.0.1:3000/winners', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(winnerDetails),
  // }).then((response) => response.status)
  //   .catch((err) => err.message);
}

async function updateWinner(id: number, wins: number, time: number) {
  let winnerDetails = { wins, time };
  const response = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(winnerDetails),
  });
  return response;
}
async function getWinner(carID: number) {
  let url = `http://127.0.0.1:3000/winners/${carID}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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

async function deleteWinner(carId: number) {
  fetch(`http://127.0.0.1:3000/winners/${carId}`, {
    method: 'DELETE',
  });
}
async function getWinners() {
  let url = 'http://127.0.0.1:3000/winners/';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}
// UPDATE CAR

const garageCars = document.querySelector('.garage__cars') as HTMLElement;

garageCars.addEventListener('click', async (event: Event) => {
  const eventTarget = event?.target as HTMLElement;
  const eventTargetClosest = eventTarget.closest('.car__box') as HTMLElement;
  const editCar = eventTargetClosest.querySelector('.edit-car') as HTMLElement;
  const carId = eventTargetClosest?.getAttribute('data-id')!;
  const carButtons = eventTargetClosest?.querySelectorAll('.btn') as NodeListOf<HTMLButtonElement>;
  const carStopBtn = eventTargetClosest.querySelector('.car__box__stop') as HTMLButtonElement;
  let element = eventTargetClosest.querySelector('.car-img')! as HTMLElement;
  if (eventTarget.classList.contains('car__box__remove')) {
    removeCar(+carId);
    await deleteWinner(+carId);
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
    carButtons.forEach((item) => {
      let btn: HTMLButtonElement = item;
      btn.disabled = true;
    });
    carStopBtn.disabled = false;
    const distance = eventTargetClosest.querySelector<HTMLElement>('.car__path-line')?.offsetWidth as number - 50;
    const time = await getTime(+carId);
    startAnimation(element, +carId, distance, time);
    const canDrive = await driveMode(+carId);
    if (!canDrive.success) {
      window.cancelAnimationFrame(animations[+carId].id);
    }
  }
  if (eventTarget.classList.contains('car__box__stop')) {
    window.cancelAnimationFrame(animations[+carId].id);
    element.style.transform = 'translateX(0)';
    carButtons.forEach((item) => {
      let btn: HTMLButtonElement = item;
      btn.disabled = false;
    });
    await startOrStopCar(+carId, 'stopped');
  }
});

function startAnimation(element: HTMLElement, elementId: number, distance:number, animationTime: number) {
  let start: null | number = null;
  const car: HTMLElement = element;
  let stateId: number;
  function animate(timestamp: number) {
    if (!start) {
      start = timestamp;
    }
    const progress = timestamp - start;
    const passed = Math.round(progress * (distance / animationTime));
    car.style.transform = `translateX(${Math.min(passed, distance)}px`;
    if (passed < distance) {
      stateId = window.requestAnimationFrame(animate);
      // animations[elementId] = { id: stateId };
      animations[elementId] = { id: stateId };
    } else {
      if (raceAllBtn.classList.contains('active')) {
        const winnerMessage = `<p class="winner-message">Wins: ${carsOnPage[elementId].querySelector('.car__box-name')?.innerHTML!} in ${animationTime / 1000}s</p>`;
        //  const winnerMessage = `<p class="winner-message">Wins: ${carsOnPage[elementId - 1].querySelector('.car__box-name')?.innerHTML!} </p>`;
        element.closest('.car__box')?.insertAdjacentHTML('beforeend', winnerMessage);
        raceAllBtn.classList.remove('active');
        resetBtn.disabled = false;
        setWinnerCar(elementId, animationTime);
      }
      window.cancelAnimationFrame(animations[elementId].id);
    }
  }
  stateId = window.requestAnimationFrame(animate);
  animations[elementId] = { id: stateId };
}

async function setWinnerCar(carId: number, time: number) {
  const winTime = time / 1000;
  const res = await createWinner({ id: carId, wins: 1, time: winTime });
  if (res.status === 500) {
    const car = await getWinner(carId);
    const winNum = car.wins + 1;
    const oldTime = car.time;
    await updateWinner(carId, winNum, Math.min(time, oldTime));
  }
}
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

function displayAllCars(cars:Array<{name: string, color: string, id: number}>) {
  garageCars.innerHTML = '';
  carsOnPage = [];
  cars.map((item:{name: string, color: string, id: number}) => {
    const carBox = createCarBox(item.name, item.color, item.id);
    garageCars.insertAdjacentHTML('beforeend', carBox);
    // carsOnPage.push(garageCars.querySelector(`[data-id="${item.id}"]`)!);
    carsOnPage[item.id] = garageCars.querySelector(`[data-id="${item.id}"]`)!;
    return '';
  });
  carsBtns = garageCars.querySelectorAll('.btn');
}

// ADD 100 CARS
const add100CarsBtn = document.querySelector('.add-cars') as HTMLButtonElement;
add100CarsBtn.addEventListener('click', () => {
  for (let i = 0; i < 100; i += 1) {
    const randomBrandNum = generateRandomNumber(carBrands.length - 1);
    const randomNameNum = generateRandomNumber(randomWords.length);
    const randomColor = generateRandomColor();
    const carDetails = {
      name: `${carBrands[randomBrandNum]} ${randomWords[randomNameNum]}`,
      color: `#${randomColor}`,
    };
    createCar(carDetails);
  }
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

const prevBtn = document.querySelector('.btn-prev') as HTMLButtonElement;
prevBtn.classList.add('non-active');

const nextBtn = document.querySelector('.btn-next') as HTMLButtonElement;
paginationBtns.addEventListener('click', async (event) => {
  let eventTarget = event.target as HTMLButtonElement;
  const totalPages = +paginationTotalPages.innerHTML;
  let currentPage = +paginationCurrentPage.innerHTML;
  if (eventTarget.classList.contains('btn-prev')) {
    if (nextBtn.classList.contains('non-active')) {
      nextBtn.classList.remove('non-active');
    }
    if (currentPage <= 1) {
      prevBtn.classList.add('non-active');
      return;
    }
    currentPage -= 1;
    if (currentPage === 1) {
      prevBtn.classList.add('non-active');
    }
    pagination(+currentPage).then((cars) => {
      displayAllCars(cars);
    });
    animations = [];
    paginationCurrentPage.innerHTML = `${currentPage}`;
  }
  if (eventTarget.classList.contains('btn-next')) {
    if (prevBtn.classList.contains('non-active')) {
      prevBtn.classList.remove('non-active');
    }
    currentPage += 1;
    if (currentPage > +paginationTotalPages.innerHTML) {
      nextBtn.classList.add('non-active');
      return;
    }
    if (currentPage === +paginationTotalPages.innerHTML) {
      nextBtn.classList.add('non-active');
    }
    pagination(+currentPage).then((cars) => {
      displayAllCars(cars);
    });
    animations = [];
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
  pagination(+paginationCurrentPage.innerHTML).then((cars) => {
    displayAllCars(cars);
    // cars.map((car) => console.log(document.querySelector(`[data-id = '${car.id}']`)));
  });
});

// ANIMATE CAR
async function getTime(carId: number) {
  let velocity: number;
  let distance: number;
  let time: number;
  const response = await startOrStopCar(carId, 'started');
  velocity = response.velocity;
  distance = response.distance;
  time = Math.round(distance / velocity);
  return time;
}

// RACE ALL

raceAllBtn.addEventListener('click', () => {
  raceAllBtn.classList.add('active');
  allBtns.forEach((item) => {
    let btn = item;
    btn.disabled = true;
  });
  carsBtns.forEach((item) => {
    let btn = item;
    btn.disabled = true;
  });
  raceAll();
});
resetBtn.addEventListener('click', () => {
  carsOnPage.map(async (car) => {
    const element = car.querySelector('.car-img')! as HTMLElement;
    const carId = car.getAttribute('data-id')!;
    window.cancelAnimationFrame(animations[+carId].id);
    element.style.transform = 'translateX(0)';
    await startOrStopCar(+carId, 'stopped');
  });
  document.querySelector('.winner-message')?.remove();
  allBtns.forEach((item) => {
    let btn = item;
    btn.disabled = false;
  });
  carsBtns.forEach((item) => {
    let btn = item;
    btn.disabled = false;
  });
  resetBtn.disabled = true;
});
async function raceAll() {
  carsOnPage.map(async (car) => {
    const distance = car.querySelector<HTMLElement>('.car__path-line')?.offsetWidth as number - 50;
    const element = car.querySelector('.car-img')! as HTMLElement;
    const carId = car.getAttribute('data-id')!;
    const time = await getTime(+carId);
    startAnimation(element, +carId, distance, time);
    const canDrive = await driveMode(+carId);
    if (!canDrive.success) {
      window.cancelAnimationFrame(animations[+carId].id);
      animations[+carId].id = 0;
    }
    return '';
  });
}

// SORT
let winsSortBy: 'as' | 'desc' = 'as';
let timeSortBy: 'as' | 'desc' = 'as';
const sortWins = document.querySelector('.sort-wins') as HTMLButtonElement;
const sortTime = document.querySelector('.sort-time') as HTMLButtonElement;
sortWins.addEventListener('click', async () => {
  let winners = await getWinners();
  if (timeSortBy === 'as') {
    winners.sort(compareAS);
    timeSortBy = 'desc';
  } else {
    winners.sort(compareDes);
    timeSortBy = 'as';
  }
  winnersList.innerHTML = '';
  winners.map(async (winner: {id: number, wins: number, time: number}, index: number) => {
    const carDetails: {name: string, color: string, id: number} = await getSingletCar(winner.id);
    const winnerBox = createWinnerBox(carDetails.name, carDetails.color, winner.id, winner.time, winner.wins, index + 1);
    winnersList.insertAdjacentHTML('beforeend', winnerBox);
    return '';
  });
});
sortTime.addEventListener('click', async () => {
  let winners = await getWinners();
  if (winsSortBy === 'as') {
    winners.sort(TcompareAS);
    winsSortBy = 'desc';
  } else {
    winners.sort(TcompareDes);
    winsSortBy = 'as';
  }
  winnersList.innerHTML = '';
  winners.map(async (winner: {id: number, wins: number, time: number}, index: number) => {
    const carDetails: {name: string, color: string, id: number} = await getSingletCar(winner.id);
    const winnerBox = createWinnerBox(carDetails.name, carDetails.color, winner.id, winner.time, winner.wins, index + 1);
    winnersList.insertAdjacentHTML('beforeend', winnerBox);
    return '';
  });
});
function compareAS(a: {id: number, wins: number, time: number}, b: {id: number, wins: number, time: number}) {
  return a.wins - b.wins;
}
function compareDes(a: {id: number, wins: number, time: number}, b: {id: number, wins: number, time: number}) {
  return b.wins - a.wins;
}
function TcompareAS(a: {id: number, wins: number, time: number}, b: {id: number, wins: number, time: number}) {
  return a.time - b.time;
}
function TcompareDes(a: {id: number, wins: number, time: number}, b: {id: number, wins: number, time: number}) {
  return b.time - a.time;
}

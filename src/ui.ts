function createCarBox(carName: string, carColor: string, carID?: number) {
  const carBox = ` <div class="car__box" data-id = "${carID}">
  <div class="car__settings">
    <div class="car__settings-left">
      <button class="btn car__box__remove">🗙</button>
      <button class="btn car__box__edit">✎</button>
      <div class="car__box-name">${carName} ${carID}</div>
      <div class="edit-car hide">
        <select class="create-car__brands">
          <option value="Audi">Audi</option>
          <option value="BMW">BMW</option>
          <option value="Citroen">Citroen</option>
          <option value="Fiat">Fiat</option>
          <option value="Ford">Ford</option>
          <option value="Honda">Honda</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Jaguar">Jaguar</option>
          <option value="Kia">Kia</option>
          <option value="Mazda">Mazda</option>
          <option value="Mersedes">Mersedes</option>
          <option value="Mini">Mini</option>
          <option value="Mitsubishi">Mitsubishi</option>
          <option value="Peugeot">Peugeot</option>
          <option value="Pontiac">Pontiac</option>
          <option value="Porsche">Porsche</option>
          <option value="Suzuki">Suzuki</option>
          <option value="Tesla">Tesla</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Volvo">Volvo</option>
        </select>
        <input class="create-car__name" type="text" maxlength="20">
        <input class="input-color create-car__color" type="color" value="#65b6cb">
        <button class="btn update-btn">update</button>
      </div>
    </div>
    <div class="car__settings-right">
      <button class="btn car__box__stop">■</button>
      <button class="btn car__box__start">▶</button>
    </div>
  </div>
  <div class="car__path">
    <div class="car-img"  style="background-color:${carColor};" >
    </div>
    <div class="car__path-line"></div>
  </div>
  </div>`;
  console.log(carColor);
  return carBox;
}

export default createCarBox;

class Road {
    constructor(image, y) {
        this.x = 0;
        this.y = y;

        this.image = new Image();
        this.image.src = image;
    }

    Update(road) {
        this.y += speed; //При обновлении изображение смещается вниз

        if (this.y > window.innerHeight) { //Если изображение ушло за край холста, то меняем положение
            this.y = road.y - this.image.height + speed; //Новое положение указывается с учётом второго фона
        }
    }
}

class Car {
    constructor(image, x, y) {
        this.x = x;
        this.y = y;
        this.dead = false; //Если true, то машина удаляется из массива "object"


        this.image = new Image();
        this.image.src = image;
    }

    Update() { //Движение машинок соперников вниз
        this.y += speed;

        if (this.y > canvas.height + 50) { //Удаляем машину из массива "object" если она уехала вниз за пределы поля игры
            this.dead = true;
        }
    }

    Collide(car) {
        let hit = false;

        if (this.y < car.y + car.image.height * scale && this.y + this.image.height * scale > car.y) { //Если объекты находятся на одной линии по горизонтали

            if (this.x + this.image.width * scale > car.x && this.x < car.x + car.image.width * scale) { //Если объекты находятся на одной линии по вертикали
                hit = true;
            }
        }

        return hit;
    }

    Move(v, d) {
        if (v == "x") { //Перемещение по оси X

            this.x += d; //Смещение

            //Если при смещении объект выходит за края холста, то изменения откатываются
            if (this.x + this.image.width * scale > canvas.width) {
                this.x -= d;
            }

            if (this.x < 0) {
                this.x = 0;
            }
        } else { //Перемещение по оси Y

            this.y += d;

            //Если при смещении объект выходит за края холста, то изменения откатываются
            if (this.y + this.image.height * scale > canvas.height) {
                this.y -= d;
            }

            if (this.y < 0) {
                this.y = 0;
            }
        }
    }
}

let canvas = document.getElementById("canvas"); //Получение холста из DOM
let ctx = canvas.getContext("2d"); //Получение контекста

let scale = 0.2; //Масштаб машин
let speed = 5; //Скорость игры

const Resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

Resize(); // При загрузке страницы задаётся размер холста

const RandomInteger = (min, max) => { //Функция генерации случайных чисел
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

window.addEventListener("resize", Resize); //При изменении размеров окна будут меняться размеры холста

const KeyDown = (e) => {
    switch (e.keyCode) {
        case 37: //Влево
            player.Move("x", -speed);
            break;

        case 39: //Вправо
            player.Move("x", speed);
            break;

        case 38: //Вверх
            player.Move("y", -speed);
            break;

        case 40: //Вниз
            player.Move("y", speed);
            break;

        case 27: //Esc
            if (timer == null) {
                Start();
            } else {
                Stop();
            }
            break;
    }
}

window.addEventListener("keydown", function(e) { KeyDown(e); }); //Получение нажатий с клавиатуры

let player = new Car("img/car.png", 200, 200); //Машина игрока

let objects = []; //Массив машин (игровые объекты)

let roads = [
    new Road("img/road.jpg", 0),
    new Road("img/road.jpg", 626)
]; //Массив с фонами

let score = 0; //Счет - количество обогнанных машин

const Draw = () => { //Работа с графикой
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
    for (let i = 0; i < roads.length; i++) { //Отрисовка дорожного полотна
        ctx.drawImage(
            roads[i].image, //Изображение для отрисовки
            0, //Начальное положение по оси X на изображении
            0, //Начальное положение по оси Y на изображении
            roads[i].image.width, //Ширина изображения
            roads[i].image.height, //Высота изображения
            roads[i].x, //Положение по оси X на холсте
            roads[i].y, //Положение по оси Y на холсте
            canvas.width, //Ширина изображения на холсте
            canvas.height //Высота изображения на холсте
        );
    }
    for (let i = 0; i < objects.length; i++) { //Отрисовка машины игрока
        ctx.drawImage(
            player.image, //Изображение для отрисовки
            0, //Начальное положение по оси X на изображении
            0, //Начальное положение по оси Y на изображении
            player.image.width, //Ширина изображения
            player.image.height, //Высота изображения
            player.x, //Положение по оси X на холсте
            player.y, //Положение по оси Y на холсте
            player.image.width * scale, //Ширина изображения на холсте, умноженная на масштаб
            player.image.height * scale //Высота изображения на холсте, умноженная на масштаб
        );
    }

    for (let i = 0; i < objects.length; i++) { //Отрисовка машин соперников
        ctx.drawImage(
            objects[i].image, //Изображение для отрисовки
            0, //Начальное положение по оси X на изображении
            0, //Начальное положение по оси Y на изображении
            objects[i].image.width, //Ширина изображения
            objects[i].image.height, //Высота изображения
            objects[i].x, //Положение по оси X на холсте
            objects[i].y, //Положение по оси Y на холсте
            objects[i].image.width * scale, //Ширина изображения на холсте, умноженная на масштаб
            objects[i].image.height * scale //Высота изображения на холсте, умноженная на масштаб
        );
    }

    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, canvas.height - 20)
}



const Update = () => { //Обновление игры
    roads[0].Update(roads[1]);
    roads[1].Update(roads[0]);

    if (RandomInteger(0, 10000) > 9700) { //С определённой вероятностью создаем объект и добавляем его в массив objects
        objects.push(new Car("img/car_red.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1));
    }

    let hasDead = false;

    for (let i = 0; i < objects.length; i++) {
        objects[i].Update();
        if (objects[i].dead) {
            hasDead = true;
        }
    }
    if (hasDead) {
        objects.shift();
        score += 1;
    }

    let hit = false;

    for (let i = 0; i < objects.length; i++) {
        hit = player.Collide(objects[i]);

        if (hit) {
            let endGame = confirm(`Игра окончена. Ваши очки: ${score}. Сыграете еще?`);
            Stop();
            if (endGame) {
                location.reload()
            }
            break;
        }
    }

    Draw();
}

const Start = () => {
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
}

const Stop = () => {
    clearInterval(timer); //Остановка обновления
}

Start();
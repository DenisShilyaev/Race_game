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

        this.image = new Image();
        this.image.src = image;
    }

    Update() {
        this.y += speed;
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

let scale = 0.1; //Масштаб машин
let speed = 4; //Скорость игры

const Resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

Resize(); // При загрузке страницы задаётся размер холста

window.addEventListener("resize", Resize); //При изменении размеров окна будут меняться размеры холста

const KeyDown = (e) => {
    switch (e.keyCode) {
        case 37: //Влево
            break;

        case 39: //Вправо
            break;

        case 38: //Вверх
            break;

        case 40: //Вниз
            break;

        case 27: //Esc
            break;
    }
}

window.addEventListener("keydown", function(e) { KeyDown(e); }); //Получение нажатий с клавиатуры

let objects = [ 
new Car("img/car.png", 15, 10)
]; //Массив игровых объектов

let player = 0;

let roads = [
    new Road("img/road.jpg", 0),
    new Road("img/road.jpg", 626)
]; //Массив с фонами

let player = null; //Объект, которым управляет игрок, — тут будет указан номер объекта в массиве objects

const Draw = () => { //Работа с графикой
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
    for (var i = 0; i < roads.length; i++) {
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
}

const Update = () => { //Обновление игры
    roads[0].Update(roads[1]);
    roads[1].Update(roads[0]);
    Draw();
}

const Start = () => {
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
}

const Stop = () => {
    clearInterval(timer); //Остановка обновления
}

Start();
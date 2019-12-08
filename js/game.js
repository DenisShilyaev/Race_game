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

let canvas = document.getElementById("canvas"); //Получение холста из DOM
let ctx = canvas.getContext("2d"); //Получение контекста

let scale = 0.1; //Масштаб машин

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

let objects = []; //Массив игровых объектов
let roads = [
    new Road("images/road.jpg", 0),
    new Road("images/road.jpg", 626)
]; //Массив с фонами

let player = null; //Объект, которым управляет игрок, — тут будет указан номер объекта в массиве objects

const Draw = () => { //Работа с графикой
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
}

const Update = () => { //Обновление игры
    Draw();
}

const Start = () => {
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
}

const Stop = () => {
    clearInterval(timer); //Остановка обновления
}
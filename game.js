let canvas = document.getElementById("canvas"); //Получение холста из DOM
let ctx = canvas.getContext("2d"); //Получение контекста

let scale = 0.1; //Масштаб машин

const Resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

Resize(); // При загрузке страницы задаётся размер холста

window.addEventListener("resize", Resize); //При изменении размеров окна будут меняться размеры холста

window.addEventListener("keydown", function(e) { KeyDown(e); }); //Получение нажатий с клавиатуры

let objects = []; //Массив игровых объектов
let roads = []; //Массив с фонами

let player = null; //Объект, которым управляет игрок, — тут будет указан номер объекта в массиве objects

const Update = () => { //Обновление игры
    Draw();
}

const Start = () => {
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
}

const Stop = () => {
    clearInterval(timer); //Остановка обновления
}

const Draw = () => { //Работа с графикой
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
}

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
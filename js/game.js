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

    Collide(car) { //Обработка коллизий (столкновений) машин.
        let hit = false; //Если true значит машины столкнулись

        if (this.y < car.y + car.image.height * scale && this.y + this.image.height * scale > car.y) { //Если объекты находятся на одной линии по горизонтали

            if (this.x + this.image.width * scale > car.x && this.x < car.x + car.image.width * scale) { //Если объекты находятся на одной линии по вертикали
                hit = true;
            }
        }

        return hit;
    }

    Move(v, d) {
        if (v == "x") { //Если перемещеие по оси X

            this.x += d; //Смещение по оси X на переданное расстояние

            //Если при смещении объект выходит за края холста, то изменения откатываются
            if (this.x + this.image.width * scale > canvas.width) {
                this.x -= d;
            }

            if (this.x < 0) {
                this.x = 0;
            }
        } else { //Если перемещеие по оси Y

            this.y += d; //Смещение по оси Y на переданное расстояние

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

let scale = 0.11; //Масштаб машин
let speed = 5; //Скорость игры

const Resize = () => { //Задаем размер холста равный размеру окна
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

Resize(); // При загрузке страницы задаётся размер холста

const RandomInteger = (min, max) => { //Функция генерации случайных чисел
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

window.addEventListener("resize", Resize); //При изменении размеров окна будут меняться размеры холста

let overlay = document.querySelector('.overlay');
let modal = document.querySelector('.modal');

modal.addEventListener("click", function(e) { GameSetup(e); }); //Получение нажатий с клавиатуры для игры

const GameSetup = (e) => {
    if (e.target.classList.contains('easy')) { //Настраиваем уровни сложности игры
        speed = 4;
    } else if (e.target.classList.contains('normal')) {
        speed = 5;
    } else if (e.target.classList.contains('hard')) {
        speed = 6;
    }
    if (e.target.classList.contains('button')) { //Делаем меню невидимым и начинаем игру после нажатия на любую кнопку в меню
        modal.style.display = 'none';
        overlay.style.display = 'none';
        Start();
    }
}

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

window.addEventListener("keydown", function(e) { KeyDown(e); }); //Получение нажатий с клавиатуры для игры

let player = new Car("img/car_player.png", canvas.width / 2, canvas.height / 2); //Машина игрока

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

    ctx.drawImage( //Отрисовка машины игрока 
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

    ctx.fillStyle = "#000"; //Задаем цвет текста для отображения текущего счета
    ctx.font = "24px Verdana"; //Задаем размер и стиль текста для отображения текущего счета
    ctx.fillText("Счет: " + score, 10, canvas.height - 20) //Выводим текущий счет в заданых координатах
    ctx.fillText("Скорость игры: " + speed, 10, canvas.height - 50) //Выводим текущую скорость игры в заданых координатах
}

let letters = document.querySelector('.letters');
let textWrapper = document.querySelector('.ml7 .letters');

const Announcement = (text) => { //Вывод аниммированного сообщение о текущем уровне игры

    letters.innerHTML = text;

    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({})
        .add({
            targets: '.ml7 .letter',
            translateY: ["1.1em", 0],
            translateX: ["0.55em", 0],
            translateZ: 0,
            rotateZ: [180, 0],
            duration: 750,
            easing: "easeOutExpo",
            delay: (el, i) => 50 * i
        }).add({
            targets: '.ml7',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
}

const CeckLevel = () => {
    if (score == 5) {
        Announcement("Уровень №2!");
        score += 3;
        speed += 1;
    } else if (score == 25) {
        score += 3;
        speed += 1;
        Announcement("Уровень №3!");
    } else if (score == 45) {
        score += 3;
        speed += 1;
        Announcement("Уровень №4!");
    } else if (score == 70) {
        score += 3;
        speed += 1;
        Announcement("Уровень №5!");
    }
}

const Update = () => { //Обновление игры
    roads[0].Update(roads[1]); //Обновляем дорожное полотно
    roads[1].Update(roads[0]);

    carRivalX = RandomInteger(30, canvas.width - 50);//Случайная координата Х появления новой машины соперника
    carRivalY = RandomInteger(250, 400) * -1; //Случайная координата У появления новой машины соперника
    random0_10000 = RandomInteger(0, 10000); //Случайное число от 0 до 10000 

    if (9700 < random0_10000 && random0_10000 < 9750) { //С определённой вероятностью создаем машину (объект) и добавляем его в массив objects
        objects.push(new Car("img/car_rival_1.png", carRivalX, carRivalY));
    } else if (9751 < random0_10000 && random0_10000 < 9800) {
        objects.push(new Car("img/car_rival_2.png", carRivalX, carRivalY));
    }  else if (9801 < random0_10000 && random0_10000 < 9850) {
        objects.push(new Car("img/car_rival_3.png", carRivalX, carRivalY));
    } else if (9851 < random0_10000 && random0_10000 < 9900) {
        objects.push(new Car("img/car_rival_4.png", carRivalX, carRivalY));
    } else if (9950 < random0_10000 && random0_10000 < 10000) {
        objects.push(new Car("img/car_rival_5.png", carRivalX, carRivalY));
    }

    for (let i = 0; i < objects.length - 1; i++) { //Ищем машины соперников, которые появились с наложением друг на друга
        if (objects[i].Collide(objects[i + 1])) { //Если машины наложены, то переопределяем координаты одной из машин на новые (случайные)
            objects[i + 1].x = carRivalX;
            objects[i + 1].y = carRivalY;
        }
    }

    let hasDead = false;

    for (let i = 0; i < objects.length; i++) { //Ищем машины соперников, которые уехали вниз за пределы поля игры
        objects[i].Update();
        if (objects[i].dead) {
            hasDead = true;
        }
    }
    if (hasDead) { //Если машина соперников уехала за пределы поля игры, то удаляем её из массива и увеличиваем счет на +1
        objects.shift();
        score += 1;
    }

    let hit = false; //Если true, значит произошло столкновение машины игрока с машиной соперника

    for (let i = 0; i < objects.length; i++) {
        hit = player.Collide(objects[i]); //Определяем столкновение машины игрока с машиной соперника

        if (hit) { // Если столкновение произошло, то останавливаем игру и выводим сообщение о окончании игры 
            let endGame = confirm(`Конец игры.\r\nВаши очки: ${score}.\r\nДостигнутая скорость игры: ${speed}.\r\nСыграете еще раз?`);
            Stop();
            if (endGame) {
                location.reload()
            }
            break;
        }
    }
    CeckLevel();
    Draw();
}

let level = 1; //Уровень игры

const Start = () => {
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
    Announcement(`Уровень №${level}!`); //Выводим сообщение о текущем уровне игры при старте
}

const Stop = () => {
    clearInterval(timer); //Остановка обновления
}
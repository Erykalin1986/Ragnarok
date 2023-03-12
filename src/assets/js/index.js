import "swiper/swiper.min.css";
import "../styles/reset.scss";
import "../styles/styles.scss";
import Swiper, { Navigation } from "swiper";
Swiper.use([Navigation]);

let isPlay = false;
const checkboxes = {
  requirements: ["minimum", "recommended"],
  versions: ["standard", "limited"],
};
const classes = {
  opened: "opened",
  hidden: "hidden",
  active: "active",
};

const checkbox = document.querySelectorAll(".checkbox");
const header = document.querySelector(".header");
const menuLink = document.querySelectorAll(".menu-link");
const menuButton = document.querySelector(".header-menu__button");
const video = document.getElementById("video");
const videoButton = document.querySelector(".video-btn");

/**
 * Переключает меню в режим виден / скрыт.
 * @returns Если force равно true, добавляет класс 'opened'.
 * Если force равно false, удаляет класс 'opened'.
 */
const toggleMenu = () => header.classList.toggle(classes.opened);

/**
 * Прокручивает страницу до раздела.
 * @param {*} event Событие click.
 */
const scrollToSection = (event) => {
  event.preventDefault();
  const href = event.currentTarget.getAttribute("href");

  if (!href && !href.startsWith("#")) return;

  const section = href.slice(1);
  const top = document.getElementById(section)?.offsetTop || 0;
  window.scrollTo({ top, behavior: "smooth" });
};

/**
 * Форматирует значение таймера.
 * @param {*} value Значение таймера.
 * @returns Занчение таймера в определённом формате.
 */
const formatValue = (value) => (value < 10 ? `0${value}` : value);

/**
 * Получает значения разницы даты для таймера.
 * @param {*} diff Разница даты.
 * @returns Объект содержащий в себе значения для таймера.
 */
const getTimerValues = (diff) => {
  return {
    seconds: (diff / 1000) % 60,
    minutes: (diff / (1000 * 60)) % 60,
    hours: (diff / (1000 * 3600)) % 24,
    days: (diff / (1000 * 3600 * 24)) % 30,
  };
};

/**
 * Заполняет значения таймера.
 * @param {*} values Значения таймера.
 */
const setTimerValues = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    const timerValue = document.getElementById(key);
    timerValue.innerText = formatValue(Math.floor(value));
  });
};

/**
 * Запускает таймер.
 * @param {*} date Конечная дата.
 */
const startTimer = (date) => {
  const intervalId = setInterval(() => {
    const diff = new Date(date).getTime() - new Date().getTime();

    if (diff < 0) {
      clearInterval(intervalId);
      return;
    }

    setTimerValues(getTimerValues(diff));
  }, 1000);
};

/**
 * Запускает или ставит на паузу воспроизведение видео.
 * @param {*} param0 Элемент кнопки.
 */
const handleVideo = ({ target }) => {
  const info = target.parentElement;
  isPlay = !isPlay;
  info.classList.toggle(classes.hidden, isPlay);
  target.innerText = isPlay ? "Pause" : "Play";
  isPlay ? video.play() : video.pause();
};

/**
 * Переключает описание по клику.
 * @param {*} param0 checked - положение переключателя. name - название блока.
 */
const handleCheckbox = ({ currentTarget: { checked, name } }) => {
  const { active } = classes;
  const value = checkboxes[name][Number(checked)];
  const list = document.getElementById(value);
  const tabs = document.querySelectorAll(`[data-${name}]`);
  const siblings = list.parentElement.children;

  for (const item of siblings) item.classList.remove(active);
  for (const tab of tabs) {
    tab.classList.remove(active);
    tab.dataset[name] === value && tab.classList.add(active);
  }

  list.classList.add(active);
};

/**
 * Инициализация слайдера.
 */
const initSlider = () => {
  new Swiper(".swiper", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 20,
    initialSlide: 2,
    navigation: {
      prevEl: ".swiper-button-prev",
      nextEl: ".swiper-button-next",
    },
  });
};

initSlider();
startTimer("November 11, 2023 00:00:00");
menuButton.addEventListener("click", toggleMenu);
videoButton.addEventListener("click", handleVideo);
menuLink.forEach((link) => link.addEventListener("click", scrollToSection));
checkbox.forEach((box) => box.addEventListener("click", handleCheckbox));

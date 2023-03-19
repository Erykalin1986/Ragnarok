import "swiper/swiper.min.css";
import "../styles/reset.scss";
import "../styles/styles.scss";
import Swiper, { Navigation } from "swiper";
import { languages } from "../js/languages.js";
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
const values = [
  {
    price: 19.99,
    version: "Standard Edition",
  },
  {
    price: 18.99,
    version: "Standard Edition",
  },
  {
    price: 29.99,
    version: "Deluxe Edition",
  },
];

const checkbox = document.querySelectorAll(".checkbox");
const header = document.querySelector(".header");
const menuLink = document.querySelectorAll(".menu-link");
const menuButton = document.querySelector(".header-menu__button");
const video = document.getElementById("video");
const videoButton = document.querySelector(".video-btn");
const faqItem = document.querySelectorAll(".faq-item");
const sections = document.querySelectorAll(".section");
const language = document.querySelectorAll(".language");
const buyButton = document.querySelectorAll(".buy-button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const modalVersion = document.querySelector(".modal-version");
const modalPrice = document.querySelector(".modal-total__price");
const modalClose = document.querySelector(".modal-close");

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

/**
 * Раскрывает элемент блока часто задаваемых вопросов.
 * @param {*} param0 Объект класса PointerEvent состояния события DOM.
 */
const handleFaqItem = ({ currentTarget: target }) => {
  target.classList.toggle(classes.opened);
  const isOpened = target.classList.contains(classes.opened);
  const height = target.querySelector("p").clientHeight;
  const content = target.querySelector(".faq-item__content");

  content.style.height = `${isOpened ? height : 0}px`;
};

/**
 * Действие при прокрутке страницы.
 */
const handleScroll = () => {
  const { scrollY: y, innerHeight: h } = window;
  sections.forEach((section) => {
    if (y > section.offsetTop - h / 1.5)
      section.classList.remove(classes.hidden);
  });
};

/**
 * Меняет техт на странице для выбранного языка.
 */
const setTexts = () => {
  const lang = localStorage.getItem("lang") || "ru";
  const content = languages[lang];

  Object.entries(content).forEach(([key, value]) => {
    const items = document.querySelectorAll(`[data-text=${key}]`);
    items.forEach((item) => (item.innerText = value));
  });
};

/**
 * Переключает язык сайта.
 * @param {*} param0 Ссылка на выбранный язык.
 */
const toggleLanguage = ({ target }) => {
  const { lang } = target.dataset;
  if (!lang) return;

  localStorage.setItem("lang", lang);
  setTexts();
};

/**
 * Открывает модальное окно.
 * @param {*} param0 Объект с названием версии и стоимости игры.
 */
const handleBuyButton = ({ currentTarget: target }) => {
  const { value } = target.dataset;
  if (!value) return;

  const { price, version } = values[value];
  modalVersion.innerText = version;
  modalPrice.innerText = `${price}$`;
  modal.classList.add(classes.opened);
  overlay.classList.add(classes.opened);
}

/**
 * Закрывает модальное окно.
 */
const closeModal = () => {
  modal.classList.remove(classes.opened);
  overlay.classList.remove(classes.opened);
}

initSlider();
setTexts();
startTimer("November 11, 2023 00:00:00");
window.addEventListener("scroll", handleScroll);
menuButton.addEventListener("click", toggleMenu);
videoButton.addEventListener("click", handleVideo);
menuLink.forEach((link) => link.addEventListener("click", scrollToSection));
checkbox.forEach((box) => box.addEventListener("click", handleCheckbox));
faqItem.forEach((item) => item.addEventListener("click", handleFaqItem));
language.forEach((lang) => lang.addEventListener("click", toggleLanguage));
buyButton.forEach((btn) => btn.addEventListener("click", handleBuyButton));
modalClose.addEventListener("click", closeModal);

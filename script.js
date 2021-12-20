"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener("click", function (e) {
  // Getting the coordiants of n element
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());
  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling to
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // with nice animation + smooth old school
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // a more modern way
  section1.scrollIntoView({
    behavior: "smooth",
  });
});

///////////////////////////////
// Page navigation
// implementing a smooth scrolling

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   // console.log(el);
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// implementing with Event delegation
// better way
// 1. Add event listener to common parent element
// 2. Detemine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching Strategy, to ignore clicks that did not happen right on one of these links.
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Building the Tabbed Components

// Bad Practice, cuz what if we had a 1000 tabs, this will slow th e page
// tabs.forEach((t) => t.addEventListener("click", () => console.log("TAB")));

// insted we us event delegation
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate Tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passsing "argument" into handler with the help of bind()
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// /////////////////////////////////////
// // Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener("scroll", function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });
////////////////////////////////////////////
// Sticky Navigation with IntersectionObserver

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
// calculating the navigation height
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSection = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // if it is not isIntersecting
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObsever = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObsever.observe(section);
  section.classList.add("section--hidden");
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

/////////////////////////////////
//////////////////////////////
///////////////////////////////
/* 
// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
console.log(allSections);

document.getElementById("section--1");
const allButtons = document.getElementsByTagName("button");

console.log(allButtons);

console.log(document.getElementsByClassName("btn"));

// Creating and inserting elements
const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent = `We use cookied for improved functionality and analytics`;
message.innerHTML = `We use cookied for improved functionality and analytics. <button class= "btn btn--close--cookie">Got it!</button>`;
// console.log(message);

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector(".btn--close--cookie")
  .addEventListener("click", function () {
    message.remove();
    // old way of removing element from DOM before .remove() method
    // message.parentElement.removeChild(message);
  });

// Styles, Attributes and Classes
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

// resetting the attributes
logo.alt = "Beautiful minimalist logo";
console.log(logo.alt);

// NON-standerd Attributes that's why it is not workin' & showing undefined result in Console
console.log(logo.designer);
// another way of reading this value from the DOM
console.log(logo.getAttribute("designer"));

logo.setAttribute("company", "Bankist");

console.log(logo.src);
console.log(logo.getAttribute("src"));

const link = document.querySelector(".nav__link--btn");
console.log(link.href);
console.log(link.getAttribute("href"));

// Data Attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add("c", "j");
logo.classList.remove("c", "j");
logo.classList.toggle("c");
logo.classList.contains("c"); // not includes

// Don't use, cuz this will override all the exiting classes &&
// also it allows us to only put one class
logo.className = "jonas";
 */
/* 
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  // Getting the coordiants of n element
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());
  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling to
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // with nice animation + smooth old school
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // a more modern way
  section1.scrollIntoView({
    behavior: "smooth",
  });
});
 */
/* 
// Types of Events
const h1 = document.querySelector("h1");

const alertH1 = function (e) {
  alert("addEventListener: Great! You are reading the heading : D");
};

h1.addEventListener("mouseenter", alertH1);
setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert("onmouseenter: Great! You are reading the heading :D");
// };
 */

/* 
// rgb(255,255,255)
// integer random number generator
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector(".nav__link").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("LINK", e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // not recommended or good idea to stop Propagation of events
  // e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("CONTAINER", e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("NAV", e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});
 */

// // Dom Traversing

// const h1 = document.querySelector("h1");

// // Going downwards: child
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = "purple";
// h1.lastElementChild.style.color = "orangered";

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // The closest() method finds parents no matter how far up in the DOM tree (HTML) opposite of querySelector whichfinds childern no matter how deep they are in the DOM tree (HTML)
// h1.closest(".header").style.background = "var(--gradient-secondary)";
// h1.closest("h1").style.background = "var(--gradient-primary)";

// // Going sideways: siblings (we can only access the previous and the next one)
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   // if the element is different or equal
//   if (el !== h1) el.style.transform = "scale(0.5";
// });

// Building a tabbed Components

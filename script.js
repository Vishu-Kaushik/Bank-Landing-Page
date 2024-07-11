'use strict';
const buttonTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// //////////////////////////////////////////////////////////////
// Implement Smooth Scrolling:
buttonTo.addEventListener('click', function (e) {
  // --> Getting coordinates of section1
  // --> Relative to the current viewport
  const s1coordinates = section1.getBoundingClientRect();
  console.log(s1coordinates);

  // --> Getting coordinates of the button
  // --> Here e.target specifies the button
  // console.log(e.target.getBoundingClientRect());

  // --> Getting the coordinates of the scrolled window
  // console.log('Scrolling pixels X/Y', window.pageXOffset, window.pageYOffset);
  // console.log('Scrolling pixels X/Y', window.scrollX, window.scrollY);

  // --> Getting the height and width of the viewport
  // console.log(
  //   'Height and Widht of viewPort',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // -->Scrolling : Old School -> manually calculating all of the values and saying to scroll to this position
  // -->Idea : current Position + current Scroll
  // window.scrollTo(
  //   s1coordinates.left + window.pageXOffset,
  //   s1coordinates.top + window.pageYOffset
  // );

  // ---> Smooth Scrolling  --> can be done by passing an object into the "scrollTo" method
  // window.scrollTo({
  //   left: s1coordinates.left + window.pageXOffset,
  //   top: s1coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // ----->  Modern Way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ---> Page Navigation : clearly this is not a efficient solution when huge number of buttons are there and the code gets copied multiple times
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = el.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// ---> Event Delegation: It is implemented with the help of Event Bubbling Concept
// ---> Implementing the above Navigation using the concept of Event Deligation
// ---> This is more efficient
// --> This is very important technique for Page Navigation. This involves 2 main steps
// 1. Add event listner to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target.textContent);
  console.log(e.target.classList);
  // --------------------------------------
  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component --> For operations wala space

// Using Event Delegation:

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);  // Debugging Statement

  // Guard Clause ---> special statements when a certain condition is matched it returns the function
  if (!clicked) {
    return;
  }

  // --> Remove Active Classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //--> Activate Tabs
  clicked.classList.add('operations__tab--active');

  //--> Activate Content Area : Accessing the correct tab using the DATA ATTRIBUTE
  // console.log(clicked.dataset.tab);  // Debugging Statement
  // Fetching the data attribute from each of the button
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// --> Menu Fade Animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // console.log(link);
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
//--> Handler Function can take only one parameter
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//--->  Sticky Navigation

// --> First Implementation : Using Scroll Event is pretty bad for performance of web page
// --> Scroll event is fired everytime we scroll even for a small distance

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// ---> Second implementation : Intersection Observer API
// Well, this API allows our code to basically observe changes to the way that a certain target element intersects another element, or the way it intersects the viewport.

// --> Just for learning
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null, // null is viewport
//   threshold: [0, 0.2], // passing an array of values ==> initial value and the when the final value is matched or if that much percentage of section is present in the viewport
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// --> Now implementing the StickY navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// --> Reveal Sections:

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  //--> For improving performance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ---> Lazy Loading Images = really affects the performance of the website

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Guard Clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Load event is just like any other event in JavaScript which can be listened
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// --> Slider :
const slider = function () {
  // Functions:
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlide = slides.length;

  // console.log(maxSlide);

  // const sliders = document.querySelector('.slider');
  // sliders.style.transform = 'scale(0.3) translateX(-800px)';
  // sliders.style.overflow = 'visible';

  // --> Creating the DOTS:
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // --> Activate DOTS:
  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (sli) {
      sli.classList.remove('dots__dot--active');
    });

    // slide.classList.add('dots__dot--active');  // when we are explicitly given a slide selected object only

    // --> Method 2:
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // ------------ VERY VERY VERY IMPORTANT ----------------------------------
  const goToSlide = function (curr) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curr)}%)`)
    );
  };
  // ------------ VERY VERY VERY IMPORTANT ----------------------------------

  // Next Slide
  // Goal: is to just export the functionality into its named fuction
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    // Active Slide is the one that is Zero% = 0%
    goToSlide(currSlide);
    activateDots(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activateDots(currSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDots(0);
  };
  init();
  // --> Event ListenerS:
  // --> Right Button
  btnRight.addEventListener('click', nextSlide);
  // --> Left Button
  btnLeft.addEventListener('click', prevSlide);

  // Arrow Navigation:
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // --> Event Handler for dots
  // --> Using Event Delegation
  // --> All the custom data attribute [present in HTML] are in the "dataset" set . {name of attribute}
  dotContainer.addEventListener('click', function (e) {
    // console.log(e);
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      const { slide } = e.target.dataset; // becuase this returns an object from the query(i.e. dataset)
      goToSlide(slide);
      // e.target.classList.add('dots__dot--active');
      activateDots(slide);
    }
  });
};
slider();
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lectures
// ///////////////////////////////////////////////////////////////////////////

/*
// SELECTING , CREATING AND DELETING ELEMENTS

// Selecting:
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// Using querySelector
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
// console.log(allSections); // returns a NodeList which is not updated automatically

// Using getElementByID and getElementsByTagName
document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); // returns a HTMLCollection which updates itself automatically when a button is deleted or inserted programmatically

// Using getElementsByClassName
// console.log(document.getElementsByClassName('btn')); // returns a HTMLCollection who have class name as "btn"

// -----------------------------------------------------------

// Creating And inserting Elements
// 1--> .insertingAdjacentHTML

// 2.
const message = document.createElement('div'); // this is just an object  that represents a DOM element
message.classList.add('cookie-message');
// message.textContent = "We use cokkies for improvements";
message.innerHTML =
  'We use cokkies for improvements.<button class = "btn btn--close-cookie">Got It!</button>';

// header.prepend(message);
// --> DOM element is unique and it only exist at one place
// --> Not only insert but also to move them
header.append(message);
// header.before(message);
// header.after(message);

// --> To Add Same element at multiple places in the DOM
// header.prepend(message.cloneNode(true));

// Delete Elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // --> new Way of doing it:
    message.remove();

    // --> old way:
    // message.parentElement.removeChild(message); //DOM Traversing
  });

// ----------------------------------------- Styles ---------------------------------------------------
// Old Way
message.style.backgroundColor = '#555';
message.style.width = '150%';

// console.log(message.style.color); // we can't access the properties which are defined in the style sheet in this manner
// console.log(message.style.backgroundColor); // but we can access the proprties which were defined in the JS like this

// --> Accessing the Inline properties of style sheet:
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// --> Now to change the properties which were written in the styles sheet
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// Changing the Custom Properties
// document.documentElement.style.setProperty(
// '--color-primary',
// 'rgb(226,169,50)'
// );

// -------------------------- Attributes ----------------------------------------------------

const logo = document.querySelector('.nav__logo');
// Js adds the standard properties for the object created by it
console.log(logo.alt);
console.log(logo.className);
// Non - standard
console.log(logo.designer); // but do not add the properties which were not supposed to be in the img element
// But still there is way of selecting Non Standard properties from the DOM
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Packaging');
// console.log(logo.getAttribute('company'));

console.log(logo.src); // Provides the Absolute URL
console.log(logo.getAttribute('src')); // gives the relative URL

// ----> changing the contents with simple access
// logo.alt = 'Sexy LAdy';

// ---- Playing with link Attributes ----
const link = document.querySelector('.btn--show-modal');
console.log(link.href); // Absolute URL
console.log(link.getAttribute('href')); // Relative URL

// --------------- Data Attributes -------------------

console.log(logo.dataset.versionNumber);
// ---> Special Type of attributes :
// 1. That start with keyword 'data'
// ---> Stored in the DataSet Object
// 2. Used when we want to store data in User Interface basically in the HTML code



// --- Classes -----------------------
logo.classList.add('c');  // fake ones
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); // Not includes

// Don't use  --> becoz it will overwrite at all place where this class was used --> so it is avoided
logo.className = 'vishu';

*/
/* --------------------------------- Types of Events and Event Handlers ------------------------*/
// > Event --> it is bascically a signal that is generated by a certain DOM node
// MouseEnter Event: just like hover in CSS
// Advantages of addEventListner() function:
// --> 1.we simply add multiple events listner to the same event
// --> 2.removing an event handler when we don't need it
// --> Now when we need to remove an event handler we will need to export the event function and give it a name and then we can easily remove that event handler
// ----> To Remove the Event Handler:

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('Now we entered into the h1 element of the web page');
// --> 1st Method of removing event Handler
// h1.removeEventListener('mouseenter', alertH1);
// };
// This is the modern way to listen to events
// h1.addEventListener('mouseenter', alertH1);

// --> 2nd method of removing:
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);
// -----------
// --> 3rd Method : simply going and specifying the event inside the element tag only And this should be avoided
// -------------

// Old school way:
// h1.onmouseenter = function (e) {
//   alert('Now we entered into the h1 element of the web page');
// };

// -------------------------------------------- End of Types of Events and Event Handlers ---------------------------------------------------

// --------------------------------------  Event Propagation: -------------------------------------------------
// Event Handlers Properties : Capturing Phase and Bubbling Phase
// --> These allows us to implement very important patterns in the code
// --> Also known as event propagation
// --> Not all events have these capturing and bubbling phase

// Capturing:  When event travels from the DOM root to the target element  through each of it parent element
// --> THis phase is irrrelevant
// Bubbling: When the event occurs at the target and travels back to the root through its  parent elements
// --> This phase is very important for us
// --> defalut behaviour of addEventListener() is that is listenes to the event in the bubbling phase only
// However we can change this behaviour
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // console.log(randomColor());

// // --> event Handlers are not picking up these events during the capture phase
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // console.log(this.style.backgroundColor);
//   console.log('link', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // To Stop Propagation --> generally avoided
//   // e.stopPropagation();
// });

// // ---> These Event handlers actually listenes to the event in the bubbling phase by default
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('parent2', e.target, e.currentTarget);
// });

// // document.querySelector('.nav').addEventListener('click', function (e) {
// //   this.style.backgroundColor = randomColor();
// //   console.log('parent3', e.target, e.currentTarget);
// // });

// // ---> But we change the behaviour of this listening of event i.e in capturing phase
// // --->By setting a Third parameter to true
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('parent3', e.target, e.currentTarget);
//   },
//   true
// );
// --------------------------------------  End of Event Propagation: -------------------------------------------------

// // A Simple experiment
// const html123 = document.querySelector('.nav__links').children;
// console.log(html123[0].textContent);
// console.log(html123[1].textContent);
// console.log(html123[2].textContent);
// console.log(html123[3].textContent);

// -->---------------------------- DOM Traversing ----------------------------------------------------------------
// const h1 = document.querySelector('h1');
// --> Going Downwards:
// console.log(h1.querySelectorAll('.highlight')); // going deep inside the DOM subtree to find the elements with the class 'highlights'
// console.log(h1.childNodes); // give the immediate chidlren
// console.log(h1.children); // gives only the elements and works for direct Children

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orange';

// --> Going Upwards: parents
// console.log(h1.parentNode); // direct parents
// console.log(h1.parentElement);

// // --> To find parent Element which is no matter how far it is in the DOM tree
// // --> closest() method gives the parent which has the ceratain class in it
// // --> closest() is the opposite of the querySelector()
// // It is used to find the parent
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways : siblings (we can only access immediate siblings)
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// --> To get All of the siblings
// --> to play with siblings
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.5)';
//   }
// });

// ---------------------------- End of DOM Traversing ----------------------------------------------------------------

// ----------------------- LifeCycle DOM events----------------------------------

//--> in Vanilla javaScript: we wrap all our code in the event Listener function with the event of "DOMContentLoaded"

// --> But in normal JS it is not necessary
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page Loaded Successfully', e);
});

// --> THIS should not be abused.... USE CAREFULLY
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

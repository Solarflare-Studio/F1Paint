const loadingContent = document.querySelector("#loadingContent");
const welcomeContent = document.querySelector("#welcomeContent");
const pattenContent = document.querySelector("#pattenContent");

const tutorial = document.querySelector("#tutorial");
const pattenTutorial = document.querySelector("#pattenTutorial");
const paintTutorial = document.querySelector("#paintTutorial");
const tagTutorial = document.querySelector("#tagTutorial");
const sponsorTutorial = document.querySelector("#sponsorTutorial");
const menu = document.querySelector("#menu");
const progress = document.querySelector("#file");
const dropdownArrow = document.querySelector("#dropdownArrow");
const dropdownElm = document.querySelector("#languageSelect");
const zoomIn = document.querySelector("#zoomIn");
const zoomOut = document.querySelector("#zoomOut");
const tabContent = document.querySelector("#tabContent");
const f1PaintTab = document.querySelectorAll(".tab button");
const tabContentWrp = document.querySelectorAll(".tab-content-wrp");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let selectedLanguage = document.querySelector("#selectedLanguage");
let loadingProgress = 0;
selectedLanguage.innerHTML = "Language 1";

move();
function move() {
  if (loadingProgress == 0) {
    loadingProgress = 1;
    const id = setInterval(frame, 10);
    function frame() {
      if (loadingProgress >= 100) {
        clearInterval(id);
        loadingProgress = 0;
      } else {
        loadingProgress++;
        progress.value = loadingProgress;
        welcome();
      }
    }
  }
}

// Redirect to welcome layout
function welcome() {
  if (loadingProgress === 100) {
    menu.classList.remove("hidden");
    welcomeContent.classList.remove("hidden");
    loadingContent.classList.add("hidden");
  }
}

// Language Select Handler
function handleLanguageSelect() {
  dropdownArrow.classList.toggle("rotate-180");
}
function handleLanguageChange(e) {
  selectedLanguage.innerHTML = e;
}
window.addEventListener("click", (event) => {
  if (event.target.closest("#languageSelect") !== dropdownElm) {
    dropdownArrow.classList.remove("rotate-180");
  }
});

// Redirect to patten layout
function handleWelcomeNext() {
  pattenContent.classList.remove("hidden");
  welcomeContent.classList.add("hidden");
  tutorial.classList.remove("hidden");
}

// Redirect to tutorial layout
function handleTutorial() {
  pattenTutorial.classList.remove("hidden");
  tutorial.classList.add("hidden");
}

// Redirect to patten layout
function handleCloseTutorial() {
  pattenTutorial.classList.add("hidden");
  paintTutorial.classList.add("hidden");
  tagTutorial.classList.add("hidden");
  sponsorTutorial.classList.add("hidden");
}

// Tab content toggle Handler
function handleTabToggle() {
  zoomIn.classList.toggle("hidden");
  zoomOut.classList.toggle("hidden");
  tabContent.classList.toggle("hidden");
}

// Paint Tutorial Handler
function handlePaintTutorial() {
  paintTutorial.classList.remove("hidden");
}

// Tag Tutorial Handler
function handleTagTutorial() {
  tagTutorial.classList.remove("hidden");
}

// Sponsor Tutorial Handler
function handleSponsorTutorial() {
  sponsorTutorial.classList.remove("hidden");
}

// Add click event listener to each box
f1PaintTab.forEach((box) => {
  box.addEventListener("click", (event) => {
    const currTarget = event.target;
    // Get the previous element
    const parentElm = currTarget.closest("li");
    // Get the previous and next elements
    const previousElement = parentElm.previousElementSibling;
    const nextElement = parentElm.nextElementSibling;

    // Remove the active class from all boxes
    f1PaintTab.forEach((box) => {
      const parentElm = box.closest("li");
      parentElm.classList.remove("activeTab");
      // parentElm.classList.remove("prevTab");
    });

    // Add the active class to the clicked element
    parentElm.classList.add("activeTab");

    // Add a class to the previous element
    if (previousElement) {
      previousElement.classList.add("prevTab");
    }

    // enabling back button
    if (parentElm.id === "patten-li") {
      prevBtn.setAttribute("disabled", true);
      prevBtn.classList.add("opacity-50");
    } else {
      prevBtn.removeAttribute("disabled");
      prevBtn.classList.remove("opacity-50");
    }

    // adding class to prevTag
    let breakNow = true;
    f1PaintTab.forEach((ele) => {
      const parentElmOfLi = ele.closest("li");
      if (parentElmOfLi.id !== parentElm.id && breakNow) {
        parentElmOfLi.classList.add("prevTab");
      } else {
        breakNow = false;
        parentElmOfLi.classList.remove("prevTab");
      }
    });
  });
});

// Next Button Handler
nextBtn.addEventListener("click", () => {
  prevBtn.classList.remove("opacity-50");
  prevBtn.removeAttribute("disabled");
  const activeTab = document.querySelector(".activeTab");
  const nextElement = activeTab.nextElementSibling;
  if (!nextElement) return;

  const currTabId = nextElement.childNodes[1].id;
  if (nextElement) {
    tabContentWrp.forEach((elm) => {
      const currElmId = `${elm.id}-tab`;
      if (currElmId === currTabId) {
        elm.classList.remove("hidden");
      } else {
        elm.classList.add("hidden");
      }
    });
    activeTab.classList.remove("activeTab");
    nextElement.classList.add("activeTab");
  }

  const newActiveTab = document.querySelector(".activeTab");
  // const newNextElement = newActiveTab.nextElementSibling;
  // if (!newNextElement) {
  //   nextBtn.classList.add("opacity-50");
  //   nextBtn
  // }

  // adding class to prevTag
  let breakNow = true;
  f1PaintTab.forEach((ele) => {
    const parentElmOfLi = ele.closest("li");
    if (parentElmOfLi.id !== newActiveTab.id && breakNow) {
      parentElmOfLi.classList.add("prevTab");
    } else {
      breakNow = false;
      parentElmOfLi.classList.remove("prevTab");
    }
  });
});

// Previous Button Handler
prevBtn.addEventListener("click", () => {
  nextBtn.classList.remove("opacity-50");
  let activeTab = document.querySelector(".activeTab");
  const previousElement = activeTab.previousElementSibling;

  const currTabId = previousElement.childNodes[1].id;
  if (previousElement) {
    tabContentWrp.forEach((elm) => {
      const currElmId = `${elm.id}-tab`;
      if (currElmId === currTabId) {
        elm.classList.remove("hidden");
      } else {
        elm.classList.add("hidden");
      }
    });
    activeTab.classList.remove("activeTab");
    previousElement.classList.add("activeTab");
  }
  let newActiveTab = document.querySelector(".activeTab");

  const newPreviousElement = newActiveTab.previousElementSibling;
  if (!newPreviousElement) {
    prevBtn.classList.add("opacity-50");
    prevBtn.setAttribute("disabled", true);
  }

  // adding class to prevTag
  let breakNow = true;
  f1PaintTab.forEach((ele) => {
    const parentElmOfLi = ele.closest("li");
    if (parentElmOfLi.id !== newActiveTab.id && breakNow) {
      parentElmOfLi.classList.add("prevTab");
    } else {
      breakNow = false;
      parentElmOfLi.classList.remove("prevTab");
    }
  });
});

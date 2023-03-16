const loadingContent = document.querySelector("#loadingContent");
const welcomeContent = document.querySelector("#welcomeContent");
const menu = document.querySelector("#menu");
const progress = document.querySelector("#file");
const dropdownArrow = document.querySelector("#dropdownArrow");
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
        weclome();
      }
    }
  }
}

function weclome() {
  if (loadingProgress === 100) {
    menu.classList.remove("hidden");
    welcomeContent.classList.remove("hidden");
    loadingContent.classList.add("hidden");
  }
}

function handlelanguageSelect() {
  dropdownArrow.classList.toggle("rotate-180");
}
function handlelanguageChange(e) {
  selectedLanguage.innerHTML = e;
}

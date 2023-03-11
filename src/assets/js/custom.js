const loadingContent = document.querySelector("#loadingContent");
const welcomeContent = document.querySelector("#welcomeContent");
const pattenContent = document.querySelector("#pattenContent");

const tutorial = document.querySelector("#tutorial");
const pattenTutorial = document.querySelector("#pattenTutorial");
const menu = document.querySelector("#menu");
const progress = document.querySelector("#file");
const dropdownArrow = document.querySelector("#dropdownArrow");
const dropdownElm = document.querySelector('#languageSelect');
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

function handleWelcomeNext(){
  pattenContent.classList.remove("hidden");
  welcomeContent.classList.add("hidden");
  tutorial.classList.remove("hidden")
}

function handleTutorial(){
  pattenTutorial.classList.remove('hidden')
  tutorial.classList.add("hidden")
}

function handlePattenTutorial(){
  pattenTutorial.classList.add('hidden')
}

window.addEventListener('click', (event) => {
  if (event.target.closest('#languageSelect') !== dropdownElm ) {
    dropdownArrow.classList.remove("rotate-180");
  }
});
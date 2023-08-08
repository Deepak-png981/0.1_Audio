const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  // moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
//Music ki image yaha show ker rhe hai
musicImg.src = `images/${allMusic[1].src}.jpg`;
musicArtist.innerText = "Unknwon";
//checking eq
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let sourceNode, bassNode, midNode, trebleNode;
let audio = document.getElementById('main-audio');

sourceNode = audioContext.createMediaElementSource(audio);

bassNode = audioContext.createBiquadFilter();
bassNode.type = "lowshelf";
bassNode.frequency.value = 500;

midNode = audioContext.createBiquadFilter();
midNode.type = "peaking";
midNode.Q.value = Math.SQRT1_2;
midNode.frequency.value = 1000;

trebleNode = audioContext.createBiquadFilter();
trebleNode.type = "highshelf";
trebleNode.frequency.value = 1500;

sourceNode.connect(bassNode);
bassNode.connect(midNode);
midNode.connect(trebleNode);
trebleNode.connect(audioContext.destination);

// Event listeners for sliders
document.getElementById('bass').addEventListener('input', (event) => {
  bassNode.gain.value = event.target.value;
});

document.getElementById('mid').addEventListener('input', (event) => {
  midNode.gain.value = event.target.value;
});

document.getElementById('treble').addEventListener('input', (event) => {
  trebleNode.gain.value = event.target.value;
});
//chekcing
let eqValues = { bass: 0, mid: 0, treble: 0 };
let filters;
let source;
let context = new AudioContext();
// let source = context.createMediaElementSource(document.querySelector('#audio-element'));
let bassEq = context.createBiquadFilter();
let midEq = context.createBiquadFilter();
let trebleEq = context.createBiquadFilter();
window.addEventListener("DOMContentLoaded", function () {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  filters = createFilters(audioCtx);
});


window.addEventListener("load", () => {
  // loadMusic(musicIndex);
  playingSong();
});

function createFilters(context) {
  let lowshelf = context.createBiquadFilter();
  lowshelf.type = "lowshelf";
  lowshelf.frequency.value = 500;

  let peaking = context.createBiquadFilter();
  peaking.type = "peaking";
  peaking.frequency.value = 1000;
  peaking.Q.value = Math.SQRT1_2;
  peaking.gain.value = 0;

  let highshelf = context.createBiquadFilter();
  highshelf.type = "highshelf";
  highshelf.frequency.value = 3000;

  lowshelf.connect(peaking);
  peaking.connect(highshelf);

  return [lowshelf, peaking, highshelf];
}
// function loadMusic(indexNumb) {
//   // musicName.innerText = "allMusic[indexNumb - 1].name";
//   musicArtist.innerText = allMusic[indexNumb - 1].artist;
//   musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
//   // mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
// }

// File upload kerke testing kerne ke liye Testing -- DEEPAK
const fileUploader = document.querySelector("#fileUploader");
// const uploadBtn = document.querySelector("#upload");

// uploadBtn.addEventListener("click", (event) => {
//   // event.stopPropagation();

//   fileUploader.click();
// });
// testing for background color change -DEEPAK
var switchLight = false;
// var htag = document.getElementsByTagName("h1")[0];
var bodyTag = document.getElementsByTagName("body")[0];
var circle = document.getElementById("circle");
var toogle = document.getElementById("toggle");
const root_theme = document.querySelector(':root');
document.getElementById("toggle").onclick = function () {
  if (!switchLight) {
    // htag.style.color = "white";
    root_theme.style.setProperty('--pink', '#39d50ea4');
    root_theme.style.setProperty('--violet', '#d5b73f');
    bodyTag.style.backgroundColor = "black";
    circle.style.marginLeft = "100px";
    switchLight = true;
  }
  else {
    // htag.style.color = "black";
    root_theme.style.setProperty('--violet', '#d5b73f');
    root_theme.style.setProperty('--pink', 'black');
    bodyTag.style.backgroundColor = "white";
    circle.style.marginLeft = "0px";
    switchLight = false;
  }
}

//Testing end for background color change -DEEPAK

// testing for the equilizer code
function changeEQ(type, value) {
  eqValues[type] = parseInt(value);
  filters = updateFilters(eqValues, audioCtx, source);
}

function updateFilters(eqValues, context, source) {
  if (source) {
    source.disconnect();
  }

  const frequencies = [60, 170, 350, 1000, 3500, 10000];
  let filters = frequencies.map((freq, i) => {
    let eq = context.createBiquadFilter();
    eq.frequency.value = freq;
    eq.type = 'peaking';
    eq.gain.value = i === 0 ? eqValues.bass : (i === 2 ? eqValues.treble : eqValues.mid);
    return eq;
  });

  filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  });

  source.connect(filters[0]);
  filters[filters.length - 1].connect(context.destination);
  return filters;
}
// Your function for connecting audio context and playing music would go here...


// testing for the equilizer code end here
fileUploader.addEventListener("change", function (e) {
  e.stopPropagation();
  let file = e.target.files[0];
  // if (audioCtx) {
  //   audioCtx.close();
  // }
  // audioCtx = new AudioContext();
  // source = audioCtx.createBufferSource();
  // filters = createFilters(audioCtx);

  let reader = new FileReader();
  reader.onloadend = function (e) {
    // audioCtx.decodeAudioData(result, function (buffer) {
    //   source.buffer = buffer;
    //   source.connect(filters[0]);
    //   filters[2].connect(audioCtx.destination);
    //   source.start(0);
    // });
    let result = e.target.result;
    mainAudio.src = result;
    // playMusic();
  }
  reader.readAsDataURL(file);
  // reader.readAsArrayBuffer(file);
});
function createFilters(context) {
  const frequencies = [60, 170, 350, 1000, 3500, 10000];
  let filters = frequencies.map((freq, i) => {
    let eq = context.createBiquadFilter();
    eq.frequency.value = freq;
    eq.type = 'peaking';
    eq.gain.value = i === 0 ? eqValues.bass : (i === 2 ? eqValues.treble : eqValues.mid);
    return eq;
  });

  filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  });

  return filters;
}
// TESTING END

//play music function
function playMusic() {
  // // changes
  // if (source) {
  //   source.stop();
  // }
  // source = audioCtx.createMediaElementSource(mainAudio);
  // source.connect(filters[0]);
  // filters[2].connect(audioCtx.destination);
  // // mainAudio.play();
  // // changes end
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic() {
  // source.disconnect();
  // mainAudio.pause();
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music function
function prevMusic() {
  musicIndex--; //decrement of musicIndex by 1
  //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

//next music function
function nextMusic() {
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//prev music button event
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//next music button event
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting playing song currentTime
  const duration = e.target.duration; //getting playing song total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) { //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //calling playMusic function
  playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", () => {
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//show music list onclick of music icon
// moreMusicBtn.addEventListener("click", () => {
//   musicList.classList.toggle("show");
// });
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

//play particular song from the list onclick of li tag
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the musicIndex then add playing class in it
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
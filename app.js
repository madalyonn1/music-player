const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const volumeBtn = document.getElementById("volume-btn");
const volumeControl = document.getElementById("volume-control");
const loopBtn = document.getElementById("loop-btn");

// Music
const songs = [
  {
    name: "baris-manco",
    displayName: "Ahmet Beyin Ceketi",
    artist: "Barış Manço",
  },
  {
    name: "bende-yoluma-giderim",
    displayName: "Ben de yoluma giderim",
    artist: "Sezen Aksu",
  },
  {
    name: "bos-yere",
    displayName: "Boş Yere",
    artist: "Sıla",
  },
  {
    name: "fazil-say",
    displayName: "İnsan İnsan",
    artist: "Fazıl Say",
  },
  {
    name: "hayko",
    displayName: "Ölüyorum",
    artist: "Hayko Cepkin",
  },
  {
    name: "mfö",
    displayName: "Aşkın Kenarında",
    artist: "MFÖ",
  },
  {
    name: "neset-ertas",
    displayName: "Ah Yalan Dünya",
    artist: "Neşet Ertaş",
  },
  {
    name: "sebahat-abla",
    displayName: "Sebahat Abla",
    artist: "Müslüm Gürses&Sezen Aksu",
  },
  {
    name: "sebnem-ferah",
    displayName: "Ünzile",
    artist: "Şebnem Ferah",
  },
  {
    name: "sertap-erener",
    displayName: "Olsun",
    artist: "Sertap Erener",
  },
];

// Current Song
let songIndex = 0;
// Check if Playing
let isPlaying = false;
// Check if repating
let isRepeat = false;
let volumeControlLastValue;
// Music Volume on DOM Load First Time
music.volume = 0.5;
// Local Variables
let localVolume = localStorage.getItem("volume");
let localSongIndex = localStorage.getItem("songIndex");
let localCurrentTime = localStorage.getItem("currentTime");

if (localVolume) {
  music.volume = localVolume;
  volumeControl.value = localVolume;
  volumeIcon();
}

if (localSongIndex) {
  songIndex = localSongIndex;
}

if (localCurrentTime) {
  music.currentTime = localCurrentTime;
}

// Play
function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  image.classList.add("music-paused", "music-running");
  music.play();
}

// Pause
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  image.classList.replace("music-running", "music-paused");
  music.pause();
}

// Update DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `assets/${song.name}.jpg`;
}

// Previous Song
function prevSong() {
  songIndex--;
  localStorage.setItem("songIndex", songIndex);
  if (songIndex < 0) {
    songIndex = songs.length - 1;
    localStorage.setItem("songIndex", songIndex);
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Next Song
function nextSong() {
  songIndex++;
  localStorage.setItem("songIndex", songIndex);
  if (songIndex > songs.length - 1) {
    songIndex = 0;
    localStorage.setItem("songIndex", songIndex);
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Check Volume Icon
function volumeIcon() {
  if (music.volume === 0) {
    volumeBtn.classList.remove("fa-volume-up");
    volumeBtn.classList.remove("fa-volume-down");
    volumeBtn.classList.add("fa-volume-mute");
  } else if (music.volume > 0.5) {
    volumeBtn.classList.remove("fa-volume-mute");
    volumeBtn.classList.remove("fa-volume-down");
    volumeBtn.classList.add("fa-volume-up");
  } else {
    volumeBtn.classList.remove("fa-volume-mute");
    volumeBtn.classList.remove("fa-volume-up");
    volumeBtn.classList.add("fa-volume-down");
  }
}

// Set Volume
function setVolume(value) {
  music.volume = value;
  localStorage.setItem("volume", music.volume);
  volumeIcon();
}

// Toggle Volume On Off
function toggleVolume() {
  if (music.volume !== 0) {
    volumeControlLastValue = volumeControl.value;
    volumeControl.value = 0;
    setVolume(volumeControl.value);
  } else {
    volumeControl.value = volumeControlLastValue;
    setVolume(volumeControl.value);
  }
}

// Toogle Loop Btn
function toggleLoopBtn() {
  isRepeat = !isRepeat;
  isRepeat
    ? loopBtn.classList.add("active")
    : loopBtn.classList.remove("active");
}

// Looping song
function loopSong() {
  let currentSongIndex = songIndex;
  loadSong(songs[currentSongIndex]);
  playSong();
}

// On Load - Select First Song
loadSong(songs[songIndex]);

const updateProgressBarWidth = (duration, currentTime) => {
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
};

const calculateDisplayForDuration = (duration) => {
  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration % 60);
  if (durationSeconds < 10) {
    durationSeconds = `0${durationSeconds}`;
  }
  // Delay Switching duration Element to avoid NaN
  if (durationSeconds) {
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }
};

const calculateDisplayForCurrent = (currentTime) => {
  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
};

// Update Progress Bar & Time
function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    localStorage.setItem("currentTime", music.currentTime);
    updateProgressBarWidth(duration, currentTime);
    calculateDisplayForDuration(duration);
    calculateDisplayForCurrent(currentTime);
  }
}

// Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
  localStorage.setItem("currentTime", music.currentTime);
  updateProgressBarWidth(duration, music.currentTime);
  calculateDisplayForCurrent(music.currentTime);
}

// Event Listeners
window.addEventListener("load", () => {
  const { duration, currentTime } = music;
  calculateDisplayForDuration(duration);
  calculateDisplayForCurrent(currentTime);
  updateProgressBarWidth(duration, currentTime);
});
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
music.addEventListener("ended", () => {
  isRepeat ? loopSong() : nextSong();
});
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);
volumeBtn.addEventListener("click", toggleVolume);
loopBtn.addEventListener("click", toggleLoopBtn);

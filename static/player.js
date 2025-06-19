document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audioPlayer");
  const playerBar = document.getElementById("playerBar");
  const nowPlaying = document.getElementById("nowPlaying");

  const songCards = Array.from(document.querySelectorAll(".songCard"));
  let currentIndex = -1;

  // Get elements
  const shuffleBtn = document.getElementById("shuffleToggle");
  const repeatBtn = document.getElementById("repeatToggle");

  // Load saved settings
  let repeatMode = localStorage.getItem("repeatMode") || "off";
  let isShuffle = localStorage.getItem("isShuffle") === "true";

  // Restore Shuffle
  const shuffleIcon = document.getElementById("shuffleIcon");
  shuffleIcon.textContent = "shuffle";
  shuffleIcon.style.opacity = isShuffle ? "1" : "0.3";
  shuffleBtn.title = `Shuffle ${isShuffle ? "On" : "Off"}`;

  // Restore Repeat
  const repeatIcon = document.getElementById("repeatIcon");

  if (repeatMode === "list") {
    repeatIcon.textContent = "repeat";
    repeatBtn.title = "Repeat List";
    repeatIcon.style.opacity = "1";
  } else if (repeatMode === "one") {
    repeatIcon.textContent = "repeat_one";
    repeatBtn.title = "Repeat One";
    repeatIcon.style.opacity = "1";
  } else {
    repeatIcon.textContent = "repeat";
    repeatBtn.title = "Repeat Off";
    repeatIcon.style.opacity = "0.3";
  }
  
  // Shuffle button toggle
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    const icon = document.getElementById("shuffleIcon");
    icon.textContent = isShuffle ? "shuffle" : "shuffle"; // same icon
    shuffleBtn.title = `Shuffle ${isShuffle ? "On" : "Off"}`;
    icon.style.opacity = isShuffle ? "1" : "0.3";
    localStorage.setItem("isShuffle", isShuffle);
  });

  // Repeat button toggle (off → list → one → off)
  repeatBtn.addEventListener("click", () => {
    const icon = document.getElementById("repeatIcon");
    if (repeatMode === "off") {
      repeatMode = "list";
      icon.textContent = "repeat";
      repeatBtn.title = "Repeat List";
    } else if (repeatMode === "list") {
      repeatMode = "one";
      icon.textContent = "repeat_one";
      repeatBtn.title = "Repeat One";
    } else {
      repeatMode = "off";
      icon.textContent = "repeat";
      repeatBtn.title = "Repeat Off";
    }
    icon.style.opacity = repeatMode === "off" ? "0.3" : "1";
    localStorage.setItem("repeatMode", repeatMode);
  });

  // Resume last song function
  const savedIndex = parseInt(localStorage.getItem("lastPlayedIndex"), 10);

  if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < songCards.length) {
    const card = songCards[savedIndex];
    const title = card.dataset.title;
    audio.src = card.dataset.src;
    updateNowPlaying(card.dataset.title); // ✅ use clean title
    playerBar.style.display = "block";
    currentIndex = savedIndex;
  }

  // Diplay the Song's title
    function updateNowPlaying(name) {
    nowPlaying.textContent = `🎵 Now Playing: ${name}`;
  }

  function playSong(index) {
    if (index >= 0 && index < songCards.length) {
      const card = songCards[index];
      const title = card.dataset.title;
      audio.src = card.dataset.src;
      updateNowPlaying(title);
      playerBar.style.display = "block";
      audio.play();
      currentIndex = index;
      localStorage.setItem("lastPlayedIndex", index);
    }

    // Remove active class from all
    document.querySelectorAll(".songCard").forEach(card => card.classList.remove("active"));

    // Add active class to currently playing card
    const activeCard = document.querySelector(`.songCard[data-index="${index}"]`);
    if (activeCard) {
      activeCard.classList.add("active");
    }
  }

  // Hook up all song buttons
  songCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      playSong(index);
    });
  });

   // Prev/Next buttons
  document.getElementById("prevBtn").addEventListener("click", () => {
    const prev = (currentIndex - 1 + songCards.length) % songCards.length;
    playSong(prev);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (isShuffle) {
      playRandomSong();
    } else {
      const next = (currentIndex + 1) % songCards.length;
      playSong(next);
    }
  });

  // When song ends
  audio.addEventListener("ended", () => {
    if (isShuffle) {
      playRandomSong();
    } else if (repeatMode === "list") {
      const next = (currentIndex + 1) % songCards.length;
      playSong(next);
    } else if (repeatMode === "one") {
      playSong(currentIndex);
    }
  });

  function playRandomSong() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * songCards.length);
    } while (nextIndex === currentIndex && songCards.length > 1);
    playSong(nextIndex);
  }

  // Restore saved volume (0.0 to 1.0)
  const savedVolume = parseFloat(localStorage.getItem("volume"));
  if (!isNaN(savedVolume)) {
    audio.volume = savedVolume;
  }

  // Save volume whenever it changes
  audio.addEventListener("volumechange", () => {
    localStorage.setItem("volume", audio.volume);
  });

  // Restore playback position if available
  const savedTime = parseFloat(localStorage.getItem("lastPlaybackTime"));
  if (!isNaN(savedTime)) {
    audio.currentTime = savedTime;
  }

  // Update saved time every few seconds
  setInterval(() => {
    if (!audio.paused && !audio.ended) {
      localStorage.setItem("lastPlaybackTime", audio.currentTime);
    }
  }, 1000);

  localStorage.setItem("lastPlaybackTime", 0);
});

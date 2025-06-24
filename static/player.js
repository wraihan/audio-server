/*!
 * Copyright 2025 Pn Wan Raihan, (https://wraihan.com)
 * Licensed under MIT (https://wraihanws.mit-license.org/)
*/

document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // 1. Get Elements
  // ================================
  const audio = document.getElementById("audioPlayer");
  const songCards = Array.from(document.querySelectorAll(".songCard"));
  const playerBar = document.getElementById("playerBar");
  const nowPlaying = document.getElementById("nowPlaying");
  const playbackModeBtn = document.getElementById("playbackModeToggle");
  const playbackIcon = document.getElementById("playbackModeIcon");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // ================================
  // 2. Global State
  // ================================
  let currentIndex = -1;
  let playbackMode = localStorage.getItem("playbackMode") || "shuffle";

  // ================================
  // 3. Apply Saved Settings
  // ================================
  updatePlaybackIcon(playbackMode);

  // Restore saved volume (0.0 to 1.0)
  const savedVolume = parseFloat(localStorage.getItem("volume"));
  if (!isNaN(savedVolume)) {
    audio.volume = savedVolume;
  }

  // Restore playback position if available
  const savedTime = parseFloat(localStorage.getItem("lastPlaybackTime"));
  if (!isNaN(savedTime)) {
    audio.currentTime = savedTime;
  }

  // Resume last song function
  const savedIndex = parseInt(localStorage.getItem("lastPlayedIndex"), 10);
  if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < songCards.length) {
    const card = songCards[savedIndex];
    audio.src = card.dataset.src;
    updateNowPlaying(card.dataset.title); // ✅ use clean title
    playerBar.style.display = "block";
    currentIndex = savedIndex;
  }

  // ================================
  // 4. Helper Functions
  // ================================
  // Diplay the Song's title
  function updateNowPlaying(name) {
    nowPlaying.textContent = `🎵 ${name}`;
  }

  function playSong(index) {
    if (index >= 0 && index < songCards.length) {
      const card = songCards[index];
      audio.src = card.dataset.src;
      updateNowPlaying(card.dataset.title);
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

  function playRandomSong() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * songCards.length);
    } while (nextIndex === currentIndex && songCards.length > 1);
    playSong(nextIndex);
  }

  function updatePlaybackIcon(mode) {
    if (mode === "shuffle") {
      playbackIcon.textContent = "shuffle";
      playbackModeBtn.title = "Shuffle";
      playbackIcon.style.opacity = 1;
    } else if (mode === "repeatOne") {
      playbackIcon.textContent = "repeat_one";
      playbackModeBtn.title = "Repeat One";
      playbackIcon.style.opacity = 1;
    } else if (mode === "repeatList") {
      playbackIcon.textContent = "repeat";
      playbackModeBtn.title = "Repeat List";
      playbackIcon.style.opacity = 1;
    } else {
      playbackIcon.textContent = "repeat";
      playbackModeBtn.title = "Playback Off";
      playbackIcon.style.opacity = 0.3;
    }
  }

  // ================================
  // 5. Event Listeners
  // ================================
  // Hook up all song buttons
  songCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      playSong(index);
    });
  });

  // Toggle through 4 playing modes 
  playbackModeBtn.addEventListener("click", () => {
    if (playbackMode === "shuffle") {
      playbackMode = "repeatOne";
    } else if (playbackMode === "repeatOne") {
      playbackMode ="repeatList";
    } else if (playbackMode === "repeatList") {
      playbackMode = "off";
    } else {
      playbackMode = "shuffle";
    }

    updatePlaybackIcon(playbackMode);
    localStorage.setItem("playbackMode", playbackMode);
  });

  // Prev & Next buttons
  prevBtn.addEventListener("click", () => {
    const prev = (currentIndex - 1 + songCards.length) % songCards.length;
    playSong(prev);
  });

  nextBtn.addEventListener("click", () => {
    if (playbackMode === "shuffle") {
      playRandomSong();
    } else {
      const next = (currentIndex + 1) % songCards.length;
      playSong(next);
    }
  });

  // When song ends
  audio.addEventListener("ended", () => {
    if (playbackMode === "shuffle") {
      playRandomSong();
    } else if (playbackMode === "repeatList") {
      const next = (currentIndex + 1) % songCards.length;
      playSong(next);
    } else if (playbackMode === "repeatOne") {
      playSong(currentIndex);
    }
  });

  // Save volume whenever it changes
  audio.addEventListener("volumechange", () => {
    localStorage.setItem("volume", audio.volume);
  });

  // Update saved time every few seconds
  setInterval(() => {
    if (!audio.paused && !audio.ended) {
      localStorage.setItem("lastPlaybackTime", audio.currentTime);
    }
  }, 1000);

  localStorage.setItem("lastPlaybackTime", 0);
});


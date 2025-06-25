/*!
 * Copyright 2025 Pn Wan Raihan, (https://wraihan.com)
 * Licensed under MIT (https://wraihanws.mit-license.org/)
*/

document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // 1. Get Elements
  // ================================
  const audio = document.getElementById("audioPlayer");
  const playerBar = document.getElementById("playerBar");
  const nowPlaying = document.getElementById("nowPlaying");
  const songCards = Array.from(document.querySelectorAll(".songCard"));
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
  // Playback icon restoration.
  updatePlaybackIcon(playbackMode);

  // Volume restoration (prevents slider from resetting on refresh).
  const savedVolume = parseFloat(localStorage.getItem("volume"));
  if (!isNaN(savedVolume)) {
    setTimeout(() => {
      audio.volume = savedVolume;
    }, 100); // or 0 for next tick
  }

  // Restore last playback position (resume where left off).
  const savedTime = parseFloat(localStorage.getItem("lastPlaybackTime"));
  if (!isNaN(savedTime)) {
    audio.currentTime = savedTime;
  }

  // Restore the last played song (if any).
  const savedIndex = parseInt(localStorage.getItem("lastPlayedIndex"), 10);
  if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < songCards.length) {
    const card = songCards[savedIndex];
    audio.src = card.dataset.src;
    updateNowPlaying(card.dataset.title);
    playerBar.style.display = "block";
    currentIndex = savedIndex;
  }

  // ================================
  // 4. Helper Functions
  // ================================
  // Display the title of the current song.
  function updateNowPlaying(name) {
    nowPlaying.textContent = `🎵 ${name}`;
  }

  // Play a song by index (and set it as active).
  function playSong(index) {
    if (index >= 0 && index < songCards.length) {
      const card = songCards[index];
      audio.src = card.dataset.src;
      updateNowPlaying(card.dataset.title);
      playerBar.style.display = "block";
      audio.play();
      currentIndex = index;
      // Save the index to localStorage.
      localStorage.setItem("lastPlayedIndex", index);
    }
  
    // Highlight the active card.
    document.querySelectorAll(".songCard").forEach(card => card.classList.remove("active"));
    const activeCard = document.querySelector(`.songCard[data-index="${index}"]`);
    if (activeCard) {
      activeCard.classList.add("active");
    }
  }

  // Play a new random song using Math.random().
  function playRandomSong() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * songCards.length);
    } while (nextIndex === currentIndex && songCards.length > 1);

    playSong(nextIndex);
  }

  // Update the icon, tooltip, and opacity based on mode.
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

  // Tooltip for changes made by keys' press
  function showFeedback(message) {
    const overlay = document.getElementById("feedbackOverlay");
    overlay.textContent = message;
    overlay.style.display = "block";
    overlay.style.opacity = 1;

    setTimeout(() => {
      overlay.style.opacity = 0;
      setTimeout(() => {
	overlay.style.display = "none";
      }, 300);
    }, 1000);
  }

  // ================================
  // 5. Event Listeners
  // ================================
  // Song card acts as a clickable button.
  songCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      playSong(index);
    });
  });

  // Handle playback mode change (cycle through 4 modes).
  playbackModeBtn.addEventListener("click", () => {
    if (playbackMode === "shuffle") {
      playbackMode = "repeatOne";
    } else if (playbackMode === "repeatOne") {
      playbackMode = "repeatList";
    } else if (playbackMode === "repeatList") {
      playbackMode = "off";
    } else {
      playbackMode = "shuffle";
    }

    // Save the new mode.
    updatePlaybackIcon(playbackMode);
    localStorage.setItem("playbackMode", playbackMode);
  });

  // Previous button: behavior changes depending on mode. 
  prevBtn.addEventListener("click", () => {
    if (playbackMode === "shuffle") {
      playRandomSong();
    } else {
      const prev = (currentIndex - 1 + songCards.length) % songCards.length;
      playSong(prev);
    }
  });

  // Next button: shuffle or ordered playback. 
  nextBtn.addEventListener("click", () => {
    if (playbackMode === "shuffle") {
      playRandomSong();
    } else {
      const next = (currentIndex + 1) % songCards.length;
      playSong(next);
    }
  });

  // Audio behavior after song ends, based on mode.
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

  // Save volume when it changes.
  audio.addEventListener("volumechange", () => {
    localStorage.setItem("volume", audio.volume);
  });

  document.addEventListener("keydown", (event) => {
    const tag = event.target.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable;
  
    if (isTyping) return;

    switch (event.code) {
      case "Space": // Spacebar function as play/pause toggle.
	event.preventDefault();
	if (audio.paused) {
	  audio.play();
	} else {
	  audio.pause();
	}
	break;
    
      case "ArrowRight":
	event.preventDefault();
	audio.currentTime += 5; // ⏩ Seek forward 5 seconds
	break;

      case "ArrowLeft":
	event.preventDefault();
	audio.currentTime = Math.max(0, audio.currentTime - 5); // ⏪ Seek back 5 seconds
	break;

      case "KeyM":
	event.preventDefault();
	audio.muted = !audio.muted;
	break;
    
      case "ArrowUp":
	event.preventDefault();
	audio.volume = Math.min(1, audio.volume + 0.05); // Increase volume
	localStorage.setItem("volume", audio.volume); // Save new volume
	showFeedback(`🔊 Volume: ${(audio.volume * 100).toFixed(0)}%`);
	break;

      case "ArrowDown":
	event.preventDefault();
	audio.volume = Math.max(0, audio.volume - 0.05); // Decrease volume
	localStorage.setItem("volume", audio.volume); // Save new volume
	showFeedback(`🔉 Volume: ${(audio.volume * 100).toFixed(0)}%`);
	break;

      case "KeyP":
	event.preventDefault();
	playbackModeBtn.click(); // Cycle playback modes
	showFeedback(`Mode: ${playbackModeBtn.title}`);
	break;

      case "KeyJ": // Previous song
	event.preventDefault();
	prevBtn.click();
	break;

      case "KeyL": // Next song
	event.preventDefault();
	nextBtn.click();
	break;
    }
  });

  // Save playback playback position every second. 
  setInterval(() => {
    if (!audio.paused && !audio.ended) {
      localStorage.setItem("lastPlaybackTime", audio.currentTime);
    }
  }, 1000);

  localStorage.setItem("lastPlaybackTime", 0);
});

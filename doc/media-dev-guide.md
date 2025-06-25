# 🎧 JavaScript Audio/Video Player Reference Sheet (MDN)

Built and tested with ❤️ using real browser APIs.

---

## 🧩 Core HTML Elements

- 🔊 [<audio> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)  
- 🎥 [<video> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

---

## 🧠 Media Playback APIs

- [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)  
  Includes:  
  `.play()`, `.pause()`, `.volume`, `.muted`, `.currentTime`, `.duration`, `.ended`, `.loop`, `.src`

- [Media Events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events)  
  Triggers like:  
  `play`, `pause`, `ended`, `volumechange`, `timeupdate`

---

## 🎛️ DOM + Interactivity

- [addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
- [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
- [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

---

## 📦 Storage & Data

- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JSON.stringify() & JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

---

## ⏲️ Timing & Scheduling

- [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

---

## 🎨 UI Styling & DOM Updates

- [HTMLElement.style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)
- [Element.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [querySelector() / querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

---

## 🔐 Browser Behavior & UX

- [Autoplay policy guide](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
- [MediaSession API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API) *(optional)*

---

## ✅ Keyboard Shortcuts (Suggested)

| Key       | Action              |
|-----------|---------------------|
| `Space`   | Play / Pause toggle |
| `←` / `→` | Seek ± 5 sec        |
| `↑` / `↓` | Volume ± 5%         |
| `M`       | Mute toggle         |
| `P`       | Cycle playback mode |
| `J / L`   | Prev / Next track   |

---

_Use this to build smarter, faster media players that users will love!_


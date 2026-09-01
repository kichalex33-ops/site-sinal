document.querySelectorAll("[data-media-player]").forEach((wrapper) => {
  const video = wrapper.querySelector("video");
  const playBtn = wrapper.querySelector("[data-mp-play]");
  const bar = wrapper.querySelector("[data-mp-bar]");
  const barFill = wrapper.querySelector("[data-mp-bar-fill]");
  const time = wrapper.querySelector("[data-mp-time]");
  const speedBtn = wrapper.querySelector("[data-mp-speed]");
  const fullscreenBtn = wrapper.querySelector("[data-mp-fullscreen]");
  if (!video) return;

  const speeds = [1, 1.5, 2, 0.5];
  let speedIndex = 0;

  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  playBtn?.addEventListener("click", () => {
    if (video.paused) { video.play(); playBtn.textContent = "Pausar"; }
    else { video.pause(); playBtn.textContent = "Reproduzir"; }
  });

  video.addEventListener("timeupdate", () => {
    if (barFill && video.duration) barFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
    if (time) time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  });

  bar?.addEventListener("click", (e) => {
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (video.duration) video.currentTime = ratio * video.duration;
  });

  speedBtn?.addEventListener("click", () => {
    speedIndex = (speedIndex + 1) % speeds.length;
    video.playbackRate = speeds[speedIndex];
    speedBtn.textContent = `${speeds[speedIndex]}x`;
  });

  fullscreenBtn?.addEventListener("click", () => {
    if (video.requestFullscreen) video.requestFullscreen();
  });
});

// Abas ORIGINAL/METADADOS/FONTE
document.querySelectorAll("[data-media-tabs]").forEach((tabs) => {
  const buttons = tabs.querySelectorAll("[data-tab]");
  const panels = tabs.querySelectorAll("[data-tab-panel]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      const target = btn.dataset.tab;
      panels.forEach((p) => { p.hidden = p.dataset.tabPanel !== target; });
    });
  });
});

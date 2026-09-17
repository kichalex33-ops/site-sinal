document.querySelectorAll(".source-pointer__trigger").forEach((trigger) => {
  const wrapper = trigger.closest(".source-pointer");
  if (!wrapper) return;
  trigger.setAttribute("tabindex", "0");
  trigger.setAttribute("role", "button");
  trigger.setAttribute("aria-expanded", "false");

  function toggle(open) {
    wrapper.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    toggle(!wrapper.classList.contains("is-open"));
  });
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(!wrapper.classList.contains("is-open"));
    }
    if (e.key === "Escape") toggle(false);
  });
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) toggle(false);
  });
});

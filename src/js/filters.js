document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const attr = group.dataset.filterGroup; // ex: "status" ou "tipo"
  const targetSelector = group.dataset.filterTarget;
  const items = document.querySelectorAll(targetSelector);
  const buttons = group.querySelectorAll("[data-filter-value]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      const value = btn.dataset.filterValue;
      items.forEach((item) => {
        const itemValue = item.dataset[attr];
        item.hidden = value !== "all" && itemValue !== value;
      });
    });
  });
});

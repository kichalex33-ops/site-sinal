// "Colocou um sinal?": monta, no aparelho, a mensagem de registro para enviar pelo Instagram.
// Nada e transmitido pelo site. Texto sempre inserido via .value (nunca innerHTML).
const form = document.querySelector("[data-signal-form]");
if (form) {
  const labels = JSON.parse(form.dataset.labels);
  const types = JSON.parse(form.dataset.types);
  const err = form.querySelector("[data-sf-error]");
  const out = form.querySelector("[data-sf-out]");
  const output = form.querySelector("[data-sf-output]");
  const status = form.querySelector("[data-sf-status]");
  // remove caracteres de controle, colapsa espacos e limita o tamanho
  const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[ \t]+/g, " ").trim().slice(0, max);
  const val = (n) => clean(form.elements[n]?.value, n === "message" ? 600 : 120);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    err.hidden = true;
    form.querySelectorAll("[aria-invalid]").forEach((i) => i.removeAttribute("aria-invalid"));
    const fail = (name, msg) => {
      const field = form.elements[name];
      field.setAttribute("aria-invalid", "true");
      err.textContent = msg;
      err.hidden = false;
      field.focus();
    };
    for (const n of ["name", "venue", "type", "city", "country"]) if (!val(n)) return fail(n, form.dataset.errRequired);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email"))) return fail("email", form.dataset.errEmail);
    if (!form.elements.consent.checked) return fail("consent", form.dataset.errConsent);

    const lines = [form.dataset.head, "",
      `${labels.name}: ${val("name")}`, `${labels.email}: ${val("email")}`,
      `${labels.venue}: ${val("venue")}`, `${labels.type}: ${types[val("type")] || val("type")}`,
      `${labels.city}: ${val("city")}`, `${labels.region}: ${val("region") || "-"}`, `${labels.country}: ${val("country")}`];
    if (val("message")) lines.push(`${labels.message}: ${val("message")}`);
    lines.push("", labels.consent, labels.photo);
    output.value = lines.join("\n");
    out.hidden = false;
    status.textContent = "";
    output.focus();
  });

  form.querySelector("[data-sf-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.value);
    } catch {
      output.select(); // fallback: a pessoa copia manualmente
      return;
    }
    status.textContent = form.dataset.copied;
  });
}

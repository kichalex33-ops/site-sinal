const form = document.querySelector("[data-contact-form]");

if (form) {
  const submitBtn = form.querySelector("[data-contact-submit]");
  const status = form.querySelector("[data-contact-status]");
  const WEB3FORMS_KEY = "4c4ea232-63aa-44ca-9f76-9a2533f9d63f";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.botcheck?.checked) return; // honeypot: bot preencheu campo escondido

    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_KEY);
    data.append("from_name", "SINAL/RUÍDO — formulário de contato");
    data.append("subject", `[SINAL/RUÍDO] ${data.get("assunto") || "Mensagem"}`);

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    status.textContent = "";
    status.removeAttribute("data-state");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        form.reset();
        status.textContent = "Mensagem enviada. Obrigado — se pedir resposta, respondemos pelo email informado.";
        status.setAttribute("data-state", "ok");
      } else {
        throw new Error(result.message || "Falha no envio");
      }
    } catch {
      status.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
      status.setAttribute("data-state", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

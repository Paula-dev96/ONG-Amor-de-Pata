document.addEventListener("DOMContentLoaded", function () {
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const form = document.getElementById("contatoForm");

  // ======== FUNÇÕES AUXILIARES ========
  const apenasNumeros = (str) => (str || "").replace(/\D/g, "");

  const formatarCPF = (v) =>
    (v || "")
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const formatarTelefone = (v) =>
    (v || "")
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2");

  // Máscara com bolinhas
  const mascararCPF = (cpfFormatado) => {
    if (!cpfFormatado) return "";
    return cpfFormatado.replace(/\d(?=\d{2})/g, "•");
  };

  // ======== EVENTOS CPF ========
  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let limpo = apenasNumeros(e.target.value).slice(0, 11);
      e.target.value = formatarCPF(limpo);
      e.target.dataset.real = limpo;
    });

    cpfInput.addEventListener("blur", (e) => {
      const real = e.target.dataset.real;
      if (real && real.length === 11) {
        e.target.value = mascararCPF(formatarCPF(real));
      }
    });

    cpfInput.addEventListener("focus", (e) => {
      const real = e.target.dataset.real;
      if (real) e.target.value = formatarCPF(real);
    });
  }

  // ======== EVENTOS TELEFONE ========
  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      let limpo = apenasNumeros(e.target.value).slice(0, 11);
      e.target.value = formatarTelefone(limpo);
      e.target.dataset.real = limpo;
    });

    telefoneInput.addEventListener("blur", (e) => {
      const real = e.target.dataset.real;
      if (real) {
        const formatado = formatarTelefone(real);
        const mascarado = formatado.replace(/\d(?=\d{3})/g, "•");
        e.target.value = mascarado;
      }
    });

    telefoneInput.addEventListener("focus", (e) => {
      const real = e.target.dataset.real;
      if (real) e.target.value = formatarTelefone(real);
    });
  }

  // ======== SUBMIT ========
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cpfReal = cpfInput?.dataset.real || "";
    const telReal = telefoneInput?.dataset.real || "";

    const payload = {
      nome: document.getElementById("nome")?.value || "",
      email: document.getElementById("email")?.value || "",
      cpf: cpfReal,
      telefone: telReal,
      data_nasc: document.getElementById("data_nasc")?.value || "",
      senha: document.getElementById("senha")?.value || "",
      endereco: document.getElementById("endereco")?.value || "",
      cep: document.getElementById("cep")?.value || "",
      cidade: document.getElementById("cidade")?.value || "",
      estado: document.getElementById("estado")?.value || "",
      assunto: document.getElementById("assunto")?.value || "",
      mensagem: document.getElementById("mensagem")?.value || "",
    };

    // ======== VALIDAÇÃO BÁSICA ========
    for (let campo in payload) {
      if (!payload[campo]) {
        alert(`⚠ O campo "${campo}" deve ser preenchido.`);
        return;
      }
    }

    console.log("Payload pronto para envio:", payload);

    // ======== MENSAGEM DE CONFIRMAÇÃO ========
    const msgExistente = document.getElementById("msgSucesso");
    if (msgExistente) msgExistente.remove();

    const msg = document.createElement("p");
    msg.id = "msgSucesso";
    msg.textContent = "✅ Dados enviados com sucesso (simulação).";
    msg.style.color = "green";
    msg.style.marginTop = "10px";
    form.appendChild(msg);

    // ======== SALVAR NO LOCALSTORAGE ========
    localStorage.setItem("formData", JSON.stringify(payload));

    // ======== LIMPAR CAMPOS ========
    delete cpfInput.dataset.real;
    delete telefoneInput.dataset.real;
    form.reset();
  });

  // ======== CARREGAR DADOS SALVOS (se existirem) ========
  const dadosSalvos = JSON.parse(localStorage.getItem("formData") || "{}");
  if (Object.keys(dadosSalvos).length > 0) {
    for (let campo in dadosSalvos) {
      const input = document.getElementById(campo);
      if (input) input.value = dadosSalvos[campo];
    }
  }
});

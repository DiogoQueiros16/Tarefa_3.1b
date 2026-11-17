/*
 * Animalec – protótipo da Tarefa 3.1 b)
 * Reproduz, sem Vue, o comportamento das views do Animalec (Login.vue, Admin.vue, ListAnimals.vue, ...),
 * com os mesmos textos e os mesmos alertas (vue-simple-alert = SweetAlert2 8).
 * O que é NOVO está marcado com «NOVO»: as views ListSponsors/AddSponsor/EditSponsor,
 * ListExperts/AddExpert/EditExpert e, na integração, o VER de cada animal.
 */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PAGINA = document.body.dataset.pagina;
  const SESSAO = "animalec-sessao", ALERTA = "animalec-alerta";

  /* ---------- vue-simple-alert: $alert, $confirm e $fire ---------- */
  const $alert = (message, title, type) => Swal.fire({ title, text: message, type });
  const $confirm = (message, title, type) => new Promise((resolve, reject) =>
    Swal.fire({ title, text: message, type, showCancelButton: true, confirmButtonText: "OK", cancelButtonText: "Cancelar" })
      .then(r => (r.value === true ? resolve(true) : reject())));
  const $fire = opcoes => Swal.fire(opcoes);
  // num SPA o alerta continua visível depois de mudar de rota; aqui guarda-se para a página seguinte
  const alertaDepois = (message, title, type) => sessionStorage.setItem(ALERTA, JSON.stringify({ message, title, type }));
  try {
    const p = JSON.parse(sessionStorage.getItem(ALERTA));
    if (p) { sessionStorage.removeItem(ALERTA); $alert(p.message, p.title, p.type); }
  } catch (e) { /* ignora */ }

  /* ---------- store auth (sessão) ---------- */
  let perfil = null;
  try { perfil = JSON.parse(sessionStorage.getItem(SESSAO)); } catch (e) { /* ignora */ }
  const isUserLoggedIn = !!perfil;

  /* ---------- NavBar.vue ---------- */
  if (isUserLoggedIn && perfil.type === "admin") { $("#nav-admin").hidden = false; $("#nav-login").hidden = true; }
  else if (isUserLoggedIn) { $("#nav-login").hidden = true; }
  // b-nav-item :disabled="!isUserLoggedIn"
  if (!isUserLoggedIn) $$("#nav-collapse [data-fora]").forEach(a => { a.classList.add("disabled"); a.setAttribute("aria-disabled", "true"); a.tabIndex = -1; });
  const toggler = $(".navbar-toggler");
  toggler.addEventListener("click", () => {
    const aberto = $("#nav-collapse").classList.toggle("show");
    toggler.setAttribute("aria-expanded", String(aberto));
  });

  // páginas do Animalec que existem no projeto original mas não fazem parte deste protótipo
  document.addEventListener("click", ev => {
    const el = ev.target.closest("[data-fora]");
    if (!el || el.tagName === "FORM") return;
    ev.preventDefault();
    $alert(`«${el.dataset.fora}» existe no Animalec original mas não faz parte deste protótipo (Tarefa 3.1 b), que só acrescenta os patrocinadores e os especialistas.`, "Informação", "info");
  });
  $$("form[data-fora]").forEach(f => f.addEventListener("submit", ev => {
    ev.preventDefault();
    $alert(`«${f.dataset.fora}» existe no Animalec original mas não faz parte deste protótipo (Tarefa 3.1 b).`, "Informação", "info");
  }));

  /* ---------- Login.vue ---------- */
  if (PAGINA === "login") {
    $("#form-login").addEventListener("submit", ev => {
      ev.preventDefault();
      const u = Armazem.listar("users").find(x => x.auth.username === $("#exampleInputEmail1").value && x.auth.password === $("#exampleInputPassword1").value);
      if (!u) { $alert("Dados das credenciais errados!", "Erro", "error"); return; }
      sessionStorage.setItem(SESSAO, JSON.stringify({ _id: u._id, name: u.name, type: u.type }));
      alertaDepois(`Bem-vindo, ${u.name}!`, "Login", "success");
      location.href = "index.html"; // router.push({ name: "home" })
    });
    return;
  }
  if (PAGINA === "home" || PAGINA === "admin") return;

  /* ---------- sem sessão, a API responde 401 (handleResponses dos serviços) ---------- */
  if (!isUserLoggedIn) { $alert("Não está autorizado a executar esta ação!", "Erro", "error"); return; }

  /* ---------- utilitários (iguais aos das views) ---------- */
  const formatDate = d => { const n = new Date(Date.parse(d)); return n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds(); };
  const getUserLevelByPoints = p => USER_LEVELS.find(l => p <= l.max);
  const nomeAnimal = id => (Armazem.obter("animals", id) || {}).name;
  const nomesAnimais = ids => (ids || []).map(nomeAnimal).filter(Boolean);
  const TIPOS = { empresa: "empresa", associacao: "associação", particular: "particular" };

  /* ---------- Listas: ListUsers, ListAnimals, ListQuizzes, ListQuestions + NOVO ListSponsors, ListExperts ---------- */
  const LISTAS = {
    users: {
      campo: "name", form: null, nome: "utilizador", removido: "Utilizador removido!", msg: "O utilizador foi removido com sucesso!",
      celulas: u => [u.name, u.type === "admin" ? "Administrador" : "Utilizador normal", formatDate(u.registration_date)],
      ver: u => ({ title: u.name, imageUrl: `img/avatars/${getUserLevelByPoints(u.gamification.points).avatar}.png`, imageWidth: 150, imageHeight: 150, imageAlt: "Imagem desconhecida",
        html: `<h5>${u.gamification.points} pontos (${getUserLevelByPoints(u.gamification.points).name})</h5><p>${esc(u.description)}</p><p>
          <b>Nome:</b> ${esc(u.name)} <br><b>Tipo de utilizador:</b> ${u.type === "admin" ? "Administrador" : "Utilizador normal"} <br>
          <b>Data de registo:</b> ${formatDate(u.registration_date)} <br><b>Data de nascimento:</b> ${formatDate(u.birth_date)}<br>
          <b>Cidade:</b> ${esc(u.location.city)}<br><b>País:</b> ${esc(u.location.country)}</p>` })
    },
    animals: {
      campo: "name", form: null, nome: "animal", removido: "Animal removido!", msg: "O animal foi removido com sucesso!",
      celulas: a => [a.name, a.group, a.level],
      ver: a => {
        let html = `<h4>Grupo:</b> ${esc(a.group)}</h4><h5>(nível:</b> ${a.level})</h5><p>${esc(a.description)}</p><p>Elementos multimédia:`;
        for (const link of a.links) html += ` <a href='${esc(link.url)}' target='_blank'>${link.types}</a>`;
        html += `</p><p>Comentários: ${a.comments.length} Avaliações: ${a.evaluation.length}</p>`;
        // NOVO (integração): patrocinadores e especialistas do animal
        const sp = Armazem.listar("sponsors").filter(s => s.animals.includes(a._id)).map(s => s.name);
        const ex = Armazem.listar("experts").filter(e => e.animals.includes(a._id)).map(e => e.name);
        html += `<p><b>Patrocinadores:</b> ${sp.length ? sp.map(esc).join(", ") : "nenhum"}<br><b>Especialistas:</b> ${ex.length ? ex.map(esc).join(", ") : "nenhum"}</p>`;
        return { title: a.name, html, imageUrl: a.links[0].url, imageWidth: 400, imageHeight: 200, imageAlt: "Imagem desconhecida" };
      }
    },
    quizzes: {
      campo: "name", form: null, nome: "quiz", removido: "Quiz removido!", msg: "sucesso!",
      celulas: q => [q.name, q.level, q.points],
      ver: q => ({ title: q.name, html: `<p><b>Nível</b> ${q.level}<br>(${q.points} pontos)</p><p><b>Lista de questões:</b></p>` +
        q.questions.map(id => `<p>${esc((Armazem.obter("questions", id) || {}).question)}</p>`).join("") })
    },
    questions: {
      campo: "question", form: null, nome: "questão", removido: "Questão removida!", msg: "sucesso!",
      celulas: q => [q.question, q.level],
      ver: q => ({ title: q.question, html: `<p><b>Descrição:</b> ${esc(q.description)}</p><p><b>Tipo:</b> ${esc(q.type)}</p><p><b>Lista de respostas possíveis (correta a verde):</b></p>` +
        q.answers.map((r, i) => `<p class="${r.correct ? "green" : "red"}">${i + 1}. ${esc(r.title)}</p>`).join("") })
    },
    // NOVO
    sponsors: {
      campo: "name", form: "sponsor-form.html", nome: "patrocinador", removido: "Patrocinador removido!", msg: "O patrocinador foi removido com sucesso!",
      celulas: s => [s.name, TIPOS[s.type], nomesAnimais(s.animals).join(", ")],
      ver: s => {
        const o = { title: s.name, html: `<h4>Tipo: ${TIPOS[s.type]}</h4><p>${esc(s.description)}</p>
          <p><b>Animais patrocinados:</b> ${nomesAnimais(s.animals).map(esc).join(", ")}</p>
          <p><b>Contribuição anual:</b> ${s.amount} €<br><b>Desde:</b> ${esc(s.date)}</p>
          <p><b>Email:</b> ${esc(s.contact.email)}${s.contact.phone ? `<br><b>Telefone:</b> ${esc(s.contact.phone)}` : ""}</p>
          ${s.links[1].url ? `<p>Website: <a href='${esc(s.links[1].url)}' target='_blank'>${esc(s.links[1].url)}</a></p>` : ""}` };
        if (s.links[0].url) Object.assign(o, { imageUrl: s.links[0].url, imageWidth: 400, imageHeight: 200, imageAlt: "Imagem desconhecida" });
        return o;
      }
    },
    experts: {
      campo: "name", form: "expert-form.html", nome: "especialista", removido: "Especialista removido!", msg: "O especialista foi removido com sucesso!",
      celulas: e => [e.name, e.specialty, e.institution],
      ver: e => {
        const o = { title: e.name, html: `<h4>Especialidade: ${esc(e.specialty)}</h4><h5>${esc(e.institution)}</h5><p>${esc(e.description)}</p>
          <p><b>Animais da sua área:</b> ${nomesAnimais(e.animals).map(esc).join(", ")}</p>
          <p><b>Email:</b> ${esc(e.contact.email)}</p>
          ${e.links[1].url ? `<p>Página pessoal: <a href='${esc(e.links[1].url)}' target='_blank'>${esc(e.links[1].url)}</a></p>` : ""}` };
        if (e.links[0].url) Object.assign(o, { imageUrl: e.links[0].url, imageWidth: 150, imageHeight: 150, imageAlt: "Imagem desconhecida" });
        return o;
      }
    }
  };

  const cfg = LISTAS[PAGINA];
  if (cfg) {
    const tbody = $("#tabela tbody");
    let sortType = 1;
    const desenhar = () => {
      const lista = Armazem.listar(PAGINA).sort((a, b) => (a[cfg.campo] > b[cfg.campo] ? 1 : a[cfg.campo] < b[cfg.campo] ? -1 : 0) * sortType);
      tbody.innerHTML = lista.map(r => {
        const editar = cfg.form
          ? `<a href="${cfg.form}?id=${encodeURIComponent(r._id)}" class="btn btn-outline-success mr-2 mt-2"><i class="fas fa-edit"></i> EDITAR </a>`
          : `<button type="button" class="btn btn-outline-success mr-2 mt-2" data-fora="Editar ${cfg.nome}"><i class="fas fa-edit"></i> EDITAR </button>`;
        return `<tr>${cfg.celulas(r).map(c => `<td class="pt-4">${esc(c)}</td>`).join("")}<td>${editar}` +
          `<button type="button" class="btn btn-outline-success mr-2 mt-2" data-ver="${r._id}"><i class="fas fa-search"></i> VER </button>` +
          `<button type="button" class="btn btn-outline-danger mr-2 mt-2" data-remover="${r._id}"><i class="fas fa-trash-alt"></i> REMOVER </button></td></tr>`;
      }).join("");
    };
    desenhar();
    const ordenar = () => {
      sortType *= -1;
      const i = $("[data-ordenar]");
      i.className = "fas fa-arrow-" + (sortType === 1 ? "up" : "down");
      i.closest("th").setAttribute("aria-sort", sortType === 1 ? "ascending" : "descending");
      desenhar();
    };
    $("[data-ordenar]").addEventListener("click", ordenar);
    $("[data-ordenar]").addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); ordenar(); } });
    tbody.addEventListener("click", ev => {
      const v = ev.target.closest("[data-ver]"), r = ev.target.closest("[data-remover]");
      if (v) $fire(cfg.ver(Armazem.obter(PAGINA, v.dataset.ver)));
      if (r) {
        $confirm("Se sim, clique em OK", `Deseja mesmo remover ${cfg.nome === "questão" ? "a" : "o"} ${cfg.nome}?`, "warning").then(
          () => { Armazem.remover(PAGINA, r.dataset.remover); $alert(cfg.msg, cfg.removido, "success"); desenhar(); },
          () => { $alert("Remoção cancelada!", "Informação", "info"); }
        );
      }
    });
    return;
  }

  /* ---------- NOVO: AddSponsor/EditSponsor e AddExpert/EditExpert ---------- */
  const form = $("#formulario");
  if (!form) return;
  const ENT = form.dataset.entidade, NOME = form.dataset.nome;
  const id = new URLSearchParams(location.search).get("id");
  const registo = id ? Armazem.obter(ENT, id) : null;
  const filtro = form.elements.specialty; // especialistas: só animais do grupo escolhido (como getQuestionsByLevel em AddQuiz.vue)
  const animaisDisponiveis = () => Armazem.listar("animals").filter(a => !filtro || !filtro.value || a.group === filtro.value);

  // lista de animais com o padrão de AddQuiz.vue (select + REMOVER, botão ADICIONAR ANIMAIS)
  const caixa = $("#animais");
  const linhaAnimal = valor => {
    const n = caixa.children.length + 1;
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<div class="row"><div class="col-md-9">
        <label class="sr-only" for="animal-${n}">Animal ${n}</label>
        <select id="animal-${n}" class="form-control" required>${animaisDisponiveis().map(a => `<option value="${a._id}">${esc(a.name)}</option>`).join("")}</select>
      </div><div class="col-md-3"><button type="button" class="btn btn-outline-danger mr-2" data-remover-animal><i class="fas fa-trash"></i> REMOVER</button></div></div>`;
    if (valor) $("select", div).value = valor;
    caixa.appendChild(div);
    $("#cabecalho-animais").hidden = false;
  };
  $("#adicionar-animal").addEventListener("click", () => linhaAnimal());
  caixa.addEventListener("click", ev => {
    if (!ev.target.closest("[data-remover-animal]")) return;
    ev.target.closest(".form-group").remove();
    $("#cabecalho-animais").hidden = caixa.children.length === 0;
  });
  if (filtro) filtro.addEventListener("change", () => { caixa.innerHTML = ""; $("#cabecalho-animais").hidden = true; });

  if (registo) { // EditSponsor / EditExpert
    $("#titulo-form").textContent = `EDITAR ${NOME.toUpperCase()}`;
    $("#submeter").innerHTML = '<i class="fas fa-save"></i> ATUALIZAR';
    const f = form.elements;
    f.name.value = registo.name; f.description.value = registo.description || ""; f.email.value = registo.contact.email;
    if (ENT === "sponsors") {
      f.type.value = registo.type; f.phone.value = registo.contact.phone || ""; f.amount.value = registo.amount; f.date.value = registo.date;
      f.logo.value = registo.links[0].url; f.website.value = registo.links[1].url;
    } else {
      f.specialty.value = registo.specialty; f.institution.value = registo.institution;
      f.photo.value = registo.links[0].url; f.website.value = registo.links[1].url;
    }
    registo.animals.forEach(a => linhaAnimal(a));
  }

  form.addEventListener("submit", ev => {
    ev.preventDefault();
    const animais = [...new Set($$("select", caixa).map(s => s.value).filter(Boolean))];
    if (!animais.length) { $alert("Adiciona pelo menos um animal.", "Erro", "error"); return; }
    const f = form.elements;
    const novo = ENT === "sponsors" ? {
      _id: registo ? registo._id : undefined, name: f.name.value.trim(), type: f.type.value, description: f.description.value.trim(),
      contact: { email: f.email.value.trim(), phone: f.phone.value.trim() },
      links: [{ types: "logo", url: f.logo.value.trim() }, { types: "website", url: f.website.value.trim() }],
      animals: animais, amount: Number(f.amount.value), date: f.date.value, active: registo ? registo.active : true
    } : {
      _id: registo ? registo._id : undefined, name: f.name.value.trim(), specialty: f.specialty.value, institution: f.institution.value.trim(),
      description: f.description.value.trim(), contact: { email: f.email.value.trim() },
      links: [{ types: "photo", url: f.photo.value.trim() }, { types: "website", url: f.website.value.trim() }],
      animals: animais, active: registo ? registo.active : true
    };
    Armazem.guardar(ENT, novo);
    const art = "O"; // patrocinador / especialista
    alertaDepois(`${art} ${NOME.toLowerCase()} ${novo.name} foi ${registo ? "atualizado" : "adicionado"} com sucesso!`, `${NOME} ${registo ? "atualizado" : "adicionado"}!`, "success");
    location.href = form.dataset.lista;
  });
})();

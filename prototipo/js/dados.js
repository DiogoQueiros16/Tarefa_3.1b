/*
 * Animalec – protótipo da Tarefa 3.1 b)
 * Dados de exemplo e armazenamento simulado (substitui a API REST e a store Vuex).
 *
 * As entidades existentes (animals, users, quizzes, questions) usam os campos dos modelos
 * Mongoose do back-end do livro. As novas (sponsors, experts) seguem as mesmas convenções.
 * Os nomes de pessoas, empresas e instituições são fictícios.
 */
const DADOS_INICIAIS = {
  animals: [
    { _id: "a1", name: "cão", group: "mamifero", level: 1, description: "O cão é o melhor amigo do homem.", comments: [], evaluation: [],
      links: [{ types: "photo", url: "https://placehold.co/600x300/2c3e50/ffffff?text=c%C3%A3o" }, { types: "video", url: "" }, { types: "sound", url: "" }] },
    { _id: "a2", name: "gato", group: "mamifero", level: 1, description: "O gato é um felino doméstico independente e curioso.", comments: [], evaluation: [],
      links: [{ types: "photo", url: "https://placehold.co/600x300/2c3e50/ffffff?text=gato" }, { types: "video", url: "" }, { types: "sound", url: "" }] },
    { _id: "a3", name: "pardal", group: "ave", level: 2, description: "O pardal vive perto das pessoas, nas cidades e nos campos.", comments: [], evaluation: [],
      links: [{ types: "photo", url: "https://placehold.co/600x300/2c3e50/ffffff?text=pardal" }, { types: "video", url: "" }, { types: "sound", url: "" }] },
    { _id: "a4", name: "cavalo", group: "mamifero", level: 2, description: "O cavalo é um herbívoro forte e veloz.", comments: [], evaluation: [],
      links: [{ types: "photo", url: "https://placehold.co/600x300/2c3e50/ffffff?text=cavalo" }, { types: "video", url: "" }, { types: "sound", url: "" }] },
    { _id: "a5", name: "sapo", group: "anfibio", level: 3, description: "O sapo passa parte da vida na água e parte em terra.", comments: [], evaluation: [],
      links: [{ types: "photo", url: "https://placehold.co/600x300/2c3e50/ffffff?text=sapo" }, { types: "video", url: "" }, { types: "sound", url: "" }] },
    { _id: "a6", name: "tartaruga", group: "reptil", level: 3, description: "A tartaruga tem uma carapaça que a protege.", comments: [], evaluation: [],
      links: [{ types: "photo", url: "https://placehold.co/600x300/2c3e50/ffffff?text=tartaruga" }, { types: "video", url: "" }, { types: "sound", url: "" }] }
  ],
  users: [
    { _id: "u1", name: "Administrador", type: "admin", birth_date: "1990-01-01T00:00:00", registration_date: "2026-11-17T09:15:00", description: "Conta de administração",
      location: { city: "Vila Real", district: "Vila Real", country: "Portugal" }, auth: { username: "admin", password: "animalec2026" }, gamification: { points: 0 } },
    { _id: "u2", name: "Joana Matos", type: "user", birth_date: "2010-05-12T00:00:00", registration_date: "2026-11-17T09:20:00", description: "Gosta de aves",
      location: { city: "Porto", district: "Porto", country: "Portugal" }, auth: { username: "joana", password: "animalec2026" }, gamification: { points: 120 } }
  ],
  questions: [
    { _id: "p1", question: "Qual destes animais é um mamífero?", description: "Escolhe o mamífero.", type: "escolha", group: "mamifero", level: 1,
      answers: [{ title: "cão", correct: true }, { title: "pardal", correct: false }, { title: "sapo", correct: false }] },
    { _id: "p2", question: "Que animal tem uma carapaça?", description: "Pensa nos répteis.", type: "escolha", group: "reptil", level: 1,
      answers: [{ title: "gato", correct: false }, { title: "tartaruga", correct: true }, { title: "cavalo", correct: false }] },
    { _id: "p3", question: "O sapo é um…", description: "Vive na água e em terra.", type: "escolha", group: "anfibio", level: 1,
      answers: [{ title: "réptil", correct: false }, { title: "anfíbio", correct: true }, { title: "peixe", correct: false }] }
  ],
  quizzes: [
    { _id: "q1", name: "Quiz dos animais", points: 50, level: 1, questions: ["p1", "p2", "p3"] }
  ],
  // ---- novas entidades (Tarefa 3.1 b) ----
  sponsors: [
    { _id: "s1", name: "PetMundo, Lda.", type: "empresa", description: "Loja de produtos para animais de companhia.",
      contact: { email: "geral@petmundo.example", phone: "220000111" },
      links: [{ types: "logo", url: "https://placehold.co/400x200/1abc9c/ffffff?text=PetMundo" }, { types: "website", url: "https://petmundo.example" }],
      animals: ["a1", "a2"], amount: 5000, date: "2026-01-15", active: true },
    { _id: "s2", name: "Associação Asas Livres", type: "associacao", description: "Associação de proteção das aves urbanas.",
      contact: { email: "info@asaslivres.example", phone: "" },
      links: [{ types: "logo", url: "" }, { types: "website", url: "https://asaslivres.example" }],
      animals: ["a3"], amount: 1200, date: "2026-03-01", active: true }
  ],
  experts: [
    { _id: "e1", name: "Ana Ribeiro", specialty: "mamifero", institution: "Instituto de Zoologia do Norte",
      description: "Veterinária e investigadora em comportamento de mamíferos domésticos.",
      contact: { email: "ana.ribeiro@izn.example" },
      links: [{ types: "photo", url: "" }, { types: "website", url: "https://izn.example/ana-ribeiro" }],
      animals: ["a1", "a2", "a4"], active: true },
    { _id: "e2", name: "Pedro Costa", specialty: "ave", institution: "Centro de Estudos de Aves",
      description: "Ornitólogo; acompanha as populações de aves urbanas há 12 anos.",
      contact: { email: "pedro.costa@cea.example" },
      links: [{ types: "photo", url: "" }, { types: "website", url: "" }],
      animals: ["a3"], active: true }
  ]
};

/* níveis de utilizador (iguais aos de src/store/module.js) */
const USER_LEVELS = [
  { level: 1, name: "iniciante", avatar: "sapo", max: 100 },
  { level: 2, name: "aprendiz", avatar: "macaco", max: 200 },
  { level: 3, name: "junior", avatar: "cao", max: 300 },
  { level: 4, name: "especialista", avatar: "tigre", max: 400 },
  { level: 5, name: "mestre", avatar: "leao", max: Number.MAX_SAFE_INTEGER }
];

/* Armazenamento simulado (faz o papel dos serviços de src/api) */
const Armazem = {
  CHAVE: "animalec-prototipo-v3",
  _cache: null,
  db() {
    if (this._cache) return this._cache;
    try {
      const guardado = localStorage.getItem(this.CHAVE);
      if (guardado) return (this._cache = JSON.parse(guardado));
    } catch (e) { /* sem localStorage: usa só a memória */ }
    return (this._cache = JSON.parse(JSON.stringify(DADOS_INICIAIS)));
  },
  _gravar(db) {
    this._cache = db;
    try { localStorage.setItem(this.CHAVE, JSON.stringify(db)); } catch (e) { /* ignora */ }
  },
  listar(entidade) { return this.db()[entidade].slice(); },
  obter(entidade, id) { return this.db()[entidade].find(r => r._id === id) || null; },
  guardar(entidade, registo) {
    const db = this.db();
    if (registo._id) {
      const i = db[entidade].findIndex(r => r._id === registo._id);
      if (i >= 0) db[entidade][i] = registo; else db[entidade].push(registo);
    } else {
      registo._id = entidade[0] + Date.now().toString(36);
      db[entidade].push(registo);
    }
    this._gravar(db);
    return registo;
  },
  remover(entidade, id) {
    const db = this.db();
    db[entidade] = db[entidade].filter(r => r._id !== id);
    this._gravar(db);
  }
};

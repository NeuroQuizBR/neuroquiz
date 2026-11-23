
const SUPABASE_URL = "https://amtotcqpvzgabbvtjcji.supabase.co";
const SUPABASE_KEY = "sb_publishable_DvFO9BMrExRfp0S6pI0mxQ_keS63MKH";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const quizData = {
  logica: {
    title: "Lógica & padrões",
    items: [
      { q: "Qual número completa a sequência: 3, 6, 12, 24, ...?", a: ["30", "36", "48", "52"], c: 2, why: "Cada termo é o dobro do anterior: 24 × 2 = 48." },
      { q: "Ana é mais alta que Bia. Bia é mais alta que Carla. Quem é a mais baixa?", a: ["Ana", "Bia", "Carla", "Não é possível saber"], c: 2, why: "A ordem é Ana > Bia > Carla; portanto, Carla é a mais baixa." },
      { q: "Se todos os Z são Y e nenhum Y é X, o que necessariamente é verdade?", a: ["Todo X é Z", "Nenhum Z é X", "Alguns Z são X", "Todo Y é Z"], c: 1, why: "Como Z está contido em Y e Y não tem elementos X, Z também não tem elementos X." }
    ]
  },
  geral: {
    title: "Conhecimentos gerais",
    items: [
      { q: "Qual é o maior planeta do Sistema Solar?", a: ["Terra", "Saturno", "Júpiter", "Netuno"], c: 2, why: "Júpiter é o maior planeta do Sistema Solar." },
      { q: "Qual oceano banha o litoral brasileiro?", a: ["Índico", "Atlântico", "Pacífico", "Ártico"], c: 1, why: "O Brasil tem sua costa voltada para o Oceano Atlântico." },
      { q: "Qual gás as plantas absorvem principalmente durante a fotossíntese?", a: ["Oxigênio", "Nitrogênio", "Gás carbônico", "Hidrogênio"], c: 2, why: "Na fotossíntese, as plantas utilizam dióxido de carbono, água e luz." }
    ]
  },
  psico: {
    title: "Mente & comportamento",
    items: [
      { q: "O que descreve o viés de confirmação?", a: ["Buscar apenas dados numéricos", "Favorecer informações que apoiam crenças existentes", "Esquecer eventos recentes", "Mudar de opinião a cada conversa"], c: 1, why: "O viés de confirmação é a tendência de procurar ou interpretar informações em favor de crenças prévias." },
      { q: "O que é metacognição?", a: ["Pensar sobre os próprios processos de pensamento", "Memorizar sem compreender", "Imitar o comportamento de outras pessoas", "Reagir sem avaliar"], c: 0, why: "Metacognição envolve monitorar e refletir sobre como pensamos e aprendemos." },
      { q: "Uma lembrança muito vívida é necessariamente exata?", a: ["Sim, sempre", "Somente se for recente", "Não; confiança não garante precisão", "Sim, se houver emoção"], c: 2, why: "A vividez e a confiança de uma lembrança não garantem que todos os detalhes sejam precisos." }
    ]
  },
  decisao: {
    title: "Decisão & estratégia",
    items: [
      { q: "Ao comparar duas opções com riscos diferentes, o que ajuda mais?", a: ["Considerar apenas o melhor cenário", "Ignorar as chances de perda", "Avaliar probabilidades, consequências e objetivos", "Escolher a opção mais rápida"], c: 2, why: "Uma boa decisão considera chances, possíveis perdas e o que importa para a pessoa." },
      { q: "Qual atitude ajuda a reduzir decisões impulsivas?", a: ["Decidir sob pressão sempre que possível", "Definir critérios antes de escolher", "Ignorar informações contrárias", "Evitar comparar alternativas"], c: 1, why: "Critérios definidos previamente ajudam a avaliar opções com mais consistência." },
      { q: "Se uma hipótese não combina com novas evidências confiáveis, o que é mais racional?", a: ["Descartar as evidências", "Manter a hipótese por orgulho", "Reavaliar a hipótese", "Procurar apenas opiniões iguais"], c: 2, why: "O pensamento crítico exige revisar hipóteses quando surgem evidências relevantes." }
    ]
  }
};

let active = null;
let activeKey = null;
let index = 0;
let score = 0;
let chosen = null;
let locked = false;
let currentUser = null;
let resultSaved = false;

const $ = id => document.getElementById(id);

function showStatus(message, error = false) {
  const status = $("profileStatus");
  status.textContent = message;
  status.style.color = error ? "#ff7777" : "";
}

function openAccount() {
  $("accountModal").classList.add("open");
  $("accountModal").setAttribute("aria-hidden", "false");
  showStatus("");
  updateAccountView();
}

function closeAccount() {
  $("accountModal").classList.remove("open");
  $("accountModal").setAttribute("aria-hidden", "true");
}

function openQuiz(key) {
  activeKey = key;
  active = quizData[key];
  index = 0;
  score = 0;
  resultSaved = false;
  renderQuestion();
  $("quizModal").classList.add("open");
  $("quizModal").setAttribute("aria-hidden", "false");
}

function closeQuiz() {
  $("quizModal").classList.remove("open");
  $("quizModal").setAttribute("aria-hidden", "true");
}

function renderQuestion() {
  const item = active.items[index];

  chosen = null;
  locked = false;

  $("quizCategory").textContent = active.title.toUpperCase();
  $("questionCount").textContent = `PERGUNTA ${index + 1} DE ${active.items.length}`;
  $("progressBar").style.width = `${index / active.items.length * 100}%`;
  $("questionText").textContent = item.q;
  $("answers").innerHTML = "";
  $("feedback").textContent = "";
  $("nextQuestion").disabled = true;
  $("nextQuestion").textContent = "Confirmar resposta";

  item.a.forEach((answer, i) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = String.fromCharCode(65 + i) + ". " + answer;

    button.onclick = () => {
      if (locked) return;

      chosen = i;

      document.querySelectorAll(".answer").forEach(element => {
        element.classList.remove("selected");
      });

      button.classList.add("selected");
      $("nextQuestion").disabled = false;
    };

    $("answers").appendChild(button);
  });
}

$("nextQuestion").onclick = () => {
  if (!locked) {
    if (chosen === null) return;

    locked = true;

    const item = active.items[index];

    if (chosen === item.c) score++;

    $("feedback").textContent =
      (chosen === item.c ? "Resposta correta! " : "Vamos aprender: ") + item.why;

    document.querySelectorAll(".answer").forEach((button, i) => {
      button.disabled = true;
      if (i === item.c) button.classList.add("selected");
    });

    $("nextQuestion").textContent =
      index === active.items.length - 1 ? "Ver resultado" : "Próxima pergunta";

  } else {
    index++;

    if (index < active.items.length) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }
};

function finishQuiz() {
  const total = active.items.length;
  const percent = Math.round(score / total * 100);

  $("questionCount").textContent = "DESAFIO CONCLUÍDO";
  $("progressBar").style.width = "100%";
  $("questionText").textContent = `Você acertou ${score} de ${total}!`;
  $("answers").innerHTML =
    `<div class="feedback">Seu aproveitamento foi de ${percent}%. Continue praticando para evoluir.</div>`;

  $("feedback").textContent = "";
  $("nextQuestion").textContent = "Fechar resultado";
  $("nextQuestion").disabled = false;

  locked = true;

  $("nextQuestion").onclick = async () => {
    if (!resultSaved) {
      resultSaved = true;
      await saveResult(active.title, score, total);
    }

    closeQuiz();
    $("nextQuestion").onclick = defaultNext;
  };
}

const defaultNext = $("nextQuestion").onclick;

function saveLocalResult(title, correct, total) {
  const history = JSON.parse(localStorage.getItem("nq_history") || "[]");

  history.unshift({
    title,
    correct,
    total,
    date: new Date().toLocaleDateString("pt-BR")
  });

  localStorage.setItem("nq_history", JSON.stringify(history.slice(0, 20)));
}

async function saveResult(title, correct, total) {
  saveLocalResult(title, correct, total);

  if (!currentUser) {
    return;
  }

  const { error } = await supabaseClient
    .from("quiz_results")
    .insert({
      user_id: currentUser.id,
      quiz_title: title,
      correct_count: correct,
      question_count: total
    });

  if (error) {
    console.error("Erro ao salvar resultado:", error.message);
  }
}

async function updateAccountView() {
  const { data } = await supabaseClient.auth.getUser();
  currentUser = data.user || null;

  $("authForm").hidden = !!currentUser;
  $("loggedArea").hidden = !currentUser;

  if (currentUser) {
    $("loggedUser").textContent = `Conectado como ${currentUser.email}`;

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("display_name")
      .eq("id", currentUser.id)
      .maybeSingle();

    $("profileName").value = profile?.display_name || "";
    await renderHistory();
  } else {
    $("profileHistory").innerHTML = "";
  }
}

async function renderHistory() {
  const historyBox = $("profileHistory");

  if (!currentUser) {
    const history = JSON.parse(localStorage.getItem("nq_history") || "[]");

    historyBox.innerHTML =
      "<b>Histórico neste dispositivo</b><br>" +
      (history.length
        ? history.map(item =>
            `${item.date} — ${item.title}: ${item.correct}/${item.total}`
          ).join("<br>")
        : "Você ainda não concluiu nenhum quiz.");

    return;
  }

  historyBox.textContent = "Carregando seu histórico...";

  const { data, error } = await supabaseClient
    .from("quiz_results")
    .select("quiz_title, correct_count, question_count, created_at")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    historyBox.textContent = "Não foi possível carregar o histórico.";
    console.error(error.message);
    return;
  }

  historyBox.innerHTML = "<b>Seu histórico de desafios</b><br>";

  if (!data || data.length === 0) {
    historyBox.innerHTML += "Você ainda não concluiu nenhum quiz.";
    return;
  }

  data.forEach(item => {
    const line = document.createElement("div");
    const date = new Date(item.created_at).toLocaleDateString("pt-BR");

    line.textContent =
      `${date} — ${item.quiz_title}: ${item.correct_count}/${item.question_count}`;

    historyBox.appendChild(line);
  });
}

async function signUp() {
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = $("displayName").value.trim();

  if (!email || !password || !name) {
    showStatus("Preencha e-mail, senha e nome.", true);
    return;
  }

  if (password.length < 6) {
    showStatus("Sua senha precisa ter pelo menos 6 caracteres.", true);
    return;
  }

  $("signupBtn").disabled = true;
  showStatus("Criando sua conta...");

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name }
      }
    });

    if (error) throw error;

    if (data.user && data.session) {
      currentUser = data.user;
      await saveProfile(name);
      showStatus("Conta criada com sucesso!");
      await updateAccountView();
    } else {
      showStatus("Cadastro iniciado! Confira seu e-mail para confirmar a conta antes de entrar.");
    }

  } catch (error) {
    showStatus("Erro ao criar conta: " + error.message, true);
  } finally {
    $("signupBtn").disabled = false;
  }
}

async function signIn() {
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;

  if (!email || !password) {
    showStatus("Informe seu e-mail e sua senha.", true);
    return;
  }

  $("loginBtn").disabled = true;
  showStatus("Entrando na sua conta...");

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    currentUser = data.user;
    showStatus("Login realizado com sucesso!");
    await updateAccountView();

  } catch (error) {
    showStatus("Não foi possível entrar: " + error.message, true);
  } finally {
    $("loginBtn").disabled = false;
  }
}

async function saveProfile(name) {
  if (!currentUser) {
    showStatus("Entre na sua conta primeiro.", true);
    return;
  }

  const cleanName = name.trim();

  if (!cleanName) {
    showStatus("Digite seu nome.", true);
    return;
  }

  const { error } = await supabaseClient
    .from("profiles")
    .upsert({
      id: currentUser.id,
      display_name: cleanName
    });

  if (error) {
    showStatus("Erro ao salvar perfil: " + error.message, true);
    return;
  }

  showStatus("Perfil atualizado com sucesso!");
}

async function signOut() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showStatus("Erro ao sair: " + error.message, true);
    return;
  }

  currentUser = null;
  showStatus("Você saiu da sua conta.");
  await updateAccountView();
}

document.querySelectorAll("[data-quiz]").forEach(card => {
  card.addEventListener("click", () => openQuiz(card.dataset.quiz));
});

$("accountBtn").onclick = openAccount;
$("closeAccount").onclick = closeAccount;
$("closeQuiz").onclick = closeQuiz;

$("signupBtn").onclick = signUp;
$("loginBtn").onclick = signIn;
$("logoutBtn").onclick = signOut;

$("saveProfile").onclick = () => {
  saveProfile($("profileName").value);
};

supabaseClient.auth.onAuthStateChange(() => {
  setTimeout(() => {
    updateAccountView();
  }, 0);
});

updateAccountView();

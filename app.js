
const SUPABASE_URL = "https://amtotcqpvzgabbvtjcji.supabase.co";
const SUPABASE_KEY = "sb_publishable_DvFO9BMrExRfp0S6pI0mxQ_keS63MKH";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ========================================
// PERGUNTAS DOS QUIZZES
// ========================================

const quizData = {
  logica: {
    title: "Lógica & padrões",
    items: [
      {
        q: "Qual número completa a sequência: 3, 6, 12, 24, ...?",
        a: ["30", "36", "48", "52"],
        c: 2,
        why: "Cada termo é o dobro do anterior: 24 × 2 = 48."
      },
      {
        q: "Ana é mais alta que Bia. Bia é mais alta que Carla. Quem é a mais baixa?",
        a: ["Ana", "Bia", "Carla", "Não é possível saber"],
        c: 2,
        why: "A ordem é Ana > Bia > Carla; portanto, Carla é a mais baixa."
      },
      {
        q: "Se todos os Z são Y e nenhum Y é X, o que necessariamente é verdade?",
        a: ["Todo X é Z", "Nenhum Z é X", "Alguns Z são X", "Todo Y é Z"],
        c: 1,
        why: "Como Z está contido em Y e Y não tem elementos X, Z também não tem elementos X."
      }
    ]
  },

  geral: {
    title: "Conhecimentos gerais",
    items: [
      {
        q: "Qual é o maior planeta do Sistema Solar?",
        a: ["Terra", "Saturno", "Júpiter", "Netuno"],
        c: 2,
        why: "Júpiter é o maior planeta do Sistema Solar."
      },
      {
        q: "Qual oceano banha o litoral brasileiro?",
        a: ["Índico", "Atlântico", "Pacífico", "Ártico"],
        c: 1,
        why: "O Brasil tem sua costa voltada para o Oceano Atlântico."
      },
      {
        q: "Qual gás as plantas absorvem principalmente durante a fotossíntese?",
        a: ["Oxigênio", "Nitrogênio", "Gás carbônico", "Hidrogênio"],
        c: 2,
        why: "Na fotossíntese, as plantas utilizam dióxido de carbono, água e luz."
      }
    ]
  },

  psico: {
    title: "Mente & comportamento",
    items: [
      {
        q: "O que descreve o viés de confirmação?",
        a: [
          "Buscar apenas dados numéricos",
          "Favorecer informações que apoiam crenças existentes",
          "Esquecer eventos recentes",
          "Mudar de opinião a cada conversa"
        ],
        c: 1,
        why: "O viés de confirmação é a tendência de procurar ou interpretar informações em favor de crenças prévias."
      },
      {
        q: "O que é metacognição?",
        a: [
          "Pensar sobre os próprios processos de pensamento",
          "Memorizar sem compreender",
          "Imitar o comportamento de outras pessoas",
          "Reagir sem avaliar"
        ],
        c: 0,
        why: "Metacognição envolve monitorar e refletir sobre como pensamos e aprendemos."
      },
      {
        q: "Uma lembrança muito vívida é necessariamente exata?",
        a: [
          "Sim, sempre",
          "Somente se for recente",
          "Não; confiança não garante precisão",
          "Sim, se houver emoção"
        ],
        c: 2,
        why: "A vividez e a confiança de uma lembrança não garantem que todos os detalhes sejam precisos."
      }
    ]
  },

  decisao: {
    title: "Decisão & estratégia",
    items: [
      {
        q: "Ao comparar duas opções com riscos diferentes, o que ajuda mais?",
        a: [
          "Considerar apenas o melhor cenário",
          "Ignorar as chances de perda",
          "Avaliar probabilidades, consequências e objetivos",
          "Escolher a opção mais rápida"
        ],
        c: 2,
        why: "Uma boa decisão considera chances, possíveis perdas e o que importa para a pessoa."
      },
      {
        q: "Qual atitude ajuda a reduzir decisões impulsivas?",
        a: [
          "Decidir sob pressão sempre que possível",
          "Definir critérios antes de escolher",
          "Ignorar informações contrárias",
          "Evitar comparar alternativas"
        ],
        c: 1,
        why: "Critérios definidos previamente ajudam a avaliar opções com mais consistência."
      },
      {
        q: "Se uma hipótese não combina com novas evidências confiáveis, o que é mais racional?",
        a: [
          "Descartar as evidências",
          "Manter a hipótese por orgulho",
          "Reavaliar a hipótese",
          "Procurar apenas opiniões iguais"
        ],
        c: 2,
        why: "O pensamento crítico exige revisar hipóteses quando surgem evidências relevantes."
      }
    ]
  }
};

// ========================================
// CONQUISTAS
// ========================================

const achievements = {
  first_quiz: {
    name: "Primeiro desafio",
    description: "Concluiu seu primeiro quiz.",
    icon: "🎯"
  },

  perfect_score: {
    name: "Mente brilhante",
    description: "Acertou todas as perguntas de um quiz.",
    icon: "🏆"
  },

  ten_quizzes: {
    name: "Determinação",
    description: "Concluiu dez quizzes.",
    icon: "🔥"
  }
};

// ========================================
// NÍVEIS
// ========================================

const levels = [
  { name: "Iniciante", xp: 0 },
  { name: "Explorador", xp: 100 },
  { name: "Estrategista", xp: 300 },
  { name: "Analista", xp: 600 },
  { name: "Especialista", xp: 1000 },
  { name: "Mestre da mente", xp: 1500 },
  { name: "Gênio", xp: 2500 }
];

// ========================================
// VARIÁVEIS DO SISTEMA
// ========================================

let active = null;
let activeKey = null;
let index = 0;
let score = 0;
let chosen = null;
let locked = false;
let currentUser = null;
let resultSaved = false;
let attemptId = null;

const $ = id => document.getElementById(id);

// Gera um identificador exclusivo para cada tentativa.
function createAttemptId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ========================================
// MENSAGENS DO PERFIL
// ========================================

function showStatus(message, error = false) {
  const status = $("profileStatus");

  if (!status) return;

  status.textContent = message;
  status.style.color = error ? "#ff7777" : "";
}

// ========================================
// IDENTIFICAÇÃO DO NÍVEL
// ========================================

function getLevel(xp) {
  let current = levels[0];
  let next = null;

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      current = levels[i];
      next = levels[i + 1] || null;
    }
  }

  return { current, next };
}

// ========================================
// PAINEL DE XP E CONQUISTAS
// ========================================

function renderProgress(xp, unlocked = []) {
  let panel = $("progressPanel");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "progressPanel";

    panel.style.cssText = `
      margin:20px 0;
      padding:20px;
      border:1px solid #354363;
      border-radius:14px;
      background:linear-gradient(135deg,#121d35,#17132d);
    `;

    const loggedArea = $("loggedArea");

    loggedArea.insertBefore(
      panel,
      loggedArea.children[1] || null
    );
  }

  const level = getLevel(xp);
  const current = level.current;
  const next = level.next;

  const progress = next
    ? Math.min(
        100,
        ((xp - current.xp) / (next.xp - current.xp)) * 100
      )
    : 100;

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
      <div>
        <small style="color:#59e1ee;letter-spacing:2px">SUA EVOLUÇÃO</small>
        <h3 style="margin:7px 0;color:#f4f7ff">${current.name}</h3>
      </div>

      <span style="background:#30265a;color:#c3b5ff;padding:7px 12px;border-radius:20px;font-size:12px">
        NÍVEL ${levels.indexOf(current) + 1}
      </span>
    </div>

    <div style="font-size:28px;font-weight:700;color:#59e1ee;margin:12px 0">
      ${xp.toLocaleString("pt-BR")} XP
    </div>

    <div style="height:9px;background:#28334b;border-radius:20px;overflow:hidden">
      <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#59e1ee,#9274ff);border-radius:20px;transition:width .4s"></div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:9px;font-size:11px;color:#9ba8c3">
      <span>${next ? `${next.xp - xp} XP para ${next.name}` : "Nível máximo alcançado!"}</span>
      <span>${Math.round(progress)}%</span>
    </div>

    <div style="border-top:1px solid #354363;margin-top:18px;padding-top:15px">
      <b style="font-size:13px">🏅 Minhas conquistas (${unlocked.length}/3)</b>
      <div id="achievementList" style="display:grid;gap:9px;margin-top:13px"></div>
    </div>
  `;

  const list = $("achievementList");

  Object.entries(achievements).forEach(([id, achievement]) => {
    const earned = unlocked.includes(id);

    const item = document.createElement("div");

    item.style.cssText = `
      display:flex;
      align-items:center;
      gap:12px;
      padding:10px;
      border-radius:9px;
      background:${earned ? "#24344a" : "#0b1120"};
      opacity:${earned ? "1" : ".45"};
    `;

    const icon = document.createElement("span");
    icon.textContent = achievement.icon;
    icon.style.fontSize = "22px";

    const details = document.createElement("div");

    const name = document.createElement("b");
    name.textContent = achievement.name;
    name.style.cssText = "display:block;color:#f4f7ff;font-size:12px";

    const description = document.createElement("small");
    description.textContent = achievement.description;
    description.style.cssText = "color:#9ba8c3;font-size:11px";

    details.append(name, description);
    item.append(icon, details);
    list.appendChild(item);
  });
}

// ========================================
// ABRIR E FECHAR CONTA
// ========================================


function openAccount() {
  $("accountModal").classList.add("open");
  $("accountModal").setAttribute("aria-hidden", "false");

  const closeBtn = $("closeAccount");

  closeBtn.textContent = "×";

  closeBtn.style.cssText = `
    position: fixed;
    top: 18px;
    right: 22px;
    z-index: 99999;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #59e1ee;
    background: #10172a;
    color: #59e1ee;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  showStatus("");
  updateAccountView();
}


const accountCloseButton = $("closeAccount");

accountCloseButton.textContent = "×";

accountCloseButton.style.cssText = `
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  z-index: 999999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 50% !important;
  background: #10172a !important;
  color: #59e1ee !important;
  border: 1px solid #59e1ee !important;
  font-size: 30px !important;
  cursor: pointer !important;
`;

// ========================================
// ABRIR E FECHAR QUIZ
// ========================================

function openQuiz(key) {
  activeKey = key;
  active = quizData[key];

  if (!active) return;

  index = 0;
  score = 0;
  resultSaved = false;
  attemptId = createAttemptId();

  $("nextQuestion").onclick = defaultNext;

  renderQuestion();

  $("quizModal").classList.add("open");
  $("quizModal").setAttribute("aria-hidden", "false");
}

function closeQuiz() {
  $("quizModal").classList.remove("open");
  $("quizModal").setAttribute("aria-hidden", "true");
}

// ========================================
// MOSTRAR PERGUNTAS
// ========================================

function renderQuestion() {
  const item = active.items[index];

  chosen = null;
  locked = false;

  $("quizCategory").textContent = active.title.toUpperCase();

  $("questionCount").textContent =
    `PERGUNTA ${index + 1} DE ${active.items.length}`;

  $("progressBar").style.width =
    `${index / active.items.length * 100}%`;

  $("questionText").textContent = item.q;
  $("answers").innerHTML = "";
  $("feedback").textContent = "";

  $("nextQuestion").disabled = true;
  $("nextQuestion").textContent = "Confirmar resposta";

  item.a.forEach((answer, i) => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent =
      String.fromCharCode(65 + i) + ". " + answer;

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

// ========================================
// CONFIRMAR RESPOSTAS E AVANÇAR
// ========================================

function defaultNext() {
  if (!locked) {
    if (chosen === null) return;

    locked = true;

    const item = active.items[index];

    if (chosen === item.c) {
      score++;
    }

    $("feedback").textContent =
      (chosen === item.c
        ? "Resposta correta! "
        : "Vamos aprender: ") + item.why;

    document.querySelectorAll(".answer").forEach((button, i) => {
      button.disabled = true;

      if (i === item.c) {
        button.classList.add("selected");
      }
    });

    $("nextQuestion").textContent =
      index === active.items.length - 1
        ? "Ver resultado"
        : "Próxima pergunta";

  } else {
    index++;

    if (index < active.items.length) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }
}

$("nextQuestion").onclick = defaultNext;

// ========================================
// FINALIZAR QUIZ
// ========================================

function finishQuiz() {
  const total = active.items.length;
  const percent = Math.round(score / total * 100);

  $("questionCount").textContent = "DESAFIO CONCLUÍDO";
  $("progressBar").style.width = "100%";

  $("questionText").textContent =
    `Você acertou ${score} de ${total}!`;

  $("answers").innerHTML =
    `<div class="feedback">Seu aproveitamento foi de ${percent}%. Continue praticando para evoluir.</div>`;

  $("feedback").textContent = "";

  $("nextQuestion").textContent = "Fechar resultado";
  $("nextQuestion").disabled = false;

  locked = true;

  $("nextQuestion").onclick = async () => {
    if (!resultSaved) {
      resultSaved = true;

      await saveResult(
        active.title,
        score,
        total
      );
    }

    closeQuiz();
    $("nextQuestion").onclick = defaultNext;
  };
}

// ========================================
// HISTÓRICO LOCAL
// ========================================

function saveLocalResult(title, correct, total) {
  const history = JSON.parse(
    localStorage.getItem("nq_history") || "[]"
  );

  history.unshift({
    title,
    correct,
    total,
    date: new Date().toLocaleDateString("pt-BR")
  });

  localStorage.setItem(
    "nq_history",
    JSON.stringify(history.slice(0, 20))
  );
}

// ========================================
// SALVAR RESULTADO E CONCEDER XP
// ========================================

async function saveResult(title, correct, total) {
  saveLocalResult(title, correct, total);

  if (!currentUser) {
    showStatus(
      "Resultado salvo neste dispositivo. Entre na conta para ganhar XP."
    );
    return;
  }

  showStatus("Registrando resultado e calculando seu XP...");

  try {
    const { data, error } = await supabaseClient.rpc(
      "complete_quiz",
      {
        p_quiz_title: title,
        p_correct_count: correct,
        p_question_count: total,
        p_attempt_id: attemptId
      }
    );

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;

    if (!result) {
      throw new Error("O servidor não retornou os dados do resultado.");
    }

    if (result.duplicate) {
      showStatus(
        "Esta tentativa já foi registrada. Seu XP está protegido contra duplicidade."
      );
    } else {
      showStatus(
        `Quiz salvo! Você ganhou ${result.xp_earned} XP! Total: ${result.total_xp} XP.`
      );
    }

    await updateAccountView();

  } catch (error) {
    console.error("Erro ao registrar quiz:", error);

    showStatus(
      "Não foi possível registrar seu XP: " + error.message,
      true
    );
  }
}

// ========================================
// CARREGAR CONQUISTAS
// ========================================

async function renderAchievements() {
  if (!currentUser) return [];

  const { data, error } = await supabaseClient
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", currentUser.id);

  if (error) {
    console.error(
      "Erro ao carregar conquistas:",
      error.message
    );

    return [];
  }

  return (data || []).map(item => item.achievement_id);
}

// ========================================
// ATUALIZAR PERFIL, XP E NÍVEL
// ========================================

async function updateAccountView() {
  const { data } = await supabaseClient.auth.getUser();

  currentUser = data.user || null;

  $("authForm").hidden = !!currentUser;
  $("loggedArea").hidden = !currentUser;

  if (currentUser) {
    $("loggedUser").textContent =
      `Conectado como ${currentUser.email}`;

    const { data: profile, error } = await supabaseClient
      .from("profiles")
      .select("display_name, xp")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao carregar perfil:",
        error.message
      );
    }

    $("profileName").value =
      profile?.display_name || "";

    const unlocked = await renderAchievements();

    renderProgress(
      profile?.xp || 0,
      unlocked
    );

    await renderHistory();

  } else {
    $("profileHistory").innerHTML = "";

    const panel = $("progressPanel");

    if (panel) {
      panel.remove();
    }
  }
}

// ========================================
// ATUALIZAR HISTÓRICO
// ========================================

async function renderHistory() {
  const historyBox = $("profileHistory");

  if (!currentUser) {
    const history = JSON.parse(
      localStorage.getItem("nq_history") || "[]"
    );

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
    .select(
      "quiz_title, correct_count, question_count, created_at"
    )
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    historyBox.textContent =
      "Não foi possível carregar o histórico.";

    console.error(error.message);
    return;
  }

  historyBox.innerHTML =
    "<b>Seu histórico de desafios</b><br>";

  if (!data || data.length === 0) {
    historyBox.innerHTML +=
      "Você ainda não concluiu nenhum quiz.";

    return;
  }

  data.forEach(item => {
    const line = document.createElement("div");

    const date = new Date(
      item.created_at
    ).toLocaleDateString("pt-BR");

    line.textContent =
      `${date} — ${item.quiz_title}: ${item.correct_count}/${item.question_count}`;

    historyBox.appendChild(line);
  });
}

// ========================================
// CADASTRAR CONTA
// ========================================

async function signUp() {
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = $("displayName").value.trim();

  if (!email || !password || !name) {
    showStatus("Preencha e-mail, senha e nome.", true);
    return;
  }

  if (password.length < 6) {
    showStatus(
      "Sua senha precisa ter pelo menos 6 caracteres.",
      true
    );
    return;
  }

  $("signupBtn").disabled = true;

  showStatus("Criando sua conta...");

  try {
    const { data, error } =
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name
          }
        }
      });

    if (error) throw error;

    if (data.user && data.session) {
      currentUser = data.user;

      await saveProfile(name);

      showStatus("Conta criada com sucesso!");

      await updateAccountView();

    } else {
      showStatus(
        "Cadastro iniciado! Confira seu e-mail para confirmar a conta antes de entrar."
      );
    }

  } catch (error) {
    showStatus(
      "Erro ao criar conta: " + error.message,
      true
    );

  } finally {
    $("signupBtn").disabled = false;
  }
}

// ========================================
// ENTRAR NA CONTA
// ========================================

async function signIn() {
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;

  if (!email || !password) {
    showStatus(
      "Informe seu e-mail e sua senha.",
      true
    );
    return;
  }

  $("loginBtn").disabled = true;

  showStatus("Entrando na sua conta...");

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) throw error;

    currentUser = data.user;

    showStatus("Login realizado com sucesso!");

    await updateAccountView();

  } catch (error) {
    showStatus(
      "Não foi possível entrar: " + error.message,
      true
    );

  } finally {
    $("loginBtn").disabled = false;
  }
}

// ========================================
// SALVAR PERFIL
// ========================================

async function saveProfile(name) {
  if (!currentUser) {
    showStatus(
      "Entre na sua conta primeiro.",
      true
    );
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
    showStatus(
      "Erro ao salvar perfil: " + error.message,
      true
    );
    return;
  }

  showStatus("Perfil atualizado com sucesso!");

  await updateAccountView();
}

// ========================================
// SAIR DA CONTA
// ========================================

async function signOut() {
  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    showStatus(
      "Erro ao sair: " + error.message,
      true
    );
    return;
  }

  currentUser = null;

  showStatus("Você saiu da sua conta.");

  await updateAccountView();
}

// ========================================
// EVENTOS E BOTÕES
// ========================================

document.querySelectorAll("[data-quiz]").forEach(card => {
  card.addEventListener("click", () => {
    openQuiz(card.dataset.quiz);
  });
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

// Atualizar a interface quando o login mudar.
supabaseClient.auth.onAuthStateChange(() => {
  setTimeout(() => {
    updateAccountView();
  }, 0);
});

// Carregar a conta ao iniciar o site.
updateAccountView();

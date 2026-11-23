const quizData={
 logica:{title:"Lógica & padrões",items:[
  {q:"Qual número completa a sequência: 3, 6, 12, 24, ...?",a:["30","36","48","52"],c:2,why:"Cada termo é o dobro do anterior: 24 × 2 = 48."},
  {q:"Ana é mais alta que Bia. Bia é mais alta que Carla. Quem é a mais baixa?",a:["Ana","Bia","Carla","Não é possível saber"],c:2,why:"A ordem é Ana > Bia > Carla; portanto, Carla é a mais baixa."},
  {q:"Se todos os Z são Y e nenhum Y é X, o que necessariamente é verdade?",a:["Todo X é Z","Nenhum Z é X","Alguns Z são X","Todo Y é Z"],c:1,why:"Como Z está contido em Y e Y não tem elementos X, Z também não tem elementos X."}
 ]},
 geral:{title:"Conhecimentos gerais",items:[
  {q:"Qual é o maior planeta do Sistema Solar?",a:["Terra","Saturno","Júpiter","Netuno"],c:2,why:"Júpiter é o maior planeta do Sistema Solar."},
  {q:"Qual oceano banha o litoral brasileiro?",a:["Índico","Atlântico","Pacífico","Ártico"],c:1,why:"O Brasil tem sua costa voltada para o Oceano Atlântico."},
  {q:"Qual gás as plantas absorvem principalmente durante a fotossíntese?",a:["Oxigênio","Nitrogênio","Gás carbônico","Hidrogênio"],c:2,why:"Na fotossíntese, as plantas utilizam dióxido de carbono, água e luz."}
 ]},
 psico:{title:"Mente & comportamento",items:[
  {q:"O que descreve o viés de confirmação?",a:["Buscar apenas dados numéricos","Favorecer informações que apoiam crenças existentes","Esquecer eventos recentes","Mudar de opinião a cada conversa"],c:1,why:"O viés de confirmação é a tendência de procurar ou interpretar informações em favor de crenças prévias."},
  {q:"O que é metacognição?",a:["Pensar sobre os próprios processos de pensamento","Memorizar sem compreender","Imitar o comportamento de outras pessoas","Reagir sem avaliar"],c:0,why:"Metacognição envolve monitorar e refletir sobre como pensamos e aprendemos."},
  {q:"Uma lembrança muito vívida é necessariamente exata?",a:["Sim, sempre","Somente se for recente","Não; confiança não garante precisão","Sim, se houver emoção"],c:2,why:"A vividez e a confiança de uma lembrança não garantem que todos os detalhes sejam precisos."}
 ]},
 decisao:{title:"Decisão & estratégia",items:[
  {q:"Ao comparar duas opções com riscos diferentes, o que ajuda mais?",a:["Considerar apenas o melhor cenário","Ignorar as chances de perda","Avaliar probabilidades, consequências e objetivos","Escolher a opção mais rápida"],c:2,why:"Uma boa decisão considera chances, possíveis perdas e o que importa para a pessoa."},
  {q:"Qual atitude ajuda a reduzir decisões impulsivas?",a:["Decidir sob pressão sempre que possível","Definir critérios antes de escolher","Ignorar informações contrárias","Evitar comparar alternativas"],c:1,why:"Critérios definidos previamente ajudam a avaliar opções com mais consistência."},
  {q:"Se uma hipótese não combina com novas evidências confiáveis, o que é mais racional?",a:["Descartar as evidências","Manter a hipótese por orgulho","Reavaliar a hipótese","Procurar apenas opiniões iguais"],c:2,why:"O pensamento crítico exige revisar hipóteses quando surgem evidências relevantes."}
 ]}
};
let active=null,index=0,score=0,chosen=null,locked=false;
const $=id=>document.getElementById(id);
function openQuiz(key){active=quizData[key];index=0;score=0;renderQuestion();$('quizModal').classList.add('open');$('quizModal').setAttribute('aria-hidden','false')}
function renderQuestion(){const item=active.items[index];chosen=null;locked=false;$('quizCategory').textContent=active.title.toUpperCase();$('questionCount').textContent=`PERGUNTA ${index+1} DE ${active.items.length}`;$('progressBar').style.width=`${index/active.items.length*100}%`;$('questionText').textContent=item.q;$('answers').innerHTML='';$('feedback').textContent='';$('nextQuestion').disabled=true;$('nextQuestion').textContent='Confirmar resposta';item.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.onclick=()=>{if(locked)return;chosen=i;document.querySelectorAll('.answer').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('nextQuestion').disabled=false};$('answers').appendChild(b)})}
$('nextQuestion').onclick=()=>{if(!locked){if(chosen===null)return;locked=true;const item=active.items[index];if(chosen===item.c)score++;$('feedback').textContent=(chosen===item.c?'Resposta correta! ':'Vamos aprender: ')+item.why;document.querySelectorAll('.answer').forEach((b,i)=>{b.disabled=true;if(i===item.c)b.classList.add('selected')});$('nextQuestion').textContent=index===active.items.length-1?'Ver resultado':'Próxima pergunta'}else{index++;if(index<active.items.length)renderQuestion();else finishQuiz()}};
function finishQuiz(){const percent=Math.round(score/active.items.length*100);$('questionCount').textContent='DESAFIO CONCLUÍDO';$('progressBar').style.width='100%';$('questionText').textContent=`Você acertou ${score} de ${active.items.length}!`;$('answers').innerHTML=`<div class="feedback">Seu aproveitamento foi de ${percent}%. Continue praticando para evoluir.</div>`;$('feedback').textContent='';$('nextQuestion').textContent='Fechar resultado';$('nextQuestion').disabled=false;locked=true;$('nextQuestion').onclick=()=>{$('quizModal').classList.remove('open');$('nextQuestion').onclick=defaultNext;saveResult(active.title,score,active.items.length);};}
const defaultNext=$('nextQuestion').onclick;
function saveResult(title,correct,total){let history=JSON.parse(localStorage.getItem('nq_history')||'[]');history.unshift({title,correct,total,date:new Date().toLocaleDateString('pt-BR')});localStorage.setItem('nq_history',JSON.stringify(history.slice(0,20)))}
document.querySelectorAll('[data-quiz]').forEach(card=>card.addEventListener('click',()=>openQuiz(card.dataset.quiz)));
$('closeQuiz').onclick=()=>$('quizModal').classList.remove('open');
$('accountBtn').onclick=()=>{$('accountModal').classList.add('open');$('displayName').value=localStorage.getItem('nq_name')||'';renderHistory()};
$('closeAccount').onclick=()=>$('accountModal').classList.remove('open');
$('saveProfile').onclick=()=>{const name=$('displayName').value.trim();if(!name){$('profileStatus').textContent='Digite seu nome para salvar.';return}localStorage.setItem('nq_name',name);$('profileStatus').textContent=`Perfil local salvo. Olá, ${name}!`};
function renderHistory(){const h=JSON.parse(localStorage.getItem('nq_history')||'[]');$('profileHistory').innerHTML='<b>Seu histórico neste dispositivo</b><br>'+(h.length?h.map(x=>`${x.date} — ${x.title}: ${x.correct}/${x.total}`).join('<br>'):'Você ainda não concluiu nenhum quiz.')}

const fs=require('fs');
const L=require('./lib.js');
const {d,P,H1,H2,H3,B,N,brk,tbl,callout,gap,png,caption,hdrftr,hdrftrLand,styles,numbering,cover,NAVY,BLUE,LIGHT,PORTRAIT_W:W,LAND_W:LW}=L;
const {Document,Packer,PageOrientation,Paragraph,TextRun,AlignmentType}=d;
const {V}=require('./data.js'); const {S}=require('./steps.js');
const IMG="/home/user/PM-system/docs/entregas/img/";
const obj=t=>P("**Objetivo desta seção:** "+t,{after:160,color:"333333"});
const c=[];
// ---------- Capa
c.push(...cover("Novo Sistema de Gestão e Medição de Serviços (SLA)","Documentação do processo para validação do Itaú",[
 ["Cliente","Itaú"],["Processo","Gestão e Medição de Serviços (SLA)"],["Sistema que será substituído","Thanos"],["Elaborado por","N1 IT | Grupo Stefanini"],["Versão","1.0 – para validação"],["Data","Outubro de 2026"],["Prazo de conclusão do projeto","29/01/2027"]],"Confidencial | Uso restrito ao Itaú e à Stefanini"));
c.push(brk());
// ---------- Como ler
c.push(H1("Como ler este documento"));
c.push(obj("ajudar você a ler o documento do jeito mais rápido, sem precisar de uma reunião de apresentação."));
c.push(P("Este documento explica como funcionará o novo sistema que vai substituir o Thanos. Ele foi escrito para pessoas de negócio e de tecnologia. Você pode lê-lo do começo ao fim ou ir direto ao que precisa."));
c.push(tbl(["Se você quer…","Leia a seção"],[
 ["Entender em uma página o que muda","1. Resumo executivo"],
 ["Conferir o significado de um termo ou sigla","2. Glossário"],
 ["Ver o que melhora em relação ao Thanos","3. Como é hoje x como será"],
 ["Ver o desenho do novo processo","4. Novo fluxograma"],
 ["Entender cada etapa em detalhe","5. Passo a passo"],
 ["Ver um caso real de ponta a ponta","6. Exemplo prático"],
 ["Saber quais sistemas se conectam","7. Integrações"],
 ["Conferir segurança, desempenho e auditoria","8. Requisitos não funcionais"],
 ["Saber como será a troca do Thanos","9. Migração e convivência"],
 ["Saber o que o Itaú precisa fazer e quando","10. Cronograma e 13. Pontos para validação"],
 ["Conhecer os riscos e o que faremos","11. Riscos"],
 ["Ver premissas, limites e pontos abertos","12. Premissas, restrições e pontos em aberto"],
 ["Aprovar o fluxo","14. Validação e aceite"]],[5200,4438],{firstColBold:true}));
c.push(gap());
c.push(callout("O que pedimos ao Itaú",[
 "1. Ler as seções 4 e 5 e confirmar se o fluxo representa o processo desejado.",
 "2. Responder aos **pontos para validação** (seção 13) até **19/11/2026**.",
 "3. Assinar o aceite (seção 14) ou registrar ressalvas."]));
c.push(gap());
c.push(P("**Convenções:** os passos do fluxo têm numeração de 1 a 24. A mesma numeração aparece no fluxograma (seção 4) e no passo a passo (seção 5). Os pontos para validação têm a sigla **V** e um número (por exemplo, V9).",{size:20}));
c.push(brk());
// ---------- 1 Resumo
c.push(H1("1. Resumo executivo"));
c.push(obj("mostrar em uma página o que é o novo sistema, por que o Thanos será substituído e o que muda para o Itaú."));
c.push(H3("O que é"));
c.push(P("O novo sistema registra falhas na execução de serviços contratados, avisa o fornecedor, acompanha o tratamento e calcula a pontuação mensal dos fornecedores. Ele faz o mesmo trabalho do Thanos, com mais controle e sem planilhas paralelas."));
c.push(H3("Por que substituir o Thanos"));
c.push(B("O envio automático de e-mail ao fornecedor às vezes falha, e o Itaú precisa avisar manualmente."));
c.push(B("Consultas e relatórios demoram, e faltam filtros importantes."));
c.push(B("A pontuação mensal depende de Excel (PROCV e tabela dinâmica), o que gera retrabalho e risco de erro."));
c.push(B("Ocorrências podem ser encerradas sem motivo ou evidência, e ocorrências abertas ficam fora da medição sem aviso."));
c.push(H3("O que muda para o Itaú"));
c.push(tbl(["Hoje","No novo sistema"],[
 ["E-mail pode falhar sem ninguém saber","Cada notificação tem status (enviado, entregue, falhou), reenvio automático e alerta"],
 ["Encerramento sem motivo","Motivo, evidência e responsável obrigatórios"],
 ["Ocorrências abertas esquecidas","Lembretes e painel de ocorrências abertas e vencidas"],
 ["Pontuação em Excel","Pontuação calculada pelo sistema, com histórico"],
 ["Log técnico, difícil de ler","Histórico em linguagem de negócio: quem, quando, o que mudou e por quê"]],[4300,5338],{firstColBold:true}));
c.push(gap(100));
c.push(tbl(["Quadro-resumo",""],[
 ["Prazo","Conclusão em **29/01/2027**"],
 ["Entrada em produção (proposta)","21/01/2027, com convivência com o Thanos até 29/01/2027"],
 ["Fluxo proposto","24 passos em 4 fases: acesso, registro, tratamento e medição"],
 ["Primeira data para o Itaú","**19/11/2026**: devolver a validação do fluxo e os pontos da seção 13"]],[3000,6638],{firstColBold:true}));
c.push(brk());
// ---------- 2 Glossário
c.push(H1("2. Glossário"));
c.push(obj("explicar os termos e as siglas usados neste documento, em ordem alfabética."));
const G=[
["Ação de gestão","Decisão da Gestão de Serviços sobre um fornecedor após a análise mensal: nenhuma ação, orientação ou reunião, advertência, ajuste operacional, escalonamento ou processo de rescisão."],
["Aberta indevidamente","Status de uma ocorrência registrada por engano. Ela não conta na medição."],
["Alçada","Limite de decisão de uma pessoa ou cargo. Define quem pode aprovar cada ação."],
["Analista","Perfil de acesso que cadastra dados, abre, edita e encerra ocorrências."],
["Auditoria (trilha de)","Registro de quem fez o quê, quando e por quê, para consulta e conferência."],
["Categoria / Tipo / Item","Níveis que descrevem o serviço contratado. A categoria é o grupo maior, o tipo detalha e o item é o serviço específico em que a ocorrência é aberta."],
["Centro de Segurança","Equipe do Itaú que observa e registra desvios, principalmente de disponibilidade de postos."],
["Classificação de SLA","Gravidade do desvio (por exemplo, leve, moderada, grave ou gravíssima), conforme a matriz do Itaú."],
["Competência","Mês em que uma ocorrência conta na medição."],
["Convivência","Período em que o Thanos e o novo sistema existem ao mesmo tempo, durante a troca."],
["Data de corte","Dia em que o sistema fecha o mês e congela os dados para calcular a pontuação."],
["Encerramento","Ato de finalizar uma ocorrência depois de tratada, informando status final, motivo e evidência."],
["Evidência","Prova de que algo aconteceu ou foi resolvido (foto, e-mail, documento, registro)."],
["Fornecedor","Empresa contratada pelo Itaú que presta o serviço e recebe as notificações."],
["Gestão de Serviços","Área do Itaú que analisa a pontuação mensal e decide as ações de gestão."],
["Gestor / aprovador","Perfil de acesso que aprova pedidos de acesso e pode executar funções administrativas."],
["Go-live","Dia em que o novo sistema entra em uso real."],
["Homologação","Fase de testes em que o Itaú confere se o sistema funciona como combinado, antes de ir para produção."],
["ID","Número único que identifica cada ocorrência."],
["Integração","Ligação entre o novo sistema e outro sistema ou fonte de dados."],
["LGPD","Lei Geral de Proteção de Dados. Regula o uso de dados pessoais."],
["Log","Registro automático das ações feitas no sistema."],
["Medição","Cálculo mensal da pontuação dos fornecedores a partir das ocorrências finalizadas."],
["Notificação","E-mail enviado ao fornecedor para informar uma ocorrência."],
["Novo sistema","Sistema que substituirá o Thanos neste projeto."],
["Ocorrência","Registro de um desvio na execução de um serviço contratado."],
["Operador","Perfil de acesso que registra ocorrências."],
["Perfil de acesso","Conjunto de permissões de uma pessoa no sistema: Operador, Analista ou Gestor."],
["Plano de ação","Combinado para corrigir o desvio. Cada ocorrência tem um status do plano de ação."],
["Polo","Local ou prédio onde o serviço é prestado. É identificado pelo RGI."],
["Pontuação","Nota calculada por fornecedor, com base nas ocorrências finalizadas e na tabela contratual."],
["Posto","Posição de serviço dentro de um polo, como uma portaria."],
["Produção","Ambiente real de uso do sistema."],
["Quadro de saúde do fornecedor","Visão resumida da pontuação e das ocorrências de cada fornecedor."],
["Rascunho","Versão ainda não salva de um preenchimento. O novo sistema a guarda automaticamente."],
["Rescisão","Encerramento do contrato com o fornecedor."],
["RGI","Registro Geral de Imóvel. No processo, identifica de forma única cada prédio ou polo."],
["Rollback","Volta ao estado anterior (neste caso, voltar a usar o Thanos) se houver problema grave."],
["SLA","Service Level Agreement (acordo de nível de serviço). Define o padrão de serviço que o fornecedor deve cumprir."],
["SSO / login corporativo","Entrada no sistema com o mesmo acesso usado nos demais sistemas do Itaú."],
["Status","Situação da ocorrência, como Aberta, Finalizada ou Aberta indevidamente."],
["Thanos","Sistema atual do Itaú para gestão e medição de serviços (SLA)."],
["Stefanini (N1 IT | Grupo Stefanini)","Empresa que constrói, implanta e sustenta o novo sistema."],
];
c.push(tbl(["Termo","Significado"],G.map(g=>[g[0],g[1]]),[2800,6838],{firstColBold:true,size:18}));
c.push(brk());
// ---------- 3 Comparativo
c.push(H1("3. Como é hoje x como será"));
c.push(obj("comparar, ponto a ponto, o Thanos de hoje com o novo sistema e mostrar o ganho de cada mudança."));
c.push(P("A tabela segue a ordem do processo. Itens marcados com **V** dependem da confirmação do Itaú na seção 13."));
const CMP=[
["Pedido de acesso","Formulário fora do sistema; um ponto focal cadastra o pedido.","Pedido feito no próprio sistema, com aprovação do gestor e histórico (V10).","Menos etapas e acesso rastreável."],
["Cadastros (polos, itens, fornecedores)","Cadastros em vários lugares. Erro de grafia impede cargas.","Listas controladas, validação antes de salvar e carga em lote assistida (V13, V15).","Menos retrabalho e dados padronizados."],
["Abertura da ocorrência","Pessoa preenche; sessão cai em 30 minutos sem aviso e perde o texto.","Rascunho automático, aviso antes de expirar e campos obrigatórios claros (V24).","Nenhum preenchimento perdido."],
["Notificação ao fornecedor","Robô envia e-mail; pode falhar sem erro. Itaú avisa manualmente e controla em planilha.","Status do envio, reenvio automático (até 3 vezes) e alerta ao responsável (V6).","Fornecedor sempre avisado, com prova."],
["Correção de fornecedor","Corrigir não reenvia o aviso. É preciso encerrar e abrir outra ocorrência.","Correção com reenvio controlado e aviso de desconsideração ao fornecedor anterior (V8).","Menos ocorrências duplicadas."],
["Acompanhamento","Sem lembretes efetivos. Ocorrências abertas ficam esquecidas.","Lembretes por e-mail e painel de ocorrências abertas e vencidas (V1, V4).","Nada fica parado sem ninguém ver."],
["Encerramento","Pode encerrar sem motivo ou evidência.","Motivo, evidência, responsável e data obrigatórios (V2).","Histórico claro e confiável."],
["Permissões","Perfis amplos: quem tem permissão edita ou fecha ocorrência de outra pessoa.","Edição e encerramento por responsável, com justificativa nas exceções (V11).","Menos alteração indevida."],
["Consulta e filtros","Telas lentas; faltam filtros por período, código, prédio e outros.","Filtros por período, ID, polo, prédio, categoria, tipo, item, fornecedor, status e responsável, com paginação.","Resposta rápida e busca completa."],
["Histórico (log)","Existe, mas é técnico e difícil de ler.","Histórico em linguagem de negócio: quem, quando, o quê, antes e depois.","Auditoria acessível."],
["Medição e pontuação","Exportação para Excel, PROCV e tabela dinâmica.","Cálculo no sistema, com tabela de pontuação por contrato e vigência (V16, V17).","Fim da planilha paralela e menos erro."],
["Ocorrências abertas na medição","Só ocorrências finalizadas entram; as abertas somem da análise.","Só as finalizadas pontuam, mas as abertas aparecem em lista no fechamento (V18).","Decisão com visão completa."],
["Comparação entre fornecedores","Baseada no volume total de ocorrências.","Também por posto, efetivo e criticidade (V19).","Comparação mais justa."],
["Controles paralelos","E-mail, Excel e filas próprias.","Tudo no sistema: notificação, pendência e histórico.","Uma única fonte de verdade."],
["Dados pessoais de terceiros","Ficam no campo livre de observação.","Campos próprios e protegidos, com o mínimo necessário (V12).","Aderência à LGPD."],
["Sustentação","Funções deixaram de funcionar por falta de manutenção.","Sustentação com responsável, canal e prazos acordados (V22).","Sistema mantido e evoluído."]];
c.push(tbl(["Ponto","Como é hoje (Thanos)","Como será (novo sistema)","Ganho"],CMP,[1700,2700,3338,1900],{firstColBold:true,size:17}));
c.push(brk());
// ---------- 4 Fluxograma (landscape section after)
const sec1=c.splice(0); // portrait pages so far
// landscape part
const f=[];
f.push(H1("4. Novo fluxograma do processo"));
f.push(obj("mostrar, em desenho, como o processo funcionará no novo sistema. O desenho tem 24 passos numerados, decisões, exceções e a indicação de quem faz cada etapa (Itaú, Stefanini, fornecedor ou sistema)."));
f.push(P("Primeiro vem a visão geral. Depois, cada fase aparece em detalhe. Os números dos passos são os mesmos do texto da seção 5."));
f.push(png(IMG+"fluxo_macro.png",690));
f.push(caption("Figura 1 – Visão geral: quatro fases do processo."));
f.push(png(IMG+"legenda.png",600));
f.push(caption("Figura 2 – Legenda dos símbolos."));
f.push(brk());
f.push(png(IMG+"fluxo_a.png",500));
f.push(caption("Figura 3 – Fase A: acesso ao sistema (passos 1 a 3)."));
f.push(P("Esta fase é feita uma vez por pessoa. Quem já tem acesso começa a partir da fase B.",{size:19}));
f.push(brk());
f.push(png(IMG+"fluxo_b.png",880));
f.push(caption("Figura 4 – Fase B: registro da ocorrência e notificação ao fornecedor (passos 4 a 13)."));
f.push(brk());
f.push(png(IMG+"fluxo_c.png",840));
f.push(caption("Figura 5 – Fase C: tratamento, correção e encerramento (passos 13 a 18). Os quadros tracejados mostram ações automáticas do sistema."));
f.push(brk());
f.push(png(IMG+"fluxo_d.png",900));
f.push(caption("Figura 6 – Fase D: medição mensal e ação de gestão (passos 19 a 24)."));
f.push(H3("Quem faz o quê"));
f.push(tbl(["Responsável","Passos","Papel no processo"],[
 ["Itaú – Solicitante e Gestor aprovador","1, 2","Pede e aprova acessos."],
 ["Itaú – Operação (Centro de Segurança, Analista, Gestor)","4 a 8, 14 a 18","Identifica o desvio, registra, acompanha, corrige e encerra."],
 ["Itaú – Gestão de Serviços","21 a 24","Analisa a pontuação e decide a ação de gestão."],
 ["Fornecedor","13","Recebe a notificação, trata e responde."],
 ["Novo sistema (automático)","3, 9 a 11, 19, 20","Salva, notifica, confere entrega, fecha o período e calcula."],
 ["Stefanini – Sustentação","12 (e apoio ao sistema)","Investiga falhas de envio e mantém o sistema funcionando."]],[5000,2500,7638],{firstColBold:true}));
// portrait part 2
const g=[];
g.push(H1("5. Passo a passo de cada etapa"));
g.push(obj("explicar cada passo do fluxograma, com a mesma numeração: o que acontece, quem faz, o que entra, o que sai e o que ocorre em caso de erro ou exceção."));
g.push(P("Cada quadro tem o número e o nome do passo, igual ao fluxograma. A linha “Ponto a validar” indica onde o Itaú precisa confirmar uma regra na seção 13."));
const phaseName={A:"Fase A – Acesso",B:"Fase B – Registro e notificação","B/C":null,C:"Fase C – Tratamento e encerramento",D:"Fase D – Medição mensal"};
let lastPh="";
S.forEach(s=>{
  const ph=s[3]==="B/C"?"B":s[3];
  if(ph!==lastPh){ g.push(H2(phaseName[ph])); lastPh=ph; }
  g.push(tbl([`Passo ${s[0]} – ${s[1]}`],[
   ["Quem faz",s[2]],["O que acontece",s[4]],["O que entra",s[5]],["O que sai",s[6]],["Se houver erro ou exceção",s[7]],["Ponto a validar",s[8]]],[2400,7238],{firstColBold:true,size:18,hspan:true}));
  g.push(gap(120));
});
// ---------- 6 Exemplo
g.push(brk());
g.push(H1("6. Exemplo prático de ponta a ponta"));
g.push(obj("mostrar um caso do dia a dia percorrendo todo o fluxo, do início ao fim, incluindo duas exceções."));
g.push(callout("Aviso",["Os nomes, datas e pontos abaixo são fictícios e servem só para ilustrar. A pontuação real depende da tabela contratual do Itaú (V17)."]));
g.push(gap());
g.push(P("**Situação:** em 12/01/2027, às 02h40, o Centro de Segurança nota que o posto de portaria da Torre B do Polo Exemplo está sem profissional. O serviço é prestado pelo Fornecedor Exemplo A."));
g.push(tbl(["Quando","Passo","O que acontece"],[
 ["Dez/2026","1 a 3","Marina, analista do Itaú, pede acesso como Analista. O gestor aprova. O sistema libera o acesso com o login corporativo."],
 ["12/01 02h40","4","João, do Centro de Segurança, vê que o posto está vazio e tem a imagem da câmera como prova."],
 ["12/01 02h45","5, 6","João abre uma ocorrência e escolhe polo, categoria “Postos” e item “Portaria Torre B”. O item está ativo."],
 ["12/01 02h50","8","João classifica o desvio como “Grave”, descreve o fato e anexa a imagem. O sistema não deixa salvar sem a descrição."],
 ["12/01 02h52","9","O sistema salva e gera o ID 2027-000123."],
 ["12/01 02h52","10, 11","O sistema envia o e-mail ao Fornecedor Exemplo A. O primeiro envio não tem entrega confirmada."],
 ["12/01 03h07","12","**Exceção 1:** o sistema reenviou o e-mail e a segunda tentativa foi entregue. O responsável recebe aviso do reenvio e o histórico registra as duas tentativas."],
 ["12/01 08h00","13","O fornecedor lê a notificação, manda um profissional ao posto e responde por e-mail."],
 ["12/01 09h30","14, 15","Marina registra o retorno. Ao conferir, percebe que o posto pertence ao Fornecedor Exemplo B."],
 ["12/01 09h40","16","**Exceção 2:** Marina corrige o fornecedor e informa o motivo. O sistema avisa o Fornecedor A de que a ocorrência foi desconsiderada e notifica o Fornecedor B. O histórico guarda o antes e o depois."],
 ["13/01 10h00","13, 14","O Fornecedor B responde com a escala corrigida."],
 ["14/01","17, 18","Marina confirma que o motivo foi tratado, anexa a escala como evidência e encerra a ocorrência com status Finalizada."],
 ["31/01 (corte)","19, 20","O sistema fecha o mês. A ocorrência 2027-000123 entra na pontuação do Fornecedor B. O sistema lista duas ocorrências ainda abertas, que não pontuam. Para este exemplo, o Fornecedor B soma 12 pontos."],
 ["Início de fev","21 a 24","A Gestão de Serviços analisa o quadro. Pela tabela fictícia, 12 pontos pedem “orientação formal”. A ação é aprovada, registrada e comunicada ao fornecedor. O ciclo termina."]],[1500,1000,7138],{size:18}));
// ---------- 7 Integrações
g.push(brk());
g.push(H1("7. Integrações com sistemas e fontes de dados do Itaú"));
g.push(obj("listar os sistemas e as fontes de dados com que o novo sistema se conectará e explicar para que serve cada ligação."));
g.push(P("Uma integração evita digitar a mesma informação duas vezes e reduz erros. A coluna “Situação” mostra o que já está claro e o que o Itaú precisa confirmar."));
g.push(tbl(["Integração","Para que serve","O que troca","Situação"],[
 ["Login corporativo (SSO)","Entrar com o acesso usado no Itaú e aplicar os perfis.","Identidade do usuário e perfil.","A confirmar (V26)"],
 ["Serviço de e-mail","Enviar notificações, lembretes e avisos, e saber se foram entregues.","E-mail enviado; retorno de entrega.","Em uso no Thanos; a confirmar o remetente (V26)"],
 ["Cadastro oficial de RGI, polos e postos","Usar uma única fonte para prédios, polos e postos.","Lista de polos, RGI, torres, andares e postos.","A confirmar (V13)"],
 ["Cadastro de fornecedores e contratos","Preencher fornecedor, destinatários e tabela de pontuação por contrato.","Fornecedores, contatos, contratos e vigência.","A confirmar (V7, V13, V17)"],
 ["Cadastro de pessoas e documentos de terceiros","Relacionar pessoa, posto e documento quando a ocorrência for de documentação.","Dados mínimos de terceiros.","Depende do escopo de terceiros (V12)"],
 ["Teams (opcional)","Enviar lembretes além do e-mail.","Mensagem de lembrete.","Opcional; a confirmar"],
 ["Relatórios e exportação","Levar dados para os relatórios e para a análise da Gestão de Serviços.","Dados de ocorrências e pontuação.","A confirmar a ferramenta"],
 ["Repositório de logs do Itaú","Guardar o histórico de auditoria no padrão do Itaú.","Registros de auditoria.","A confirmar (V21)"],
 ["Thanos (origem da migração)","Ler os cadastros e o histórico para levar ao novo sistema.","Cadastros e ocorrências.","Necessário para a migração (V29)"],
 ["Monitoração de equipamentos e câmeras","Abrir ocorrências automaticamente no futuro.","—","Fora desta entrega"]],[2300,3000,2200,2138],{firstColBold:true,size:17}));
// ---------- 8 NFR
g.push(brk());
g.push(H1("8. Requisitos não funcionais"));
g.push(obj("explicar, em linguagem simples, como o sistema deve se comportar em segurança, desempenho, disponibilidade e auditoria, além de funcionar corretamente."));
g.push(P("As metas abaixo são **propostas da Stefanini** e precisam da confirmação do Itaú. Onde o Itaú já tiver um padrão, o padrão do Itaú prevalece."));
g.push(tbl(["Tema","O que significa","Meta proposta"],[
 ["Segurança de acesso","Só pessoas autorizadas entram. Cada pessoa vê e faz só o que seu perfil permite.","Login corporativo; perfis Operador, Analista e Gestor; revisão periódica dos acessos."],
 ["Sessão","O sistema não deixa o acesso aberto sem uso e não faz a pessoa perder o trabalho.","Expira em 30 minutos sem uso, com aviso 5 minutos antes e rascunho salvo (V24)."],
 ["Proteção dos dados","Os dados ficam protegidos quando trafegam e quando estão guardados.","Criptografia em trânsito e em repouso; dados pessoais só nos campos próprios (V12)."],
 ["Aderência às políticas do Itaú","O sistema segue as regras de segurança, privacidade e terceiros do Itaú.","Revisão das políticas aplicáveis na fase de desenho e teste de segurança antes da entrada em produção."],
 ["Desempenho","As telas respondem rápido, mesmo com ocorrências finalizadas.","Consultas e telas em até 3 segundos em 95% dos acessos, com o volume histórico migrado."],
 ["Capacidade","O sistema aguenta o volume atual e o crescimento.","Volume a levantar com o Itaú; teste de carga em homologação."],
 ["Disponibilidade","O sistema está no ar quando as pessoas precisam.","99,5% por mês, em dias úteis, das 7h às 20h (a confirmar)."],
 ["Cópia de segurança e recuperação","Se algo der errado, os dados voltam.","Cópia diária; recuperação em até 4 horas e perda máxima de dados de 24 horas (a confirmar)."],
 ["Logs e auditoria","Tudo que importa fica registrado e é fácil de ler.","Quem, quando, o quê, antes e depois e motivo, em tela amigável; retenção pelo prazo do Itaú (V21)."],
 ["Entrega de e-mails","As notificações chegam e há prova disso.","Status por e-mail, 3 tentativas e alerta em caso de falha (V6)."],
 ["Facilidade de uso","Fácil para quem usa pouco o sistema.","Telas em português, campos obrigatórios claros e funciona nos navegadores corporativos do Itaú."],
 ["Sustentação","Alguém cuida do sistema depois da entrega.","Responsável, canal, horários e prazos de atendimento acordados (V22)."]],[2200,3800,3638],{firstColBold:true,size:17}));
// ---------- 9 Migração
g.push(brk());
g.push(H1("9. Estratégia de migração e convivência com o Thanos"));
g.push(obj("explicar como a Stefanini levará os dados do Thanos ao novo sistema, como os dois sistemas conviverão e como o Thanos será desligado, sem interromper o trabalho do Itaú."));
g.push(H3("Etapas da migração"));
g.push(tbl(["Etapa","O que será feito","Quando (proposta)"],[
 ["1. Preparação","Mapear os dados do Thanos, limpar inconsistências e definir o que migrar (V29).","Nov/2026"],
 ["2. Cadastros","Levar polos, categorias, tipos, itens, fornecedores e regras de SLA.","Dez/2026"],
 ["3. Ensaios","Fazer duas cargas de teste e conferir os totais com o Itaú.","Dez/2026 a jan/2027"],
 ["4. Corte","Congelar o Thanos para novos registros e fazer a carga final: histórico e ocorrências abertas.","20 a 21/01/2027"],
 ["5. Convivência","Novas ocorrências só no novo sistema. O Thanos fica somente para consulta.","21 a 28/01/2027"],
 ["6. Desligamento","Itaú aprova, o Thanos é desligado e seus dados são arquivados.","29/01/2027"]],[2200,5238,2200],{firstColBold:true}));
g.push(H3("Como os dois sistemas convivem"));
g.push(tbl(["Assunto","Regra proposta"],[
 ["Novas ocorrências","Só no novo sistema, a partir do go-live. O Thanos não recebe mais registros."],
 ["Ocorrências abertas no Thanos","Migradas na carga final e encerradas no novo sistema (V29)."],
 ["Consulta ao histórico","Consulta no Thanos durante a convivência e no novo sistema, para o que foi migrado."],
 ["Medição de dezembro/2026","Recalculada no novo sistema e comparada com a planilha atual. As diferenças são explicadas ao Itaú antes do aceite."],
 ["Notificações","Passam a sair apenas do novo sistema."],
 ["Acessos","Usuários do Thanos recebem acesso no novo sistema antes do go-live, por perfil."]],[3000,6638],{firstColBold:true}));
g.push(H3("Se algo der errado (volta ao Thanos)"));
g.push(P("Se houver falha grave nos primeiros cinco dias úteis, o Itaú e a Stefanini decidem juntos voltar a usar o Thanos. Por isso o Thanos só é desligado depois do aceite do Itaú. Os critérios de volta serão acordados na homologação."));
g.push(callout("Atenção ao prazo",["A convivência tem apenas oito dias entre o go-live (21/01) e o desligamento (29/01). O primeiro fechamento mensal real do novo sistema só acontece no fim de janeiro. Por isso a medição de dezembro será recalculada em paralelo. Confirme este desenho no ponto V30."],W,"B7791F","FFF6E0"));
// ---------- 10 Cronograma
g.push(brk());
g.push(H1("10. Cronograma macro até 29/01/2027"));
g.push(obj("mostrar as grandes etapas do projeto até 29/01/2027 e destacar as datas em que o Itaú precisa validar ou fornecer informações."));
g.push(P("As datas são propostas e devem ser confirmadas na validação. Linhas em destaque exigem ação do Itaú."));
const Y="FFF3CD";
const CR=[
 ["05/11/2026","Envio desta documentação ao Itaú","Stefanini",false],
 ["19/11/2026","**Itaú devolve a validação do fluxo e as respostas dos pontos da seção 13**","Itaú",true],
 ["26/11/2026","**Itaú entrega os insumos:** destinatários por fornecedor, matriz de classificação, tabela de pontuação, cadastros oficiais, acessos aos ambientes e contatos técnicos","Itaú",true],
 ["30/11/2026","Aceite do fluxo e congelamento do escopo","Itaú e Stefanini",true],
 ["30/11 a 18/12","Construção, etapa 1: acesso, cadastros, ocorrência e notificação","Stefanini",false],
 ["21/12/2026","Demonstração da etapa 1 e **validação intermediária do Itaú**","Itaú",true],
 ["04/01 a 15/01/2027","Construção, etapa 2: tratamento, encerramento, medição, relatórios e migração","Stefanini",false],
 ["12/01 a 20/01/2027","**Homologação pelo Itaú** com ocorrências reais de amostra","Itaú",true],
 ["20 a 21/01/2027","Carga final do Thanos e entrada em produção (go-live)","Stefanini e Itaú",false],
 ["21 a 28/01/2027","Convivência e operação assistida; recálculo da medição de dezembro","Stefanini e Itaú",false],
 ["28/01/2027","**Itaú aprova o desligamento do Thanos**","Itaú",true],
 ["29/01/2027","Encerramento do projeto e desligamento do Thanos","Stefanini e Itaú",false]];
g.push(tbl(["Data","Marco ou atividade","Responsável"],CR.map(r=>[r[0],r[1],r[2]]),[2000,5638,2000],{size:18,fills:CR.map(r=>r[3]?[Y,Y,Y]:[null,null,null])}));
g.push(gap(100));
g.push(P("**Atenção:** o fim do ano reduz a disponibilidade de pessoas. Pedimos que o Itaú indique, até 19/11, quem valida e aprova durante o recesso de fim de ano.",{size:20}));
// ---------- 11 Riscos
g.push(brk());
g.push(H1("11. Riscos"));
g.push(obj("apresentar os principais riscos do projeto, o impacto de cada um e como responderemos: mitigar (reduzir), aceitar, transferir ou evitar."));
g.push(P("**Probabilidade e impacto:** A = alto, M = médio, B = baixo."));
const R=[
["R1","O prazo é curto (cerca de 13 semanas) para o escopo.","A / A","Mitigar","Entregar por etapas, congelar o escopo em 30/11 e tratar o que não for essencial como evolução."],
["R2","Atraso do Itaú em validações e insumos.","A / A","Mitigar","Datas de marco no cronograma, lembretes e escalonamento ao gestor do Itaú."],
["R3","Regras ainda não confirmadas (status, encerramento, pontuação).","M / A","Mitigar","Seção 13 com prazo de resposta e reunião de esclarecimento, se preciso."],
["R4","Dados do Thanos com erros ou duplicidades.","M / M","Mitigar","Limpeza prévia, duas cargas de teste e conferência de totais."],
["R5","Liberação tardia de acessos, ambientes e integrações (login, e-mail, cadastros).","M / A","Transferir","Responsabilidade do Itaú, com contato técnico indicado até 26/11. Sem a liberação, o prazo da integração se move."],
["R6","Provedor de e-mail bloqueia ou atrasa mensagens.","M / M","Mitigar","Remetente oficial do Itaú, testes de entrega e alerta de falha."],
["R7","Fornecedores demoram a responder ou resistem ao novo e-mail.","M / B","Aceitar","Comunicação do Itaú aos fornecedores e lembretes automáticos. O risco é aceito, pois depende do fornecedor."],
["R8","Convivência curta e primeiro fechamento só após 29/01.","A / M","Mitigar","Recalcular dezembro/2026 em paralelo e comparar com a planilha atual."],
["R9","Pessoas-chave indisponíveis no recesso de fim de ano.","M / M","Aceitar","Indicar substitutos até 19/11. Se faltarem, o cronograma é revisto."],
["R10","Dependência de uma só pessoa do Itaú para as regras.","M / M","Mitigar","Nomear um segundo validador e registrar as decisões."],
["R11","Dados pessoais de terceiros fora do padrão da LGPD.","M / A","Mitigar","Campos próprios, mínimo necessário e validação com Privacidade do Itaú (V12)."],
["R12","Lentidão com o volume histórico.","B / A","Mitigar","Teste de carga em homologação e ajuste antes do go-live."],
["R13","Falha de serviços de terceiros (hospedagem, e-mail).","B / A","Transferir","Prazos de atendimento acordados em contrato com os provedores."],
["R14","Pedidos novos fora do escopo durante o projeto.","M / M","Evitar","Controle de mudanças: cada pedido é avaliado e, se aprovado, entra por escopo e prazo acordados."]];
g.push(tbl(["#","Risco","Prob. / Impacto","Resposta","Plano"],R,[600,3000,1100,1100,3838],{size:17}));
// ---------- 12 Premissas
g.push(brk());
g.push(H1("12. Premissas, restrições e pontos em aberto"));
g.push(obj("registrar as condições assumidas, os limites do projeto e o que ainda não está definido, para que todos partam do mesmo entendimento."));
g.push(H3("Premissas (o que consideramos verdadeiro)"));
["O processo desenhado representa o que foi demonstrado nas reuniões de 29 e 30/09/2026.","O Itaú indicará validadores com autoridade para decidir.","Os cadastros e as regras de pontuação serão fornecidos até 26/11/2026.","O Itaú liberará acessos e ambientes a tempo.","O Itaú fornecerá o login corporativo e o serviço de e-mail.","As datas e as metas deste documento são propostas até a aprovação do Itaú."].forEach(t=>g.push(B(t)));
g.push(H3("Restrições (o que limita o projeto)"));
["Prazo final de 29/01/2027.","Fim de ano com menos pessoas disponíveis.","Itens fora do escopo desta entrega: módulo de atendimento técnico, detecção automática por câmeras e integração com sistemas de terceiros (V23).","Itens que só entram se o Itaú confirmar e o prazo permitir: módulo de ocorrências por pessoa (documentação de terceiros) e indicadores comparáveis avançados (V12, V19)."].forEach(t=>g.push(B(t)));
g.push(H3("Pontos em aberto"));
g.push(P("Todos os pontos em aberto estão na seção 13, numerados de V1 a V"+V.length+". Eles definem o fluxo final."));
// ---------- 13 Pontos
g.push(brk());
g.push(H1("13. Pontos para validação do Itaú"));
g.push(obj("listar as decisões e regras que o Itaú precisa confirmar. Para cada ponto, mostramos a proposta da Stefanini."));
g.push(P("**Como responder:** escreva Concordo, Ajustar (com o ajuste) ou Outra decisão na última coluna. **Prazo: 19/11/2026.**"));
g.push(tbl(["#","Tema","Proposta da Stefanini","O que o Itaú precisa confirmar","Passos","Resposta do Itaú"],
 V.map((v,i)=>["V"+(i+1),v[0],v[1],v[2],v[3],""]),[560,1450,2550,2550,880,1648],{size:16}));
// ---------- 14 Aceite
g.push(brk());
g.push(H1("14. Validação e aceite"));
g.push(obj("registrar a decisão do Itaú sobre o fluxo apresentado neste documento."));
g.push(P("Ao assinar, o Itaú declara que leu as seções 4 e 5 e que o fluxo representa o processo desejado, com as ressalvas indicadas abaixo e as respostas aos pontos da seção 13."));
g.push(H3("Decisão"));
g.push(P("☐ Aprovado        ☐ Aprovado com ressalvas        ☐ Não aprovado"));
g.push(H3("Ressalvas"));
const lines=[]; for(let i=0;i<6;i++) lines.push([" "]);
g.push(tbl(null,lines,[9638],{size:26}));
g.push(H3("Assinaturas"));
const sig=(who)=>[["**"+who+"**","",""],["Nome:","",""],["Cargo / área:","",""],["Assinatura:","",""],["Data:","",""]];
g.push(tbl(["Itaú","Responsável 1","Responsável 2"],[["Nome","",""],["Cargo / área","",""],["Assinatura","",""],["Data","",""]],[2200,3719,3719],{firstColBold:true,size:20}));
g.push(gap(160));
g.push(tbl(["Stefanini","Responsável 1","Responsável 2"],[["Nome","",""],["Cargo / área","",""],["Assinatura","",""],["Data","",""]],[2200,3719,3719],{firstColBold:true,size:20}));
const first=hdrftr("Novo Sistema de Gestão e Medição de Serviços (SLA)","Confidencial | Itaú e Stefanini");
const doc=new Document({styles,numbering,creator:"N1 IT | Grupo Stefanini",title:"Novo Sistema de Gestão e Medição de Serviços (SLA)",sections:[
 {properties:{page:{size:{width:11906,height:16838},margin:{top:1300,bottom:1134,left:1134,right:1134}}},...first,children:sec1},
 {properties:{page:{size:{width:11906,height:16838,orientation:PageOrientation.LANDSCAPE},margin:{top:1100,bottom:900,left:850,right:850}}},...hdrftrLand("Novo Sistema de Gestão e Medição de Serviços (SLA)","Confidencial | Itaú e Stefanini"),children:f},
 {properties:{page:{size:{width:11906,height:16838},margin:{top:1300,bottom:1134,left:1134,right:1134}}},...first,children:g}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("/home/user/PM-system/docs/entregas/Documentacao_Novo_Sistema_SLA_Itau.docx",b);console.log("ok")});

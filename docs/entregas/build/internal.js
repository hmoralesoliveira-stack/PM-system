const fs=require('fs');
const L=require('./lib.js');
const {d,P,H1,H2,H3,B,N,brk,tbl,callout,gap,png,caption,hdrftr,hdrftrLand,styles,numbering,cover,PORTRAIT_W:W,LAND_W:LW}=L;
const {Document,Packer,PageOrientation}=d;
const {V}=require('./data.js');
const IMG="/home/user/PM-system/docs/entregas/img/";
const SEV={A:"FDE2E0",M:"FFF3CD",B:"E6F4EA"};
const c=[];
c.push(...cover("Relatório interno de validação","Análise do documento As Is e do fluxograma do Thanos",[
 ["Documento analisado","Documento As Is – Gestão e Medição de Serviços (SLA) – SIGMES, versão 1.0, outubro de 2026 (10 páginas)"],
 ["Base do levantamento","Reuniões de 29 e 30/09/2026; key user: Eduardo Dalben Pozze"],
 ["Finalidade","Alinhamento da equipe Stefanini. Não enviar ao Itaú."],
 ["Data da análise","28/10/2026"],
 ["Projeto","Substituição do Thanos – conclusão prevista em 29/01/2027"]],"Confidencial | Uso interno Stefanini"));
c.push(brk());
// 1 Parecer
c.push(H1("1. Parecer geral"));
c.push(P("**Objetivo:** dar à equipe uma visão rápida da qualidade do As Is e dos riscos de construir o novo sistema sobre ele."));
c.push(P("**Conclusão:** o As Is é bom como levantamento de dores e regras (23 regras de negócio e 24 pendências já listadas), mas **ainda não está validado**. Dá para desenhar o fluxo novo, desde que as decisões abertas sejam confirmadas pelo Itaú até 19/11/2026. Construir antes disso traz risco alto de retrabalho."));
c.push(tbl(["Critério","Avaliação","Resumo"],[
 ["Completo","Parcial","Faltam volumes, tabela de pontuação, matriz de classificação, lista de status, campos da ocorrência, layout do e-mail e inventário de integrações."],
 ["Coerente","Parcial","Há divergências entre o texto (pág. 4–5) e a figura (pág. 6), e sobre quem encerra a ocorrência."],
 ["Atualizado","Sim, com ressalva","É de outubro/2026 e retrata o processo demonstrado, mas o próprio documento diz que não foi validado (pág. 8 e 10)."],
 ["Pronto para desenhar o To Be","Condicional","Depende das decisões V3, V9, V16, V17 e V18 (seção 4)."]],[2400,1800,5438],{firstColBold:true}));
c.push(gap());
c.push(callout("Os 5 pontos mais urgentes",[
 "1. **O que é o Thanos?** O As Is chama o sistema de SIGMES “hospedado na plataforma Thanos” (pág. 1) e nunca cita o Power Automate. A figura (pág. 6) usa “Sistema Signes/Thanos”. Confirmar a arquitetura real antes de planejar a migração.",
 "2. **Quem encerra a ocorrência?** O texto diz que é o responsável interno (pág. 5, etapa 13 e RN-13). A figura mostra o fornecedor “atualizando/finalizando” (pág. 6).",
 "3. **Regra de pontuação ausente.** Não há pesos, faixas nem exemplos (RN-17, RN-18; PV-17).",
 "4. **Status e classificação sem lista.** “Finalizada”, “aberta indevidamente”, “leve a gravíssima” e “status do plano de ação” não estão definidos (RN-06, RN-16; PV-03, PV-09).",
 "5. **Competência da medição.** Corte, competência e reabertura não existem (PV-16)."],W,"B42318","FDECEA"));
c.push(gap());
c.push(P("**Como ler a numeração de página:** as páginas citadas são as do PDF (1 a 10). O PDF não tem número impresso nas páginas."));
// landscape findings
const f=[];
f.push(H1("2. Validação do documento atual: achados"));
f.push(P("**Objetivo:** listar lacunas, inconsistências, regras ambíguas e pontos que dependem de confirmação, com a página de cada trecho. **Severidade:** A = alta (bloqueia o desenho ou o prazo), M = média, B = baixa."));
const F=[
["I-01","Inconsistência","1, 4, 6","“SIGMES, hospedado na plataforma Thanos” (pág. 1); raia “Sistema Signes/Thanos” (pág. 6); “índices de banco” (pág. 4); “robô” (pág. 7)","O PDF nunca cita o Power Automate. Os termos Thanos, SIGMES e “Signes” aparecem como se fossem a mesma coisa. Descreve um sistema com banco de dados, logs e módulos, não só um fluxo.","Confirmar o que existe hoje: plataforma, banco, onde roda o robô de e-mail, quem o mantém. Padronizar o nome.","A"],
["I-02","Inconsistência","5, 6","Etapa 13: “Responsável interno… encerrar a ocorrência” (pág. 5); RN-13 (pág. 7). Figura: fornecedor “Atualizar/finalizar ocorrência” (pág. 6)","Texto e figura discordam sobre quem finaliza. O papel do fornecedor diz só “recebimento por e-mail” (pág. 2).","Definir se o fornecedor acessa o sistema. Assumimos que não (V5).","A"],
["I-03","Inconsistência","6","Figura: seta tracejada de “Notificar via e-mail” (fornecedor) para “Extrair relatório mensal” (Gestão de Serviços)","A figura liga a resposta do fornecedor ao início da extração mensal. No texto (etapa 14, pág. 5) a extração é mensal e feita pela Gestão. Falta um evento de início por tempo.","Corrigir no To Be: início mensal por data de corte (passo 19).","M"],
["I-04","Inconsistência","5, 6","Etapas 5 e 8 (pág. 5) x raias da figura (pág. 6)","Na figura, “Classificar SLA e preencher observação” e “Notificar fornecedor por e-mail” (manual) estão na raia do Sistema. O texto os atribui ao Usuário.","Padronizar raias no To Be.","M"],
["I-05","Inconsistência","5, 6, 8, 9","Etapa 16–17 (pág. 5): inclui “ajuste operacional”; RN-18 (pág. 8); PV-19 cita “perda de postos” (pág. 10). Figura: 4 saídas, sem “ajuste operacional” e com “Escalonamento/Rescisão” juntos","O gateway “O resultado exige ação?” não existe na figura. Há um gateway sem rótulo (“Ação com Fornecedor”). Os conjuntos de ações dos três trechos não coincidem.","Fechar a lista de ações com o Itaú (V20).","M"],
["I-06","Lacuna","4, 6","Seção 4.1, fluxo de acesso (pág. 4)","O fluxo de acesso está no texto, mas não na figura. Aparece o “ponto focal”, que não está nos papéis (pág. 2). Quando recusado, não há aviso ao solicitante. Revisão e revogação de acesso não existem (PV-10).","Incluir fase de acesso no To Be (passos 1–3).","M"],
["I-07","Inconsistência","4–5, 8","Etapa 3–4 (pág. 4); RN-20 “itens inativos deixam de aparecer” (pág. 8)","Se itens inativos não aparecem na lista, a pessoa não “seleciona” o item para depois descobrir que está inativo. A lógica da decisão (etapa 4) não bate com RN-20.","No To Be, o sistema só lista itens ativos e oferece “pedir cadastro” (passos 6–7).","B"],
["I-08","Ambiguidade","7","RN-05: “Evita que um fornecedor classifique diretamente ocorrência contra outro fornecedor” (pág. 7)","A frase supõe que fornecedores registram ocorrências. Os papéis dizem que fornecedor só recebe e trata (pág. 2).","Confirmar se algum fornecedor acessa o sistema (V5).","M"],
["I-09","Lacuna","5, 7","Etapa 5: “classificação de SLA, status do plano de ação” (pág. 5); RN-06 (pág. 7)","Os valores de classificação (leve, moderada, grave, gravíssima) e de “status do plano de ação” dependem de um “de-para” que não está no documento.","Obter a matriz completa (V9; PV-09).","A"],
["I-10","Lacuna","7, 8","RN-13, RN-15, RN-16 (pág. 7); PV-03 (pág. 8)","“Status final”, “finalizada” e “aberta indevidamente” são usados sem lista de status. Não se sabe se “indevida” é um tipo de “finalizada”.","Obter a lista e o efeito de cada status (V3).","A"],
["I-11","Inconsistência","3, 4, 7","Oportunidade “Gestão de pendências”: “Independente das pendencias resolvidas ou não, ter as pontuações validas com o histórico” (pág. 3). RN-15: só finalizadas entram (pág. 7)","A frase da pág. 3 parece fora de contexto, contém erro de digitação e contradiz RN-15 se for lida ao pé da letra (pontuar mesmo aberta).","Confirmar a intenção. Assumimos RN-15 e lista de abertas no fechamento (V18).","A"],
["I-12","Ambiguidade","7","RN-11 e RN-16 (pág. 7); PV-08 (pág. 9)","“Solicitar desconsideração quando aplicável”: a quem, como e em que prazo? Não se diz se a ocorrência “indevida” entra na medição.","Definir o procedimento (V8).","M"],
["I-13","Lacuna","5, 7, 9","Etapa 14 “Mensalmente” (pág. 5); RN-15 (pág. 7); PV-16 (pág. 9)","Sem data de corte, regra de competência, reabertura ou tratamento de ocorrência encerrada após o corte. Fato em um mês e encerramento em outro: qual mês pontua?","Definir com o Itaú (V16).","A"],
["I-14","Lacuna","8, 9","RN-17, RN-18 (pág. 8); PV-17 (pág. 9)","Não há tabela de pontuação, pesos, faixas, vigência nem exemplo de cálculo. A ação de gestão depende de “faixas contratuais vigentes”.","Obter a tabela por contrato (V17).","A"],
["I-15","Lacuna","3–5","Dor 2 “vários minutos” (pág. 3); “Dor 1”; oportunidades de desempenho (pág. 4)","Não há números: ocorrências por mês, fornecedores, usuários, polos, itens, tamanho do histórico, tempo real das telas, taxa de falha de e-mail. Sem isso não dá para fixar metas de desempenho e capacidade.","Pedir os volumes ao Itaú e medir o Thanos.","A"],
["I-16","Lacuna","4, 7, 9","“Base única e integrações” (pág. 4); RN-02, RN-03 (pág. 6); PV-13 (pág. 9)","Não há inventário de sistemas: e-mail (qual serviço), login, fonte do RGI, cadastro de fornecedores, Teams, relatórios.","Levantar com a arquitetura do Itaú (V13, V26).","A"],
["I-17","Lacuna","6, 7","RN-02 “carga horária” (pág. 6); RN-03 (pág. 6)","A hierarquia polo, prédio, torre, andar, posto e local e o papel da “carga horária” não estão explicados.","Pedir modelo de dados e exemplos reais.","M"],
["I-18","Lacuna","7","RN-09, RN-10 (pág. 7)","Não há modelo do e-mail, lista de campos da ocorrência, nem como se tratam anexos e evidências (que aparecem em RN-05 e na Dor 5).","Pedir o e-mail atual e o formulário de ocorrência.","M"],
["I-19","Lacuna (compliance)","3, 10","Dor 8 “Dados pessoais e documentos ficam nas observações” (pág. 3); PV-12 (pág. 10)","Risco de LGPD. Não há regra sobre quais dados, quem vê e por quanto tempo.","Envolver Privacidade/Jurídico do Itaú (V12, V21).","A"],
["I-20","Lacuna","6–8","Nenhum trecho","Não há fluxo para o fornecedor contestar uma ocorrência, nem para a ausência de resposta, e-mail inválido, ocorrência duplicada ou ausência do responsável.","Incluímos contestação no To Be (V31). Confirmar se o processo existe.","A"],
["I-21","Ambiguidade","3","Dor 1: “pode não apresentar erro e ainda assim não entregar o e-mail” (pág. 3)","A causa da falha não foi investigada (robô, serviço de e-mail, antispam). Sem causa, o novo sistema pode repetir o problema.","Pedir logs e um caso real de falha.","A"],
["I-22","Ambiguidade","3","Dor 4: “não há lembretes efetivos” (pág. 3)","Não se sabe se existem lembretes que não funcionam ou se não existem.","Confirmar o que existe hoje.","B"],
["I-23","Dependência","7, 8","RN-14 (pág. 7); RN-20 (pág. 8); PV-11","Permissões amplas “criadas para investigação” e regras de inativação cujo efeito sobre ocorrências abertas não está definido.","Definir segregação de funções (V11) e efeito da inativação (V14).","M"],
["I-24","Lacuna","2, 8–9","Papéis (pág. 2); PV-10, PV-14 (pág. 9)","“Administrador do SIGMES” e “Gestão de Acessos” aparecem nas pendências, mas não nos papéis. “Responsável interno” (etapas 10–13) não é papel definido.","Fechar a lista de papéis (V1, V11).","M"],
["I-25","Inconsistência","2, 3–4","Escopo “Redesenho To Be… fora” (pág. 2); seção 3 e “hub” (págs. 3–4, 10)","A seção 3 já propõe solução. O termo “hub” (“métricas dentro do hub”, “novo hub”) não é definido. A seção 3 não liga cada oportunidade a uma dor. Quase tudo é “Alta”.","Usar a seção 3 só como insumo. Definir “hub”.","B"],
["I-26","Dependência","8, 10","RN-23 (pág. 8); PV-22 (pág. 10)","Módulo de atendimento técnico “construído, mas não usado”, com “sistema próprio do fornecedor” sem identificação.","Confirmar como fora de escopo (V23).","B"],
["I-27","Dependência","10","Roteiro (pág. 10); Fontes (pág. 10); PV-24","Só duas gravações de reunião e nenhuma amostra real. O fluxo nunca foi testado com casos reais. O key user é uma só pessoa.","Planejar homologação com amostra real (V25).","A"],
["I-28","Forma","1, 4, 10","Capa e rodapés (págs. 1–10); etapa 2 “7.” (pág. 4); roteiro “8–12” (pág. 10)","Sem histórico de versões, aprovadores ou data de validação. A numeração continua erradamente entre listas. PDF sem número de página.","Corrigir se o As Is for reenviado.","B"],
["I-29","Dependência","2–3, 9–10","Dor 15 (pág. 3); PV-21 (pág. 10)","Não se sabe quem mantém o Thanos hoje nem quem será o dono do novo produto. Impacta migração e desligamento.","Confirmar o dono e a equipe de suporte (V22).","M"],
["I-30","Dependência","8–9","RN-19, PV-15 (págs. 8–9)","A carga em lote “existe, mas não é confiável”. Não se sabe se entra no escopo nem qual é o formato.","Definir escopo (V15).","M"],
["I-31","Lacuna","—","Nenhum trecho","Não há dados para migração: quanto histórico, formato, qualidade, ocorrências abertas e regra de desligamento do Thanos.","Definir com o Itaú (V29, V30).","A"],
];
f.push(tbl(["ID","Tipo","Pág.","Trecho citado","Problema","Ação sugerida","Sev."],F.map(r=>r),[620,1250,720,3350,4300,3950,948],{size:15,hsize:16,fills:F.map(r=>[null,null,null,null,null,null,SEV[r[6]]])}));
f.push(gap(120));
f.push(H2("2.1 Resumo dos achados"));
const cnt=k=>F.filter(r=>r[6]===k).length;
f.push(tbl(["Severidade","Quantidade"],[["Alta",String(cnt("A"))],["Média",String(cnt("M"))],["Baixa",String(cnt("B"))],["Total",String(F.length)]],[3000,2000],{firstColBold:true}));
f.push(H2("2.2 Pendências do As Is (PV-01 a PV-24) e como serão tratadas"));
f.push(P("O As Is lista 24 pendências (págs. 8–10). Quase todas viram ponto para validação do Itaú no documento enviado ao cliente."));
const PV=[["PV-01","Responsável pelo acompanhamento","V1"],["PV-02","Critério de encerramento","V2"],["PV-03","Status e efeitos","V3, V18"],["PV-04","Prazo para encerramento","V4"],["PV-05","Retorno do fornecedor","V5"],["PV-06","Confirmação de entrega do e-mail","V6"],["PV-07","Lista de destinatários","V7"],["PV-08","Procedimento de correção","V8"],["PV-09","Matriz de classificação","V9"],["PV-10","Critérios de acesso","V10"],["PV-11","Segregação de funções","V11"],["PV-12","Dados pessoais","V12"],["PV-13","Cadastro mestre e fonte oficial","V13"],["PV-14","Governança cadastral","V14"],["PV-15","Carga em lote","V15"],["PV-16","Periodicidade e corte","V16"],["PV-17","Tabela de pontuação","V17"],["PV-18","Indicadores normalizados","V19"],["PV-19","Aprovação das ações de gestão","V20"],["PV-20","Retenção e histórico","V21"],["PV-21","Sustentação","V22"],["PV-22","Escopo do atendimento técnico","V23"],["PV-23","Timeout e segurança","V24"],["PV-24","Amostra de validação","V25"]];
f.push(P("Pontos novos que a Stefanini acrescentou (V26 a V31): login e e-mail, hospedagem, papel da Stefanini, migração do histórico, desligamento do Thanos e contestação.",{after:100}));
f.push(tbl(["Pendência do As Is","Tema","Ponto para validação no documento do Itaú"],PV,[2600,6500,6038],{size:16}));
// portrait: flow analysis
const g=[];
g.push(H1("3. Análise do fluxograma original"));
g.push(P("**Objetivo:** avaliar etapas, decisões, integrações, entradas e saídas e tratamento de exceções do fluxo atual e apontar o que o novo sistema deve resolver."));
g.push(png(IMG+"thanos_as_is.jpg",620));
g.push(caption("Figura 1 – Fluxograma As Is (pág. 6 do documento original)."));
g.push(H2("3.1 O que o fluxograma contém"));
g.push(tbl(["Elemento","Quantidade e descrição"],[
 ["Piscinas e raias","2 piscinas: Processo 1 (raias Centro de Segurança/Analista, Sistema Signes/Thanos, Gestão de Serviços) e Fornecedor."],
 ["Eventos","1 de início (“Ocorrência identificada”) e 1 de fim (“Ação da gestão registrada”). Não há evento de início mensal."],
 ["Atividades","16: acessar o sistema, selecionar polo/categoria/item, cadastrar/ativar item, classificar SLA, salvar, enviar e-mail automático, notificar por e-mail (manual), receber e tratar, atualizar/finalizar, notificar via e-mail, extrair relatório, aplicar PROCV, e 4 ações de gestão."],
 ["Decisões","4: item cadastrado e ativo; e-mail enviado; ocorrência tratada; ação com fornecedor (sem rótulo claro)."],
 ["Entradas e saídas","Entrada: fato observado. Saída: ação de gestão registrada. As entradas e saídas de cada etapa não aparecem na figura. Estão só no texto (págs. 4–5)."],
 ["Integrações","Só duas: e-mail automático e Excel (manual). Cadastro mestre e log existem no texto, mas não na figura."],
 ["Exceções tratadas","3: item inativo, falha de e-mail e ocorrência não tratada (fica aberta)."]],[2400,7238],{firstColBold:true,size:18}));
g.push(H2("3.2 Divergências entre figura e texto"));
g.push(P("Ver achados I-02 a I-06 da seção 2. Resumo: quem finaliza, raias de duas atividades, seta do fornecedor para o relatório, gateway de ação sem rótulo e fluxo de acesso ausente."));
g.push(H2("3.3 Gargalos"));
["**Notificação:** quando o e-mail falha, tudo para até alguém avisar manualmente, e não há prova de entrega.","**Cadastro de item:** sem item ativo não se abre a ocorrência. Depende do Analista ou do Gestor, sem prazo.","**Fornecedor sem prazo:** o laço “ocorrência tratada? Não” não tem limite de tempo nem lembrete.","**Fechamento mensal:** depende de extração, PROCV e tabela dinâmica feitas à mão.","**Desempenho:** telas e consultas levam minutos (Dor 2, pág. 3).","**Abertura individual:** documentos de terceiros são registrados um a um (Dor 9)."].forEach(t=>g.push(B(t)));
g.push(H2("3.4 Redundâncias"));
["Notificação automática e manual, com controle paralelo.","Dados digitados no sistema e de novo em Excel, e-mail e filas próprias (Dor 14).","Correção de fornecedor por encerramento e nova abertura (RN-11).","Cadastros em vários lugares com padronização manual (Dor 11).","Extração e consolidação mensal que o sistema poderia calcular."].forEach(t=>g.push(B(t)));
g.push(H2("3.5 Etapas manuais"));
g.push(tbl(["Etapa","Manual hoje","No novo fluxo"],[
 ["Notificação em caso de falha (etapa 8)","Sim","Reenvio automático e alerta (passos 11–12)"],
 ["Controle paralelo de notificações","Sim (planilha e e-mail)","Status dentro do sistema"],
 ["Extração mensal (etapa 14)","Sim","Fechamento automático (passo 19)"],
 ["PROCV e tabela dinâmica (etapa 15)","Sim","Cálculo automático (passo 20)"],
 ["Correção de fornecedor","Sim (encerrar e abrir outra)","Correção com reenvio (passo 16)"],
 ["Lembrete de pendência","Não existe efetivo","Lembretes automáticos (passo 14)"],
 ["Cadastro e carga em lote","Parcialmente manual","Carga assistida (passo 7)"]],[4000,2400,3238],{size:18}));
g.push(H2("3.6 Exceções que o fluxo atual não cobre"));
["Dado errado na ocorrência (além de fornecedor).","Contestação do fornecedor.","Fornecedor que não responde.","E-mail inválido ou sem destinatário.","Responsável ausente.","Sessão expirada no meio do preenchimento (Dor 12).","Ocorrência aberta no dia do corte e encerrada depois.","Reabertura de ocorrência finalizada.","Ocorrência duplicada.","Recusa de acesso comunicada ao solicitante."].forEach(t=>g.push(B(t)));
g.push(H2("3.7 Limitações da plataforma atual que o novo sistema deve resolver"));
g.push(callout("Atenção",["A tabela abaixo mistura evidências do As Is com limitações **conhecidas do Power Automate**, que usamos como hipótese porque o PDF não confirma a plataforma (achado I-01). Validar com a equipe que mantém o Thanos antes de usar em reunião."],W,"B7791F","FFF6E0"));
g.push(gap(80));
g.push(tbl(["Limitação","Evidência no As Is ou hipótese","Como o novo sistema responde"],[
 ["Falha silenciosa de fluxos e de e-mail","Dor 1 (pág. 3). Hipótese: fluxo falha sem alerta e envia por conta ou conector sujeito a limites.","Fila de notificações com status, tentativas e alertas; remetente corporativo."],
 ["Dependência de conexão de uma pessoa","Hipótese: conexões em nome de um usuário expiram e quebram o fluxo.","Conta de serviço e monitoramento."],
 ["Histórico de execução curto","Hipótese: o histórico de execuções fica poucos dias. Dificulta investigar o que aconteceu.","Auditoria própria e retenção definida pelo Itaú."],
 ["Consultas e filtros lentos","Dores 2 e 3 (pág. 3). Hipótese: limites de listas e de consulta.","Banco de dados com índices, paginação e filtros."],
 ["Regras de cálculo difíceis de manter","Dor 13 (pág. 3). Pontuação em Excel.","Pontuação parametrizada por contrato e vigência."],
 ["Sessão e rascunho","Dor 12; RN-21 (págs. 3, 8).","Aviso, renovação e rascunho automático."],
 ["Sem dono e sem evolução","Dor 15; PV-21 (págs. 3, 10).","Sustentação com dono, canal e prazos."],
 ["Dados pessoais em campo livre","Dor 8; PV-12.","Campos próprios, mínimos e protegidos."]],[2600,3800,3238],{size:17}));
g.push(H2("3.8 Dores do As Is e como o novo fluxo as resolve"));
g.push(tbl(["Dor (pág. 3)","Resposta no novo fluxo","Passos"],[
 ["1 Instabilidade no e-mail","Status, reenvio automático e alerta","10 a 12"],
 ["2 e 3 Lentidão e filtros","Filtros completos e paginação (requisito)","Todos"],
 ["4 Abertas fora dos indicadores","Lembretes, painel e lista de abertas no fechamento","14, 17, 19, 21"],
 ["5 Encerramento sem justificativa","Motivo e evidência obrigatórios","18"],
 ["6 Permissões amplas","Edição e encerramento pelo responsável; exceções justificadas","14 a 18"],
 ["7 Correção não reenvia","Reenvio controlado e aviso de desconsideração","15, 16"],
 ["8 e 9 Terceiros, abertura individual","Fora da entrega base; a confirmar (V12)","—"],
 ["10 e 11 Carga em lote e cadastros","Carga assistida e listas controladas (V15)","6, 7"],
 ["12 Timeout","Aviso e rascunho","5, 8"],
 ["13 Medição fora do sistema","Cálculo automático","19, 20"],
 ["14 Controles paralelos","Tudo no sistema","10 a 24"],
 ["15 Sem sustentação","Sustentação Stefanini (V22)","12"]],[3200,4838,1600],{size:17}));
g.push(H1("4. Decisões de desenho adotadas e riscos para o time"));
g.push(P("**Objetivo:** registrar as hipóteses que usamos no novo fluxo e que podem mudar com a resposta do Itaú."));
g.push(tbl(["Decisão adotada","Por quê","Se o Itaú discordar"],[
 ["O fornecedor não acessa o sistema; responde por e-mail","O As Is diz “recebimento por e-mail” (pág. 2)","Criar acesso ou link seguro para o fornecedor (V5). Aumenta o escopo."],
 ["Só ocorrências finalizadas pontuam","RN-15 (pág. 7)","Se abertas pontuarem, muda o passo 19 e o cálculo."],
 ["Competência = mês do encerramento","Sem regra no As Is; é o critério mais simples","Mudar o passo 19 (V16)."],
 ["3 tentativas de reenvio (5, 15 e 60 minutos)","Proposta nossa","Ajustar parâmetros (V6)."],
 ["Papel da Stefanini: sustentação e investigação de falhas de envio","Proposta nossa","Rever custos e equipe (V28)."],
 ["Go-live em 21/01 e desligamento em 29/01","A data de 29/01 não diz se é go-live ou desligamento","Se for go-live, não há convivência; se for desligamento, o prazo é muito apertado (V30)."],
 ["Módulo de terceiros, indicadores avançados e carga em lote ficam condicionados ao prazo","Média prioridade no As Is (pág. 4); prazo de 13 semanas","Se o Itaú exigir, replanejar ou reduzir outro escopo."]],[3400,2800,3438],{size:17}));
g.push(gap());
g.push(callout("Riscos de prazo",[
 "Restam cerca de 13 semanas até 29/01/2027, com recesso de fim de ano no meio.",
 "O primeiro fechamento mensal real no novo sistema ocorre depois do desligamento. Propusemos recalcular dezembro em paralelo.",
 "Sem as respostas do Itaú até 19/11/2026, o congelamento do escopo em 30/11 fica em risco."],W,"B42318","FDECEA"));
g.push(H1("5. Dúvidas a esclarecer com o Itaú"));
g.push(P("**Objetivo:** reunir as perguntas que precisam de resposta antes de concluir a documentação. Estão em ordem de prioridade."));
const Q=[
"**Plataforma e nomes:** o Thanos é o SIGMES? Roda em Power Automate, em banco próprio ou em outra plataforma? Quem o mantém? (I-01)",
"**Quem encerra a ocorrência:** o responsável interno ou o fornecedor? O fornecedor acessa o sistema? (I-02, V5)",
"**Pontuação:** podemos receber a tabela vigente de cada contrato, com um exemplo de cálculo real? (V17)",
"**Status e classificação:** qual a lista completa de status e a matriz de severidade? (V3, V9)",
"**Medição:** qual a data de corte e a regra de competência? Ocorrências abertas pontuam? (V16, V18)",
"**Prazo final:** 29/01/2027 é entrada em produção ou desligamento do Thanos? (V30)",
"**Volumes:** quantas ocorrências por mês, fornecedores, usuários, polos e itens, e qual o tamanho do histórico? (I-15)",
"**Integrações:** qual o serviço de login, o serviço de e-mail e a fonte oficial de RGI, polos e fornecedores? (V13, V26)",
"**E-mail:** qual a causa conhecida das falhas e qual o modelo do e-mail atual? (I-21, I-18)",
"**Dados pessoais:** quais dados de terceiros podem ser registrados e por quanto tempo? Privacidade já foi envolvida? (V12, V21)",
"**Contestação e exceções:** existe processo quando o fornecedor discorda ou não responde? (V31)",
"**Amostra real:** quais três ocorrências reais usaremos para validar o fluxo? (V25)",
"**Pessoas:** quem valida pelo Itaú além do key user e quem substitui no recesso? (R9, R10)",
"**Escopo:** módulo de terceiros, carga em lote e indicadores avançados entram nesta entrega? (V12, V15, V19)",
"**Migração:** quanto histórico migrar e o que fazer com ocorrências abertas no corte? (V29)",
"**Hospedagem e segurança:** onde o sistema será hospedado e quais políticas do Itaú se aplicam? (V27)"];
Q.forEach(q=>g.push(N(q)));
g.push(H2("Próximos passos"));
["Alinhar este relatório com a equipe e fechar as dúvidas 1 a 6 em reunião rápida com o key user.","Revisar e enviar ao Itaú a documentação do novo sistema (arquivo separado).","Receber as respostas até 19/11/2026 e atualizar o fluxo e os passos.","Registrar o resultado das validações e congelar o escopo em 30/11/2026."].forEach(t=>g.push(B(t)));
const first=hdrftr("Relatório interno de validação – Thanos","Confidencial | Uso interno Stefanini");
const sp=(o)=>({page:{size:{width:11906,height:16838,...(o?{orientation:PageOrientation.LANDSCAPE}:{})},margin:o?{top:1100,bottom:900,left:850,right:850}:{top:1300,bottom:1134,left:1134,right:1134}}});
const doc=new Document({styles,numbering,creator:"N1 IT | Grupo Stefanini",title:"Relatório interno de validação – Thanos",sections:[
 {properties:sp(false),...first,children:c},
 {properties:sp(true),...hdrftrLand("Relatório interno de validação – Thanos","Confidencial | Uso interno Stefanini"),children:f},
 {properties:sp(false),...first,children:g}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("/home/user/PM-system/docs/entregas/Relatorio_Interno_Validacao_Thanos.docx",b);console.log("ok")});

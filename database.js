const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

//Criando uma função assíncrona
const criarBanco = async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  //Criando a tabela de incidentes

  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_problema TEXT,                              -- O que aconteceu (Buraco, Lixo, Luz...)
        localizacao TEXT,                                -- Onde aconteceu (Rua, Bairro)
        descricao TEXT,                                  -- Detalhes da reclamação
        prioridade TEXT,                                 -- Baixa, Média ou Alta   
        nome_solicitante TEXT,                           -- Quem está avisando
        data_registro TEXT,                              -- Data em formato (ex: 16/03 16.03)
        hora_registro TEXT,                              -- Hora que foi registrado
        status_resolucao TEXT DEFAULT 'Pendente'         -- O banco define automaticamente como 'Pendente'
    )
    `);

  console.log(
    "Banco de dados configurado: A tabela de registros urbanos está pronta!",
  );

  // ============================
  // Insert - C do CRUD - CREATE
  //=============================

  const checagem = await db.get(`SELECT COUNT (*) AS total FROM incidentes`);

  if (checagem.total === 0) {
    await db.exec(`
    INSERT INTO incidentes(tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro) VALUES
    ("Iluminação", "Rua das Flores, 123, Bairro das Margaridas", "Poste queimado há dias", "Média", "Ana Clara", "16/03/2026", "10:30"),
    ("Falta de energia", "Hospital JP2", "Local na escuridão", "Alta", "Antonio Perna Quebrada", " 16/03/2026", "22:15"),
    ("Vazamento de água", "Rua das Camélias, 52", "Vazamento de água constante próximo ao bueiro.", "Alta", "Julia Martins", "2026-03-16", "10:00"),
    ("Pavimentação", "Avenida C, Bairro D","Calçada em mau estado", "Alta", "Maria Oliveira","14/03/2026", "14:30"),
    ("Falta de água", "Rua T, 146, Jardim Imbarie", "Moradores sem água", "Alta", "Dona Fofoca", " 16/03/2026", "10:00")
    `);
  } else {
    console.log(`Banco pronto com ${checagem.total} de incidentes `);
  }

  // ============================
  // Select  - R do CRUD - READ
  // ============================

  const todosOsIncidentes = await db.all("SELECT * FROM incidentes");
  console.table(todosOsIncidentes);

  //Exemplo de SELECT específico

  const chamadosAna = await db.all(
    `SELECT * FROM incidentes WHERE nome_solicitante = "Ana Clara" `,
  );
  console.table(chamadosAna);

  // ============================
  // Update  - U do CRUD
  // ============================

  await db.run(`
  UPDATE incidentes
  SET status_resolucao = "Em Análise"
  WHERE data_registro = " 16/03/2026"
  `);

  console.log("Todos as reclamações do dia 16/03/2026 tiveram uma atualização");

  //UPDATE - Resolvido

  await db.run(`
  UPDATE incidentes
  SET status_resolucao = "Resolvido"
  WHERE tipo_problema = "Falta de energia"
  `);
  console.log("Problema do hospital resolvido");

  // ============================
  // Delete  - D do CRUD
  // ============================

  await db.run(`DELETE FROM incidentes WHERE id = 2 `);

  console.log("Registro do ID 2 removido");

  //DELETE condicional - Remover tudo que tem o Status da Resolução 'Resolvido' (Limpeza de banco)
  await db.run(`DELETE FROM incidentes WHERE status_resolucao = 'Resolvido'`);
  console.log("Registros de status 'Resolvido' foram removidos.");

  // ============================
  // Relatório/SELECT Fina
  // ============================

  //  console.log("Relatório Atualizado (FINAL)");

  const resultadoFinal = await db.all(`SELECT * FROM incidentes`);
  console.table(resultadoFinal);

  return db; //Retorna o banco (Entregando a chabe do banco pra alguém)
};

module.exports = { criarBanco }; //Cria uma ponte que permite compartilhar funções entre os arquivos
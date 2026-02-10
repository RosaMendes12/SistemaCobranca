import { useState, useEffect, useRef } from "react";
import api from "./services/api";
import "./App.css";
import axios from "axios";

function App() {
  //----> Função para criar a máscara de dinheiro e bloquear letras <----//
  const formatarMoeda = (valor) => {
    let v = valor.replace(/\D/g, ""); // Remove tudo que não é número (Bloqueia letras)
    if (!v) return ""; // Se o campo estiver vazio, retorna string vazia
    v = (Math.abs(v) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return v;
  };

  const [cobranca, setCobranca] = useState([]); // Armazena a lista de cobranças retornadas do backend
  const [pesquisa, setPesquisa] = useState(""); // Guarda o texto digitado para filtrar as cobranças

  //---> Função para buscar os dados do Backend <---//
  useEffect(() => {
    async function buscarCobrancas() {
      try {
        const resposta = await api.get("/cobranca"); // Chama o endpoint do backend
        setCobranca(resposta.data); // Coloca o que veio do banco na sua tela
      } catch (erro) {
        console.error(" Erro ao buscar:", erro);
      }
    }
    buscarCobrancas();
  }, []);

  const [nomeClienteInput, setNomeInput] = useState("");
  const [valorInput, setValorInput] = useState("");
  const [dataVencimentoInput, setVencimentoInput] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // ---  Criar as referências ---
  const valorRef = useRef(null);
  const dataRef = useRef(null);
  const botaoRef = useRef(null);

  // ---> Função para pular com Enter <--- //
  const pularFoco = (e, proximoCampo) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita que o formulário tente enviar sozinho
      proximoCampo.current.focus(); // Move o cursor
    }
  };

  const criarCobranca = async () => {
    // Nome do cliente obrigatório
    if (!nomeClienteInput.trim()) {
      alert("O nome do cliente é obrigatório.");
      return;
    }

    // Valor obrigatório
    if (!valorInput) {
      alert("O valor é obrigatório.");
      return;
    }
    // Remove a formatação e converte para número limpo para enviar ao backend
    const valorLimpo = parseFloat(
      valorInput.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );

    // Valor deve ser maior que zero
    if (isNaN(valorLimpo) || valorLimpo <= 0) {
      alert("Informe um valor válido maior que zero.");
      return;
    }

    // Data obrigatória
    if (!dataVencimentoInput) {
      alert("A data de vencimento é obrigatória.");
      return;
    }

    try {
      const novaCobranca = {
        nomeCliente: nomeClienteInput.trim(), // O trim() remove espaços extras
        valor: valorLimpo, // Enviando o número limpo para o backend
        dataVencimento: dataVencimentoInput,
        status: "PENDENTE",
      };

      //Envia os dados para o Backend via POST.
      const resposta = await api.post("/cobranca", novaCobranca);
      setCobranca([...cobranca, resposta.data]);

      //Limpa os campos do formulário para que fiquem vazios para o próximo cadastro.
      setNomeInput("");
      setValorInput("");
      setVencimentoInput("");
      setMostrarFormulario(false);

      //Feedback visual para o usuário
      alert("Cobrança salva com sucesso no banco!");
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert("Erro ao salvar. Verifique os valores.");
    }
  };
  //Atualizar o status da cobrança para PAGO
  const atualizarStatusCobranca = async (id) => {
    try {
      const resposta = await api.put(`/cobranca/${id}/pagar/`, {
        status: "PAGO",
      });

      // Atualiza o estado com o que veio do backend
      const listaAtualizada = cobranca.map((item) =>
        item.id === id ? resposta.data : item
      );

      setCobranca(listaAtualizada);
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro);
      alert("Não foi possível atualizar o status.");
    }
  };

  // Filtrar clientes
  const clientesFiltrados = cobranca
    .filter((item) => {
      const nome = (item.nomeCliente || "").trim().toLowerCase(); // O trim() remove espaços extras, e o toLowerCase() deixa tudo minúsculo para comparação
      const busca = pesquisa.trim().toLowerCase();
      return nome.startsWith(busca); //startsWith é mais rápido que includes,serve p/ buscar o cliente desde a primeira letra do início do nome
    })

    .sort((a, b) => (a.nomeCliente || "").localeCompare(b.nomeCliente || ""));
  // ------------------------------

  return (
    <>
      <h1>Sistema de Cobrança </h1>

      <div className="card">
        {/* Se mostrarFormulario for falso ( ! ), mostra o botão inicial */}
        {!mostrarFormulario ? (
          <button onClick={() => setMostrarFormulario(true)}>
            ➕ Nova Cobrança
          </button>
        ) : (
          /* Se for verdadeiro, mostra os campos para você digitar */
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={nomeClienteInput}
              onChange={(e) => setNomeInput(e.target.value)}
              // --- ADIÇÃO 3: Quando apertar Enter aqui, vai para o Valor ---
              onKeyDown={(e) => pularFoco(e, valorRef)}
            />

            <input
              ref={valorRef}
              type="text" // Mudei para text para a máscara funcionar
              placeholder="Valor R$ 0,00"
              value={valorInput}
              // Aplica a máscara e bloqueia letras ao mesmo tempo:
              onChange={(e) => setValorInput(formatarMoeda(e.target.value))}
              onKeyDown={(e) => pularFoco(e, dataRef)}
            />

            <input
              ref={dataRef}
              type="date"
              value={dataVencimentoInput}
              onChange={(e) => setVencimentoInput(e.target.value)}
              // --- Ao apertar Enter aqui, foca no botão de Salvar ---
              onKeyDown={(e) => pularFoco(e, botaoRef)}
            />
            <button ref={botaoRef} onClick={criarCobranca}>
              Salvar Cobrança
            </button>
            <button
              onClick={() => setMostrarFormulario(false)}
              style={{ backgroundColor: "gray" }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      {/* Campo de busca */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Buscar por nome do cliente..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      <div className="lista-container">
        {clientesFiltrados.map((item) => (
          <div
            key={item.id}
            className={`item-cobranca ${
              item.status === "PAGO" ? "status-pago" : "status-pendente"
            }`}
          >
            <p>
              <strong>Cliente:</strong> {item.nomeCliente}
            </p>
            <p>
              <strong>Valor:</strong>{" "}
              {Number(item.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <strong>Vencimento:</strong>{" "}
            {item.dataVencimento
              ? item.dataVencimento.split("-").reverse().join("/")
              : "Sem data"}
            <p>
              <strong>Status:</strong> {item.status}
            </p>
            {item.status === "PENDENTE" && (
              <button onClick={() => atualizarStatusCobranca(item.id)}>
                Marcar como PAGO
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="read-the-docs">
        Sistema de Cobrança | Desenvolvido por Rosa Mendes (React & Spring Boot)
      </p>
    </>
  );
}

export default App;

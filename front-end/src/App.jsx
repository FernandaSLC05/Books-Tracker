import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [livros, setLivros] = useState([])

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [paginas, setPaginas] = useState('')
  const [busca, setBusca] = useState('')

  // Estado para guardar a URL da capa que veio do Google
  const [capaUrl, setCapaUrl] = useState('')

  const [statusNovoLivro, setStatusNovoLivro] = useState('QUERO_LER')
  const [filtroAtual, setFiltroAtual] = useState('TODOS')

  function buscarLivros() {
    axios.get("http://localhost:8080/livros")
      .then(resposta => setLivros(resposta.data))
      .catch(erro => console.log(erro))
  }

  useEffect(() => {
    buscarLivros()
  }, [])

  function pesquisarNoGoogle(event) {
    event.preventDefault()
    if (!busca) return;

    axios.get(`http://localhost:8080/livros/buscar-google?titulo=${busca}`)
      .then(resposta => {
        if(resposta.data) {
            setTitulo(resposta.data.titulo)
            setAutor(resposta.data.autor)
            setPaginas(resposta.data.paginasTotais)

            // NOVO: Preenche o link da capa no estado oculto do formulário
            setCapaUrl(resposta.data.capaUrl)

            alert("✨ Livro encontrado! Verifique os dados abaixo e clique em Salvar.")
        } else {
            alert("Livro não encontrado no Google. Tente outro nome.")
        }
      })
      .catch(erro => {
        console.log("Erro ao buscar:", erro)
        alert("O Google não respondeu. Tente novamente mais tarde.")
      })
  }

  function salvarLivro(event) {
    event.preventDefault()

    const novoLivro = {
      titulo: titulo,
      autor: autor,
      paginasTotais: paginas,
      status: statusNovoLivro,
      formato: "FISICO",
      capaUrl: capaUrl // NOVO: Manda o link da capa para o Java salvar!
    }

    axios.post("http://localhost:8080/livros", novoLivro)
      .then(() => {
        alert("✅ Livro salvo com sucesso!")
        buscarLivros()

        // Limpa tudo, inclusive a capa oculta
        setTitulo('')
        setAutor('')
        setPaginas('')
        setBusca('')
        setCapaUrl('')
        setStatusNovoLivro('QUERO_LER')
      })
      .catch(erro => console.log(erro))
  }

  function deletarLivro(id) {
    if (window.confirm("Tem certeza que deseja excluir este livro da sua biblioteca?")) {
      axios.delete(`http://localhost:8080/livros/${id}`)
        .then(() => {
          alert("🗑️ Livro excluído com sucesso!")
          buscarLivros()
        })
        .catch(erro => console.log("Erro ao excluir:", erro))
    }
  }

  const livrosFiltrados = livros.filter(livro => {
    if (filtroAtual === 'TODOS') return true;
    return livro.status === filtroAtual;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>📚 Minha Biblioteca Inteligente</h1>

      {/* --- CAIXA DE PESQUISA DO GOOGLE --- */}
      <div style={{ background: '#2c3e50', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>🔍 Buscar automático no Google</h3>
        <form onSubmit={pesquisarNoGoogle} style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{ flex: 1, padding: '10px', borderRadius: '5px' }}
            placeholder="Ex: Percy Jackson, Solo Leveling..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <button type="submit" style={{ backgroundColor: '#f39c12', color: 'white', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '5px' }}>
            Buscar
          </button>
        </form>
      </div>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <div style={{ background: '#333', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>✏️ Dados do Livro</h3>
        <form onSubmit={salvarLivro} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>

          <input placeholder="Nome do Livro" value={titulo} onChange={e => setTitulo(e.target.value)} />
          <input placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} />
          <input placeholder="Total de Páginas" type="number" value={paginas} onChange={e => setPaginas(e.target.value)} />

          <select value={statusNovoLivro} onChange={e => setStatusNovoLivro(e.target.value)} style={{ padding: '10px', borderRadius: '5px' }}>
            <option value="QUERO_LER">Quero Ler</option>
            <option value="LENDO">Lendo Agora</option>
            <option value="LIDO">Já Lido</option>
          </select>

          <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '5px' }}>
            Salvar Livro
          </button>
        </form>
      </div>

      {/* --- BOTÕES DE FILTRO --- */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button onClick={() => setFiltroAtual('TODOS')} style={{ padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', backgroundColor: filtroAtual === 'TODOS' ? '#3498db' : '#555', color: 'white', border: 'none' }}>Todos</button>
        <button onClick={() => setFiltroAtual('QUERO_LER')} style={{ padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', backgroundColor: filtroAtual === 'QUERO_LER' ? '#f1c40f' : '#555', color: 'white', border: 'none' }}>Quero Ler</button>
        <button onClick={() => setFiltroAtual('LENDO')} style={{ padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', backgroundColor: filtroAtual === 'LENDO' ? '#e67e22' : '#555', color: 'white', border: 'none' }}>Lendo</button>
        <button onClick={() => setFiltroAtual('LIDO')} style={{ padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', backgroundColor: filtroAtual === 'LIDO' ? '#2ecc71' : '#555', color: 'white', border: 'none' }}>Lidos</button>
      </div>

      {/* --- LISTA DE LIVROS--- */}
      <div className="lista-livros">
        {livrosFiltrados.map(livro => (
          <div key={livro.id} style={{ border: '1px solid #555', margin: '10px 0', padding: '15px', borderRadius: '8px', textAlign: 'left', background: '#222', display: 'flex', alignItems: 'center', gap: '20px' }}>

            {/* EXIBIÇÃO DA CAPA (Lado Esquerdo) */}
            {livro.capaUrl ? (
                <img
                    src={livro.capaUrl}
                    alt={`Capa do livro ${livro.titulo}`}
                    style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                />
            ) : (
                // Se não tiver capa, mostra um quadrado cinza bonitinho
                <div style={{ width: '80px', height: '120px', background: '#444', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa', textAlign: 'center' }}>
                    Sem<br/>Capa
                </div>
            )}

            {/* INFORMAÇÕES DO LIVRO (Lado Direito) */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#646cff', fontSize: '1.4rem' }}>{livro.titulo}</h3>
              <p style={{ margin: '5px 0'}}>✍️ <span style={{color: '#eee'}}>{livro.autor}</span></p>
              <p style={{ margin: '5px 0'}}>📖 {livro.paginasTotais} páginas</p>
              <span style={{ fontSize: '12px', background: '#444', padding: '3px 8px', borderRadius: '5px', display: 'inline-block', marginTop: '10px' }}>
                📌 {livro.status}
              </span>
            </div>

            {/* BOTÃO EXCLUIR */}
            <button onClick={() => deletarLivro(livro.id)} style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              Excluir
            </button>

          </div>
        ))}

        {livrosFiltrados.length === 0 && (
          <p style={{ textAlign: 'center', color: '#aaa' }}>Nenhum livro encontrado nesta categoria. 🧐</p>
        )}
      </div>
    </div>
  )
}

export default App

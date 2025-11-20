import React, { useState, useEffect } from 'react';
import { clientsService } from '../services/clientsService';
import { productsService } from '../services/productsService';
import { vendaService } from '../services/vendaService';
import './Vendas.css';

const Vendas = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [desconto, setDesconto] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'cartao_credito', label: 'Cartão de Crédito' },
    { value: 'cartao_debito', label: 'Cartão de Débito' },
    { value: 'pix', label: 'PIX' },
    { value: 'boleto', label: 'Boleto' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([carregarClientes(), carregarProdutos()]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Verifique o console para mais detalhes.');
      }
    };
    loadData();
  }, []);

  const carregarClientes = async () => {
    try {
      const data = await clientsService.getAll();
      setClientes(data);
    } catch (error) {
      setError('Erro ao carregar clientes: ' + error.message);
    }
  };

  const carregarProdutos = async () => {
    try {
      const data = await productsService.getAll();
      setProdutos(data);
    } catch (error) {
      setError('Erro ao carregar produtos: ' + error.message);
    }
  };

  const adicionarProduto = () => {
    if (!produtoSelecionado || !quantidade) {
      setError('Por favor, selecione um produto e informe a quantidade');
      return;
    }

    const produto = produtos.find(p => p.id === parseInt(produtoSelecionado));
    if (!produto) {
      setError('Produto não encontrado');
      return;
    }

    const estoqueAtual = produto.estoqueAtual || 0;
    if (quantidade > estoqueAtual) {
      setError(`Quantidade indisponível. Estoque atual: ${estoqueAtual}`);
      return;
    }

    const itemExistente = carrinho.find(item => item.produto.id === produto.id);
    
    if (itemExistente) {
      const novaQuantidade = itemExistente.quantidade + quantidade;
      if (novaQuantidade > estoqueAtual) {
        setError(`Quantidade total indisponível. Estoque atual: ${estoqueAtual}`);
        return;
      }
      
      const novoCarrinho = carrinho.map(item => 
        item.produto.id === produto.id 
          ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * item.precoUnitario }
          : item
      );
      setCarrinho(novoCarrinho);
    } else {
      const preco = produto.preco || 0;
      const novoItem = {
        produto: produto,
        quantidade: quantidade,
        precoUnitario: preco,
        subtotal: quantidade * preco
      };
      setCarrinho([...carrinho, novoItem]);
    }

    setProdutoSelecionado('');
    setQuantidade(1);
    setError('');
  };

  const removerProduto = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerProduto(produtoId);
      return;
    }

    const produto = produtos.find(p => p.id === produtoId);
    const estoqueAtual = produto?.estoqueAtual || 0;
    if (novaQuantidade > estoqueAtual) {
      setError(`Quantidade indisponível. Estoque atual: ${estoqueAtual}`);
      return;
    }

    const novoCarrinho = carrinho.map(item => 
      item.produto.id === produtoId 
        ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * item.precoUnitario }
        : item
    );
    setCarrinho(novoCarrinho);
  };

  const calcularTotal = () => {
    const total = carrinho.reduce((sum, item) => sum + item.subtotal, 0);
    return total;
  };

  const calcularTotalFinal = () => {
    const total = calcularTotal();
    const descontoValor = (desconto / 100) * total;
    return total - descontoValor;
  };

  const finalizarVenda = async () => {
    if (!clienteSelecionado) {
      setError('Por favor, selecione um cliente');
      return;
    }

    if (carrinho.length === 0) {
      setError('Por favor, adicione pelo menos um produto ao carrinho');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Criar venda
      const vendaData = {
        cliente: { id: parseInt(clienteSelecionado) },
        formaPagamento: formaPagamento,
        desconto: desconto,
        observacoes: observacoes,
        itens: carrinho.map(item => ({
          produto: { id: item.produto.id },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario
        }))
      };

      const novaVenda = await vendaService.criarVenda(vendaData);
      
      // Finalizar venda
      await vendaService.finalizarVenda(novaVenda.id, formaPagamento);

      // Gerar PDF
      const pdfBlob = await vendaService.gerarPdf(novaVenda.id);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `venda_${novaVenda.numeroVenda}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(`Venda ${novaVenda.numeroVenda} finalizada com sucesso!`);
      
      // Limpar formulário
      setCarrinho([]);
      setClienteSelecionado('');
      setDesconto(0);
      setFormaPagamento('dinheiro');
      setObservacoes('');
      
      // Recarregar produtos para atualizar estoque
      carregarProdutos();
      
    } catch (error) {
      const errorMsg = error?.message || 'Erro desconhecido ao finalizar venda';
      setError('Erro ao finalizar venda: ' + errorMsg);
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendas-container">
      <h1>Nova Venda</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="vendas-content">
        <div className="vendas-form-section">
          <h2>Informações da Venda</h2>
          
          <div className="form-group">
            <label htmlFor="cliente">Cliente:</label>
            <select
              id="cliente"
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              className="form-control"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.cpf || cliente.cnpj}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="formaPagamento">Forma de Pagamento:</label>
            <select
              id="formaPagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="form-control"
            >
              {formasPagamento.map(forma => (
                <option key={forma.value} value={forma.value}>
                  {forma.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="desconto">Desconto (%):</label>
            <input
              type="number"
              id="desconto"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              min="0"
              max="100"
              step="0.01"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações:</label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows="3"
              className="form-control"
              placeholder="Observações sobre a venda (opcional)"
            />
          </div>
        </div>

        <div className="vendas-produtos-section">
          <h2>Adicionar Produtos</h2>
          
          <div className="produto-form">
            <div className="form-group">
              <label htmlFor="produto">Produto:</label>
              <select
                id="produto"
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                className="form-control"
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - R$ {(produto.preco || 0).toFixed(2)} (Estoque: {produto.estoqueAtual || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">Quantidade:</label>
              <input
                type="number"
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="1"
                className="form-control"
              />
            </div>

            <button
              onClick={adicionarProduto}
              className="btn btn-primary"
              disabled={!produtoSelecionado}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      <div className="carrinho-section">
        <h2>Carrinho de Compras</h2>
        
        {carrinho.length === 0 ? (
          <p className="carrinho-vazio">Carrinho vazio</p>
        ) : (
          <div className="carrinho-itens">
            {carrinho.map(item => (
              <div key={item.produto.id} className="carrinho-item">
                <div className="item-info">
                  <h4>{item.produto.nome}</h4>
                  <p>R$ {item.precoUnitario.toFixed(2)} cada</p>
                </div>
                <div className="item-controls">
                  <input
                    type="number"
                    value={item.quantidade}
                    onChange={(e) => atualizarQuantidade(item.produto.id, Number(e.target.value))}
                    min="1"
                    className="quantidade-input"
                  />
                  <span className="item-subtotal">R$ {item.subtotal.toFixed(2)}</span>
                  <button
                    onClick={() => removerProduto(item.produto.id)}
                    className="btn-remover"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="resumo-section">
        <h2>Resumo da Venda</h2>
        
        <div className="resumo-itens">
          <div className="resumo-item">
            <span>Subtotal:</span>
            <span>R$ {calcularTotal().toFixed(2)}</span>
          </div>
          
          {desconto > 0 && (
            <div className="resumo-item">
              <span>Desconto ({desconto}%):</span>
              <span>-R$ {((desconto / 100) * calcularTotal()).toFixed(2)}</span>
            </div>
          )}
          
          <div className="resumo-item total">
            <span>Total Final:</span>
            <span>R$ {calcularTotalFinal().toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={finalizarVenda}
          className="btn-finalizar"
          disabled={loading || carrinho.length === 0 || !clienteSelecionado}
        >
          {loading ? 'Finalizando...' : 'Finalizar Venda'}
        </button>
      </div>
    </div>
  );
};

export default Vendas;
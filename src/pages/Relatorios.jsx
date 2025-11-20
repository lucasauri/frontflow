import React, { useState, useEffect } from 'react';
import { relatoriosService } from '../services/relatoriosService';
import { clientsService } from '../services/clientsService';
import { productsService } from '../services/productsService';
import './Relatorios.css';

const Relatorios = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [dataInicio, setDataInicio] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
  }, []);

  const carregarClientes = async () => {
    try {
      const data = await clientsService.getAll();
      console.log('Clientes carregados:', data);
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar clientes: ' + error.message);
      setClientes([]);
    }
  };

  const carregarProdutos = async () => {
    try {
      const data = await productsService.getAll();
      console.log('Produtos carregados:', data);
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos: ' + error.message);
      setProdutos([]);
    }
  };

  const gerarRelatorio = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (tipoRelatorio === 'completo') {
        data = await relatoriosService.gerarRelatorioCompleto(dataInicio, dataFim);
      } else if (tipoRelatorio === 'resumo') {
        data = await relatoriosService.gerarRelatorioResumo(dataInicio, dataFim);
      } else if (tipoRelatorio === 'cliente') {
        if (!clienteSelecionado) {
          setError('Selecione um cliente');
          setLoading(false);
          return;
        }
        data = await relatoriosService.gerarRelatorioPorCliente(dataInicio, dataFim, clienteSelecionado);
      } else if (tipoRelatorio === 'produto') {
        if (!produtoSelecionado) {
          setError('Selecione um produto');
          setLoading(false);
          return;
        }
        data = await relatoriosService.gerarRelatorioPorProduto(dataInicio, dataFim, produtoSelecionado);
      }
      console.log('Relatório gerado:', data);
      setRelatorio(data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError('Erro ao gerar relatório: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (!relatorio) return;

    let csv = 'Relatório de Vendas\n';
    csv += `Período: ${dataInicio} a ${dataFim}\n\n`;

    // Resumo
    csv += 'RESUMO\n';
    csv += `Total de Vendas,${relatorio.totalVendas}\n`;
    csv += `Valor Total,${relatorio.valorTotalVendas}\n`;
    csv += `Valor Médio,${relatorio.valorMedioVenda}\n`;
    csv += `Quantidade de Produtos,${relatorio.quantidadeProdutosVendidos}\n`;
    csv += `Desconto Total,${relatorio.desctoTotal}\n\n`;

    // Por forma de pagamento
    if (relatorio.vendaspPorFormaPagamento && relatorio.vendaspPorFormaPagamento.length > 0) {
      csv += 'VENDAS POR FORMA DE PAGAMENTO\n';
      csv += 'Forma de Pagamento,Quantidade,Valor\n';
      relatorio.vendaspPorFormaPagamento.forEach(item => {
        csv += `${item.formaPagamento},${item.quantidade},${item.valor}\n`;
      });
      csv += '\n';
    }

    // Por cliente
    if (relatorio.vendaspPorCliente && relatorio.vendaspPorCliente.length > 0) {
      csv += 'VENDAS POR CLIENTE\n';
      csv += 'Cliente,Quantidade de Vendas,Valor Total\n';
      relatorio.vendaspPorCliente.forEach(item => {
        csv += `${item.nomeCliente},${item.quantidadeVendas},${item.valorTotal}\n`;
      });
      csv += '\n';
    }

    // Por produto
    if (relatorio.vendaspPorProduto && relatorio.vendaspPorProduto.length > 0) {
      csv += 'VENDAS POR PRODUTO\n';
      csv += 'Produto,Quantidade,Valor Total\n';
      relatorio.vendaspPorProduto.forEach(item => {
        csv += `${item.nomeProduto},${item.quantidade},${item.valorTotal}\n`;
      });
      csv += '\n';
    }

    // Detalhes
    if (relatorio.vendas && relatorio.vendas.length > 0) {
      csv += 'DETALHES DAS VENDAS\n';
      csv += 'Número Venda,Data,Cliente,Valor,Forma de Pagamento,Status\n';
      relatorio.vendas.forEach(item => {
        csv += `${item.numeroVenda},${new Date(item.dataVenda).toLocaleDateString('pt-BR')},${item.nomeCliente},${item.valorFinal},${item.formaPagamento},${item.status}\n`;
      });
    }

    // Download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `relatorio-vendas-${dataInicio}-${dataFim}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="relatorios-container">
      <h1>Relatórios de Vendas</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="relatorios-filtros">
        <div className="filtro-group">
          <label htmlFor="tipoRelatorio">Tipo de Relatório:</label>
          <select
            id="tipoRelatorio"
            value={tipoRelatorio}
            onChange={(e) => setTipoRelatorio(e.target.value)}
            className="form-control"
          >
            <option value="completo">Relatório Completo</option>
            <option value="resumo">Resumo</option>
            <option value="cliente">Por Cliente</option>
            <option value="produto">Por Produto</option>
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="dataInicio">Data Início:</label>
          <input
            id="dataInicio"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="filtro-group">
          <label htmlFor="dataFim">Data Fim:</label>
          <input
            id="dataFim"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="form-control"
          />
        </div>

        {tipoRelatorio === 'cliente' && (
          <div className="filtro-group">
            <label htmlFor="cliente">Cliente:</label>
            <select
              id="cliente"
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              className="form-control"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {tipoRelatorio === 'produto' && (
          <div className="filtro-group">
            <label htmlFor="produto">Produto:</label>
            <select
              id="produto"
              value={produtoSelecionado}
              onChange={(e) => setProdutoSelecionado(e.target.value)}
              className="form-control"
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={gerarRelatorio}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </button>

        {relatorio && (
          <button
            onClick={exportarCSV}
            className="btn btn-success"
          >
            Exportar CSV
          </button>
        )}
      </div>

      {relatorio && (
        <div className="relatorios-resultado">
          {/* Resumo */}
          <div className="relatorio-secao">
            <h2>Resumo</h2>
            <div className="resumo-grid">
              <div className="resumo-item">
                <label>Total de Vendas</label>
                <span className="valor">{relatorio.totalVendas}</span>
              </div>
              <div className="resumo-item">
                <label>Valor Total</label>
                <span className="valor">R$ {relatorio.valorTotalVendas?.toFixed(2)}</span>
              </div>
              <div className="resumo-item">
                <label>Valor Médio</label>
                <span className="valor">R$ {relatorio.valorMedioVenda?.toFixed(2)}</span>
              </div>
              <div className="resumo-item">
                <label>Produtos Vendidos</label>
                <span className="valor">{relatorio.quantidadeProdutosVendidos}</span>
              </div>
              <div className="resumo-item">
                <label>Desconto Total</label>
                <span className="valor">R$ {relatorio.desctoTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Vendas por forma de pagamento */}
          {relatorio.vendaspPorFormaPagamento && relatorio.vendaspPorFormaPagamento.length > 0 && (
            <div className="relatorio-secao">
              <h2>Vendas por Forma de Pagamento</h2>
              <table className="tabela-relatorio">
                <thead>
                  <tr>
                    <th>Forma de Pagamento</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.vendaspPorFormaPagamento.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.formaPagamento}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {item.valor?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Vendas por cliente */}
          {relatorio.vendaspPorCliente && relatorio.vendaspPorCliente.length > 0 && (
            <div className="relatorio-secao">
              <h2>Vendas por Cliente</h2>
              <table className="tabela-relatorio">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Quantidade de Vendas</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.vendaspPorCliente.map((item) => (
                    <tr key={item.clienteId}>
                      <td>{item.nomeCliente}</td>
                      <td>{item.quantidadeVendas}</td>
                      <td>R$ {item.valorTotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Vendas por produto */}
          {relatorio.vendaspPorProduto && relatorio.vendaspPorProduto.length > 0 && (
            <div className="relatorio-secao">
              <h2>Vendas por Produto</h2>
              <table className="tabela-relatorio">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.vendaspPorProduto.map((item) => (
                    <tr key={item.produtoId}>
                      <td>{item.nomeProduto}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {item.valorTotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Detalhes das vendas */}
          {relatorio.vendas && relatorio.vendas.length > 0 && (
            <div className="relatorio-secao">
              <h2>Detalhes das Vendas</h2>
              <table className="tabela-relatorio">
                <thead>
                  <tr>
                    <th>Número Venda</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Forma de Pagamento</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.vendas.map((venda) => (
                    <tr key={venda.id}>
                      <td>{venda.numeroVenda}</td>
                      <td>{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</td>
                      <td>{venda.nomeCliente}</td>
                      <td>R$ {venda.valorFinal?.toFixed(2)}</td>
                      <td>{venda.formaPagamento}</td>
                      <td>{venda.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Relatorios;

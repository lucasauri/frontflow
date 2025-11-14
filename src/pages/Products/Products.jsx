import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { productsService } from '../../services/productsService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({ nome: '', preco: '', estoqueInicial: '', embalagem: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productsService.delete(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Erro ao excluir produto');
      }
    }
  };

  const handleNewProduct = () => {
    setProductForm({ nome: '', preco: '', estoqueInicial: '', embalagem: '' });
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      // Validação: preço deve ser obrigatório e positivo
      const preco = Number(productForm.preco);
      if (!productForm.preco || isNaN(preco) || preco <= 0) {
        alert('O preço é obrigatório e deve ser maior que zero');
        return;
      }

      const payload = {
        nome: productForm.nome.trim(),
        preco: preco,
        estoqueInicial: productForm.estoqueInicial ? Number(productForm.estoqueInicial) : 0
      };
      
      // Adiciona embalagem apenas se não estiver vazia
      if (productForm.embalagem && productForm.embalagem.trim()) {
        payload.embalagem = productForm.embalagem.trim();
      }

      const created = await productsService.create(payload);
      setProducts([created, ...products]);
      setIsProductModalOpen(false);
      setProductForm({ nome: '', preco: '', estoqueInicial: '', embalagem: '' });
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      
      let errorMessage = 'Erro ao criar produto';
      
      if (err.response?.data) {
        const data = err.response.data;
        // Prioriza mensagem de erro específica
        if (data.message) {
          errorMessage = data.message;
        } else if (data.fieldErrors) {
          // Se houver erros de campo, mostra o primeiro
          const firstError = Object.values(data.fieldErrors)[0];
          errorMessage = firstError || errorMessage;
        } else if (data.error) {
          errorMessage = `${data.error}: ${data.message || 'Erro desconhecido'}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Erro ao criar produto: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Package className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem' }}>Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <Modal
        title="Novo Produto"
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        footer={(
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)}>Cancelar</button>
            <button type="submit" form="product-form" className="btn btn-primary">Salvar</button>
          </>
        )}
      >
        <form id="product-form" onSubmit={handleCreateProduct}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" value={productForm.nome} onChange={(e) => setProductForm({ ...productForm, nome: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Preço *</label>
              <input type="number" step="0.01" min="0.01" className="form-input" value={productForm.preco} onChange={(e) => setProductForm({ ...productForm, preco: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Estoque Inicial</label>
              <input type="number" className="form-input" value={productForm.estoqueInicial} onChange={(e) => setProductForm({ ...productForm, estoqueInicial: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Embalagem</label>
            <input className="form-input" value={productForm.embalagem} onChange={(e) => setProductForm({ ...productForm, embalagem: e.target.value })} />
          </div>
        </form>
      </Modal>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Produtos
          </h1>
          <p style={{ color: '#64748b' }}>
            Gerencie seu catálogo de produtos e estoque
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNewProduct}>
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      {error && (
        <div className="card" style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca',
          color: '#dc2626',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            {error}
          </div>
        </div>
      )}

      <Card>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Package size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Nenhum produto encontrado</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Comece adicionando seu primeiro produto
            </p>
            <button type="button" className="btn btn-primary" onClick={handleNewProduct}>
              <Plus size={16} />
              Adicionar Produto
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{product.nome}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {product.embalagem}
                        </div>
                      </div>
                    </td>
                    <td>R$ {product.preco?.toFixed(2) || '0,00'}</td>
                    <td>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem' 
                      }}>
                        {product.estoqueInicial + (product.entradas || 0) - (product.saidas || 0)}
                        {product.estoqueInicial + (product.entradas || 0) - (product.saidas || 0) < 10 && (
                          <AlertTriangle size={16} style={{ color: '#dc2626' }} />
                        )}
                      </div>
                    </td>
                    <td>
                      R$ {((product.estoqueInicial + (product.entradas || 0) - (product.saidas || 0)) * (product.preco || 0)).toFixed(2)}
                    </td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: product.estoqueInicial + (product.entradas || 0) - (product.saidas || 0) < 10 
                          ? '#fef2f2' 
                          : '#f0fdf4',
                        color: product.estoqueInicial + (product.entradas || 0) - (product.saidas || 0) < 10 
                          ? '#dc2626' 
                          : '#16a34a'
                      }}>
                        {product.estoqueInicial + (product.entradas || 0) - (product.saidas || 0) < 10 
                          ? 'Estoque Baixo' 
                          : 'Em Estoque'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem' }}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', color: '#dc2626' }}
                          onClick={() => handleDelete(product.id)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Products;

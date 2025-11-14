import React from 'react';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  ChevronRight,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      description: 'Visão geral do sistema'
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
      path: '/products',
      description: 'Gestão de produtos e estoque'
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: Users,
      path: '/clients',
      description: 'Cadastro de clientes'
    },
    {
      id: 'sales',
      label: 'Vendas',
      icon: ShoppingCart,
      path: '/vendas',
      description: 'Controle de vendas'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3,
      path: '/reports',
      description: 'Relatórios e análises'
    },
    {
      id: 'activity',
      label: 'Atividade',
      icon: Activity,
      path: '/activity',
      description: 'Log de atividades'
    }
  ];

  const bottomItems = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
      description: 'Configurações do sistema'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(styles.sidebar, {
        [styles.open]: isOpen
      })}>
        <div className={styles.sidebarContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                🥬
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>HortiFlow</span>
                <span className={styles.logoSubtitle}>Gestão</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
            <div className={styles.navSection}>
              <div className={styles.sectionTitle}>Principal</div>
              <ul className={styles.navList}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        className={clsx(styles.navItem, {
                          [styles.active]: active
                        })}
                        onClick={onClose}
                      >
                        <div className={styles.navItemContent}>
                          <Icon 
                            className={styles.navIcon} 
                            size={20} 
                          />
                          <div className={styles.navItemText}>
                            <span className={styles.navLabel}>
                              {item.label}
                            </span>
                            <span className={styles.navDescription}>
                              {item.description}
                            </span>
                          </div>
                        </div>
                        {active && (
                          <ChevronRight 
                            className={styles.chevron} 
                            size={16} 
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Bottom Section */}
            <div className={styles.navSection}>
              <div className={styles.sectionTitle}>Sistema</div>
              <ul className={styles.navList}>
                {bottomItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        className={clsx(styles.navItem, {
                          [styles.active]: active
                        })}
                        onClick={onClose}
                      >
                        <div className={styles.navItemContent}>
                          <Icon 
                            className={styles.navIcon} 
                            size={20} 
                          />
                          <div className={styles.navItemText}>
                            <span className={styles.navLabel}>
                              {item.label}
                            </span>
                            <span className={styles.navDescription}>
                              {item.description}
                            </span>
                          </div>
                        </div>
                        {active && (
                          <ChevronRight 
                            className={styles.chevron} 
                            size={16} 
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.version}>
              v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

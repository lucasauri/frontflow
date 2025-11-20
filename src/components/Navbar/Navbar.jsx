import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  Menu, 
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import styles from './Navbar.module.css';

const Navbar = ({ 
  onMenuToggle, 
  isMenuOpen, 
  user = { name: 'Admin', email: 'admin@hortiflow.com' },
  onLogout 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3); // Mock notifications count

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <button 
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              🥬
            </div>
            <span className={styles.logoText}>HortiFlow</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className={styles.centerSection}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Buscar produtos, clientes..."
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Notifications */}
          <button className={styles.notificationButton} aria-label="Notificações">
            <Bell size={20} />
            {notifications > 0 && (
              <span className={styles.notificationBadge}>
                {notifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className={styles.settingsButton} aria-label="Configurações">
            <Settings size={20} />
          </button>

          {/* User Menu */}
          <div className={styles.userMenu}>
            <button 
              className={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Menu do usuário"
            >
              <div className={styles.userAvatar}>
                <User size={16} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
              <ChevronDown 
                size={16} 
                className={clsx(styles.chevron, {
                  [styles.chevronOpen]: showUserMenu
                })}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownUserInfo}>
                    <span className={styles.dropdownUserName}>{user.name}</span>
                    <span className={styles.dropdownUserEmail}>{user.email}</span>
                  </div>
                </div>
                
                <div className={styles.dropdownDivider} />
                
                <div className={styles.dropdownItems}>
                  <button className={styles.dropdownItem}>
                    <User size={16} />
                    Meu Perfil
                  </button>
                  <button className={styles.dropdownItem}>
                    <Settings size={16} />
                    Configurações
                  </button>
                  <button 
                    className={clsx(styles.dropdownItem, styles.logoutItem)}
                    onClick={() => { setShowUserMenu(false); onLogout && onLogout(); }}
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Gauge,
  RadioTower,
  Activity,
  ScrollText,
  Settings
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/start', label: 'Start Crawl', icon: RadioTower },
  { to: '/live', label: 'Live Crawl', icon: Activity },
  { to: '/graph', label: 'Graph View', icon: ScrollText },
  { to: '/analytics', label: 'Analytics', icon: Settings }
];

function Sidebar() {
  const { isAuthenticated } = React.useContext(AuthContext);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">AI</div>
        <span>Web Crawler Console</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                ['sidebar-link', isActive ? 'sidebar-link-active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
              end={link.to === '/'}
            >
              <Icon />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div>AI-powered crawler dashboard</div>
        <div>Ready to connect to your backend.</div>
      </div>
    </aside>
  );
}

export default Sidebar;






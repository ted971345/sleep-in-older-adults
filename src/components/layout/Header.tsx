import { useState } from "react";
import type { AppRoute, RouteId } from "../../app/routes";

type HeaderProps = {
  activeRoute: RouteId;
  routes: AppRoute[];
};

export const Header = ({ activeRoute, routes }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-header__inner">
        <a className="brand" href="#/" onClick={closeMenu}>
          <span className="brand__mark" aria-hidden="true">
            SL
          </span>
          <span className="brand__text">
            <span>Sleep in Older Adults</span>
            <strong>Case Reasoning Lab</strong>
          </span>
        </a>

        <button
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          className="nav-toggle"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          Menu
        </button>

        <nav
          aria-label="Primary navigation"
          className={`primary-nav${isOpen ? " primary-nav--open" : ""}`}
          id="primary-navigation"
        >
          {routes.map((route) => (
            <a
              aria-current={activeRoute === route.id ? "page" : undefined}
              className="primary-nav__link"
              href={`#${route.path}`}
              key={route.id}
              onClick={closeMenu}
            >
              {route.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

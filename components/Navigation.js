import React, { PureComponent } from "react";
import Link from "next/prefetch";

export default class Navigation extends PureComponent {
  render() {
    const links = [{ title: "Play", href: "/" }, { title: "About", href: "/about" }];

    return (
      <nav className="navigation">
        <style jsx>
          {
            `
          .navigation {
            position: relative;
            display: flex;
            justify-content: space-between;
            pointer-events: none;
            padding: 0 0.25rem;
          }

          .navigation-wrapper {
            display: flex;
          }

          a, button, h1 {
            font-size: 0.618rem;
            line-height: 0.75rem;
            padding: 0.5rem 0.25rem;
            pointer-events: all;
            text-decoration: none;
            opacity: 0.618;
            font-weight: bold;
          }

          .active {
            opacity: 0.382;
          }

          h1 {
            text-transform: uppercase;
          }
        `
          }
        </style>

        <div className="navigation-wrapper">
          <h1>VALTAMERI</h1>
          {links.map(link => (
            <Link href={link.href} key={link.href}>
              <a className={this.props.pathname === link.href && "active"}>
                {link.title}
              </a>
            </Link>
          ))}
        </div>

        {this.props.pathname === "/" &&
          <div className="navigation-wrapper">
            <button type="button" onClick={this.props.selfDestruct}>
              RESTART
            </button>
            <button type="button" onClick={this.props.enterFullscreen}>
              FULLSCREEN
            </button>
          </div>}
      </nav>
    );
  }
}

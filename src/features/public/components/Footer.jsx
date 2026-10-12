import React from "react";
import Container from "../../../components/Container";

const Footer = () => {
  return (
    <footer className=" bottom-0 left-0 w-full border-t border-border bg-white pt-12 pb-8">
      <Container>
        {/* 4-Column Grid: Brand | Company | Explore | Follow Us */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Column 1-2: Brand */}
          <div className="md:col-span-2">
            <div className="text-xl font-heading font-bold text-ink mb-2">
              Leafly
            </div>
            <p className="text-sm text-ink-secondary">
              Curated indoor plants delivered with care.
            </p>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-heading font-semibold text-ink mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li><a href="#" className="hover:text-ink transition-colors">About</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Care Guides</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Explore */}
          <div>
            <h4 className="font-heading font-semibold text-ink mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li><a href="#" className="hover:text-ink transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Plant Finder</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Cart</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Checkout</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Follow Us (right) + Copyright */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-sm text-ink-muted">
            © 2026 Leafly. All rights reserved.
          </p>
          <span className="font-heading font-semibold text-ink text-sm">
            Follow Us
          </span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
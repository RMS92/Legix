import React from "react";
import Icon from "../ui/Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-title">Nous retrouver</div>
      </div>
      <div>
        <div className="footer-title">Informations générales</div>
      </div>
      <div>
        <div className="footer-title">Nous contacter</div>
        <ul>
          <li>
            <a href="/contact">
              <Icon name="email" width="17" className="icon icon-email" />
              Par email
            </a>
          </li>
          <li>
            <a href="#">
              <Icon name="tchat" width="17" className="icon icon-tchat" />
              Par tchat
            </a>
          </li>
          <li>
            <a href="a-propos">
              <Icon name="info" width="4" className="icon icon-tchat" />A propos
            </a>
          </li>
          <li>
            <a href="politique-de-confidentialite">
              <Icon name="policy" width="17" className="icon icon-policy" />
              Politique de confidentialité
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

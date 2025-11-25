import React from "react";
import { Link } from "react-router-dom";
import styles from "../../style/layout/footer.module.css";
import payPalImage from "../../assets/footer/PayPal.png";
import FooterSection from "./FooterSection";
import { footerSections } from "../../utils/constants/FooterData";

const Footer = () => {
  const textSections = footerSections.filter(
    (section) => section.type === "text"
  );
  const iconSection = footerSections.find((section) => section.type === "icon");

  const leftTextSections = textSections.slice(0, 2);
  const rightTextSections = textSections.slice(2, 4);

  return (
    <footer>
      <div className={styles.footer_section_1}>
        <div className={styles.components_section}>
          <div className={styles.text_links}>
            {leftTextSections.map((section, index) => (
              <FooterSection
                key={index}
                title={section.title}
                links={section.links}
                type={section.type}
              />
            ))}
          </div>
          <div className={styles.text_links}>
            {rightTextSections.map((section, index) => (
              <FooterSection
                key={index}
                title={section.title}
                links={section.links}
                type={section.type}
              />
            ))}
          </div>
          <div className={styles.icon_links}>
            {iconSection && (
              <FooterSection
                title={iconSection.title}
                apps={iconSection.apps}
                socialTitle={iconSection.socialTitle}
                socialLinks={iconSection.socialLinks}
                type={iconSection.type}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer_section_2}>
        <Link
          to="https://www.paypal.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={payPalImage} alt="PayPal" />
        </Link>
      </div>
      <div className={styles.footer_section_3}>
        <p>© Copyright 2024-2025. Disfraz.com. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import styles from "../../style/footer.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const FooterSection = ({
  title,
  links,
  apps,
  socialTitle,
  socialLinks,
  type,
}) => {
  const socialIcons = {
    Facebook: <FaFacebook />,
    Instagram: <FaInstagram />,
    Twitter: <FaTwitter />,
    YouTube: <FaYoutube />,
    LinkedIn: <FaLinkedin />,
    TikTok: <FaTiktok />,
    WhatsApp: <FaWhatsapp />,
  };

  return (
    <div className={type === "text" ? styles.text_links : styles.icon_links}>
      <h4 className={styles.footer_section_title}>{title}</h4>
      {type === "text" ? (
        <ul className={styles.footer_section_list}>
          {Object.entries(links).map(([linkText, url], index) => (
            <li key={index} className={styles.footer_section_item}>
              <a href={url} className={styles.footer_section_link}>
                {linkText}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className={styles.app_buttons}>
            {apps.map((app, index) => (
              <a key={index} href={app.url} className={styles.app_button}>
                <img
                  src={app.image}
                  alt={app.name}
                  className={styles.app_button_image}
                />
              </a>
            ))}
          </div>
          <h4 className={styles.footer_section_title}>{socialTitle}</h4>
          <div className={styles.social_links}>
            {Object.entries(socialLinks).map(([socialName, url], index) => (
              <a key={index} href={url} className={styles.social_link}>
                {socialIcons[socialName]}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FooterSection;

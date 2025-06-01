import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Brian Ferreyra. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;

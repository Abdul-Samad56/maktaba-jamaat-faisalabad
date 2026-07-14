export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/logo.png" alt="Maktaba Jamaat e Islami Faisalabad" className="logo-image logo-square" />
          <h4>Maktaba Jamaat e Islami Faisalabad</h4>
          <p>
            مکتبہ جماعت اسلامی فیصل آباد — Islamic books online، چنیوٹ بازار، فیصل آباد۔ WhatsApp:
            0321-5315603
          </p>
        </div>
        <div>
          <h4>Office Address</h4>
          <p>دفتر جماعت اسلامی، گلی نمبر 8، چنیوٹ بازار، فیصل آباد</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            WhatsApp:{" "}
            <a href="https://wa.me/923215315603" target="_blank" rel="noreferrer" className="footer-link">
              0321-5315603
            </a>
          </p>
        </div>
      </div>
      <div className="container" style={{ marginTop: "1.5rem", opacity: 0.75, textAlign: "center" }}>
        © {new Date().getFullYear()}, Maktaba Jamaat e Islami Faisalabad
        {" · "}
        <a href="/admin" className="footer-link" style={{ fontSize: "0.85rem" }}>
          Admin
        </a>
      </div>
    </footer>
  );
}

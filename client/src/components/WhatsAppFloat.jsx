const WHATSAPP_NUMBER = "923215315603";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "السلام علیکم! Maktaba Jamaat e Islami Faisalabad سے رابطہ کر رہا/رahi ہوں۔"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      className="whatsapp-float"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp پر آرڈر / رابطہ کریں — 0321-5315603"
      title="WhatsApp: 0321-5315603"
    >
      <span className="whatsapp-float-pulse" aria-hidden="true" />
      <span className="whatsapp-float-pulse whatsapp-float-pulse-delay" aria-hidden="true" />
      <span className="whatsapp-float-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" focusable="false">
          <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.5 4.1 1.5 5.9L4 29l8.3-1.5c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.9.9.9-4.8-.2-.4A8.9 8.9 0 0 1 7 15c0-5 4-9 9-9s9 4 9 9-4 9-9 9zm4.9-6.7c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.4.2-.7.1-1-.5-1.9-1.1-2.7-1.9-1-1-1.8-2.1-2.4-3.3-.1-.2 0-.4.1-.5l.7-.8c.1-.1.2-.3.2-.4 0-.1 0-.3-.1-.4l-.9-2.2c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3z" />
        </svg>
      </span>
      <span className="whatsapp-float-copy">
        <span className="whatsapp-float-label">WhatsApp آرڈر</span>
        <span className="whatsapp-float-sub">0321-5315603</span>
      </span>
    </a>
  );
}

export { WHATSAPP_URL, WHATSAPP_NUMBER };

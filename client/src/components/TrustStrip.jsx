export default function TrustStrip() {
  return (
    <div className="container">
      <section className="trust-strip" aria-label="خدمات">
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 7h11v10H3z" />
              <path d="M14 10h4l3 3v4h-7" />
              <circle cx="7" cy="18" r="1.6" />
              <circle cx="17" cy="18" r="1.6" />
            </svg>
          </span>
          <p>تیز ترسیل آپ کے دروازے تک</p>
        </div>
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3l2.4 4.9L20 9l-4 3.9.9 5.1L12 15.8 7.1 18l.9-5.1L4 9l5.6-1.1L12 3z" />
            </svg>
          </span>
          <p>معیاری کتب معتبر اشاعتیں</p>
        </div>
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 5h14v14H5z" />
              <path d="M8 9h8M8 12h8M8 15h5" />
            </svg>
          </span>
          <p>تازہ ترین کتب نئی کتابیں دستیاب</p>
        </div>
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm5.7 14.2c-.2.7-1.2 1.2-2 1.4-.5.1-1.2.2-3.5-.7-2.8-1.2-4.6-4.1-4.7-4.3-.2-.2-1.3-1.7-1.3-3.3s.9-2.3 1.2-2.6c.3-.3.7-.4 1-.4h.6c.2 0 .4 0 .6.5l1 2.4c.1.2.1.4 0 .5l-.8.9c-.1.2-.2.3 0 .6.6 1.1 1.5 2 2.5 2.6.3.1.5.1.7-.1l1-1.2c.2-.2.4-.2.6-.1.7.3 1.8.9 2.1 1 .3.2.5.3.5.5z" />
            </svg>
          </span>
          <p>آسان آرڈر واٹس ایپ پر رابطہ کریں</p>
        </div>
      </section>
    </div>
  );
}

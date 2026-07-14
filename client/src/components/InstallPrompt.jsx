import { useEffect, useState } from "react";

const DISMISS_KEY = "maktaba-install-dismissed";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [showIos, setShowIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIos()) {
      setShowIos(true);
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setDeferred(null);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="install-banner" role="dialog" aria-label="Install app">
      <div className="install-banner-text">
        <strong>ایپ انسٹال کریں</strong>
        {showIos && !deferred ? (
          <span>
            Safari میں Share (□↑) دبائیں، پھر <em>Add to Home Screen</em>
          </span>
        ) : (
          <span>ہوم اسکرین پر رکھیں — تیز رسائی، آف لائن کیش</span>
        )}
      </div>
      <div className="install-banner-actions">
        {deferred && (
          <button type="button" className="btn btn-primary install-btn" onClick={install}>
            Install
          </button>
        )}
        <button type="button" className="btn btn-outline install-dismiss" onClick={dismiss}>
          بعد میں
        </button>
      </div>
    </div>
  );
}

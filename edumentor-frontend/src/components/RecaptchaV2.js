import React, { useEffect, useRef } from "react";

const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "";

export default function RecaptchaV2({ onChange, captchaId }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    let retryTimer;
    const renderCaptcha = () => {
      if (!window.grecaptcha || typeof window.grecaptcha.render !== "function") {
        return;
      }
      if (ref.current.dataset.rendered) return;
      window.grecaptcha.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token) => onChange?.(token),
      });
      ref.current.dataset.rendered = "true";
    };

    const scheduleRetry = () => {
      if (retryTimer) return;
      retryTimer = window.setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
          window.clearInterval(retryTimer);
          retryTimer = null;
          renderCaptcha();
        }
      }, 300);
    };

    if (!document.getElementById("recaptcha-script")) {
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = scheduleRetry;
      document.body.appendChild(script);
    }

    if (window.grecaptcha) {
      scheduleRetry();
    }

    return () => {
      if (retryTimer) {
        window.clearInterval(retryTimer);
      }
    };
  }, [onChange]);

  return <div id={captchaId} ref={ref} />;
}

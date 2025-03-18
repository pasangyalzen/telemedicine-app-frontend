// src/components/SecuritySettings.jsx

import React, { useState } from "react";
import Button from "../../../components/Button";

const SecuritySettings = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const handleToggle2FA = () => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
  };

  return (
    <div>
      <h2>Security Settings</h2>
      <div className="mt-4">
        <p>Two-factor authentication is {isTwoFactorEnabled ? "Enabled" : "Disabled"}</p>
        <Button onClick={handleToggle2FA} variant="primary">
          Toggle 2FA
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
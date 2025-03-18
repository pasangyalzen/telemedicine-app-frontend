// src/components/SettingsPage.jsx

import React from "react";
import Button from "../../../components/Button";

const SettingsPage = () => {
  return (
    <div>
      <h2>Settings</h2>
      <Button onClick={() => console.log("Settings saved")} variant="primary">
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsPage;
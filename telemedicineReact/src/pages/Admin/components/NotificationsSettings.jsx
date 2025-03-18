// src/components/NotificationsSettings.jsx

import React, { useState } from "react";
import Button from "../../../components/Button";

const NotificationsSettings = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  return (
    <div>
      <h2>Notifications Settings</h2>
      <p>Notifications are {isNotificationsEnabled ? "Enabled" : "Disabled"}</p>
      <Button onClick={handleToggleNotifications} variant="primary">
        Toggle Notifications
      </Button>
    </div>
  );
};

export default NotificationsSettings;
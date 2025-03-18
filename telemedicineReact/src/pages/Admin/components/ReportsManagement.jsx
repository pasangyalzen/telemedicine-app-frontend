// src/components/ReportsManagement.jsx

import React from "react";
import Button from "../../../components/Button";
import { FaDownload } from "react-icons/fa";

const ReportsManagement = () => {
  const handleDownloadReport = () => { console.log("Downloading report"); };

  return (
    <div>
      <h2>Reports Management</h2>
      <Button onClick={handleDownloadReport} variant="primary" icon={FaDownload}>Download Report</Button>
      <div className="mt-4">
        <h3>Available Reports:</h3>
        <ul>
          <li>Report 1 - <Button onClick={handleDownloadReport} variant="secondary" icon={FaDownload}>Download</Button></li>
          <li>Report 2 - <Button onClick={handleDownloadReport} variant="secondary" icon={FaDownload}>Download</Button></li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsManagement;
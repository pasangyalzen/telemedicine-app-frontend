// src/components/PharmacistManagement.jsx

import React, { useState } from "react";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";

const PharmacistManagement = () => {
  const [pharmacists, setPharmacists] = useState([
    { id: 1, name: "John Doe", email: "john@pharma.com" },
    { id: 2, name: "Jane Smith", email: "jane@pharma.com" },
  ]);

  const handleAddPharmacist = () => { console.log("Adding pharmacist"); };
  const handleEditPharmacist = (id) => { console.log("Editing pharmacist", id); };
  const handleDeletePharmacist = (id) => { 
    setPharmacists(pharmacists.filter(p => p.id !== id));
    console.log("Deleted pharmacist", id);
  };

  return (
    <div>
      <h2>Pharmacist Management</h2>
      <Button onClick={handleAddPharmacist} variant="primary" icon={FaPlusCircle}>Add New Pharmacist</Button>
      <div>
        {pharmacists.map(p => (
          <div key={p.id} className="flex justify-between">
            <span>{p.name}</span>
            <Button onClick={() => handleEditPharmacist(p.id)} variant="secondary" icon={FaEdit}>Edit</Button>
            <Button onClick={() => handleDeletePharmacist(p.id)} variant="danger" icon={FaTrashAlt}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacistManagement;
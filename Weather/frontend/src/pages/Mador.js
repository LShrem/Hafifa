import React, { useState } from "react";
import "../styles/Mador.css";
import MadorModal from "../components/MadorModal";

export default function Mador() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="mador">
      <div>
        <button onClick={openModal} className="open-modal">
          פתח חלון
        </button>
        <MadorModal showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
}

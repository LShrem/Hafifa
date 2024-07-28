import React, { useEffect, useState } from "react";
import officerImage from "../images/officer.png";
import manImage from "../images/man.png";
import womanImage from "../images/woman.png";
import "../styles/SoldierCard.css";

export default function SoldierCard(props) {
  const [isSelected, setIsSelected] = useState(props.isSelected || false);
  let image = props.soldier.is_officer
    ? officerImage
    : props.soldier.gender === "ז"
    ? manImage
    : womanImage;

  if (isSelected !== props.isSelected) {
    setIsSelected(props.isSelected);
  }

  const styles = {
    backgroundColor: isSelected ? "red" : "transparent",
  };

  const handleClick = () => {
    setIsSelected(!isSelected);
    props.onSelect(props.soldier.mispar_ishi, !isSelected);
  };

  return (
    <div className="soldier-card" style={styles} onClick={handleClick}>
      <img src={image} className="soldier-image" alt="Soldier" />
      <div className="card-content">
        <h5>
          {props.soldier.first_name} {props.soldier.last_name}
        </h5>
        <div>
          {props.soldier.role}, {props.soldier.age}
        </div>
        <p>{props.soldier.rank}</p>
      </div>
    </div>
  );
}

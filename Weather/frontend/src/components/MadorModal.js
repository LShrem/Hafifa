import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-bootstrap/Modal";
import SoldierCard from "../components/SoldierCard";
import CloseButton from "react-bootstrap/esm/CloseButton";

export default function MadorModal(props) {
  const [soldiers, setSoldiers] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [formData, setFormData] = useState({
    mispar_ishi: "",
    user_name: "",
    first_name: "",
    last_name: "",
    gender: "",
    role: "מפתח תוכנה",
    rank: 'רב"ט',
    city: "חולון",
    city_location: "מרכז",
    is_officer: false,
    age: 19,
  });
  const [soldierName, setSoldierName] = useState("");
  const [orderPick, setOrderPick] = useState("city");
  const [selectedSoldiers, setSelectedSoldiers] = useState({});
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);

  useEffect(() => {
    async function getAllSoldiers() {
      const data = (await api().getAllSoldiers()).data;
      setSoldiers(data);
    }

    getAllSoldiers();
  }, []);

  const closeModal = () => {
    props.setShowModal(false);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();
      const dateString = `${day}/${month}/${year}`;
      const timeString = `${hours}:${minutes}:${seconds}`;
      const dateTimeString = `${dateString} ${timeString}`;
      setCurrentTime(dateTimeString);
    };

    const intervalId = setInterval(updateTime, 1000);

    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  const handleOrderChange = (event) => {
    setOrderPick(event.target.value);
  };

  const sortSoldiersByOption = () => {
    const sorted = {};

    if (orderPick === "role") {
      soldiers.forEach((soldier) => {
        const categoryValue = `${soldier.role}, ${soldier.rank}`;
        if (!sorted[categoryValue]) {
          sorted[categoryValue] = [];
        }
        sorted[categoryValue].push(soldier);
      });
    } else {
      soldiers.forEach((soldier) => {
        const categoryValue = soldier[orderPick];
        if (!sorted[categoryValue]) {
          sorted[categoryValue] = [];
        }
        sorted[categoryValue].push(soldier);
      });
    }
    return sorted;
  };

  const sortedSoldiers = sortSoldiersByOption();

  const renderSoldiersByCategory = () => {
    return Object.keys(sortedSoldiers).map((categoryValue, index) => (
      <div key={index}>
        <h2>
          {categoryValue === "ז"
            ? "זכר"
            : categoryValue === "נ"
            ? "נקבה"
            : categoryValue}
        </h2>
        <div className="soldiersContainer">
          {sortedSoldiers[categoryValue]
            .sort((a, b) =>
              a.last_name.localeCompare(b.last_name, "he", {
                sensitivity: "base",
              })
            )
            .map((soldier, index) => (
              <SoldierCard
                key={index}
                soldier={soldier}
                isSelected={selectedSoldiers[soldier.mispar_ishi]}
                onSelect={handleSoldierSelect}
              />
            ))}
        </div>
      </div>
    ));
  };

  const changeAddButtonStyle = (name, value) => {
    const updatedFormData =
      name === "soldierName"
        ? {
            ...formData,
            first_name: value.split(" ")[0],
            last_name: value.split(" ")[1],
          }
        : {
            ...formData,
            [name]: value,
          };

    if (
      updatedFormData.first_name &&
      updatedFormData.last_name &&
      updatedFormData.gender &&
      updatedFormData.User_Name &&
      updatedFormData.mispar_ishi
    ) {
      document.getElementById("addSoldier").style.backgroundColor = "purple";
      document.getElementById("addSoldier").disabled = false;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "soldierName") {
      setSoldierName(value);
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          first_name: value.split(" ")[0],
          last_name: value.split(" ")[1],
        };
      });
    } else {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          [name]: value,
        };
      });
    }

    changeAddButtonStyle(name, value);
  };

  const checkFormInfo = (event) => {
    event.preventDefault();

    if (checkUserName() && checkPersonalNumber()) {
      setSoldiers((prevSoldiers) => [...prevSoldiers, formData]);
    } else {
      alert("פרטים לא חוקיים");
    }
  };

  const checkUserName = () => {
    const userNameRegex = /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z]*\d{0,3}$/;

    return userNameRegex.test(formData.User_Name);
  };

  const checkPersonalNumber = () => {
    const personalNumberRegex = /^\d{7}$/;

    return personalNumberRegex.test(formData.mispar_ishi);
  };

  const handleSoldierSelect = (misparIshi, isSelected) => {
    setSelectedSoldiers((prevSelectedSoldiers) => {
      const updatedSelectedSoldiers = { ...prevSelectedSoldiers };

      if (isSelected) {
        updatedSelectedSoldiers[misparIshi] = true;
      } else {
        delete updatedSelectedSoldiers[misparIshi];
      }

      return updatedSelectedSoldiers;
    });
  };

  const selectAll = () => {
    const updatedSelectedSoldiers = {};
    soldiers.forEach((soldier) => {
      updatedSelectedSoldiers[soldier.mispar_ishi] = true;
    });
    setSelectedSoldiers(updatedSelectedSoldiers);
  };

  const unselectAll = () => {
    setSelectedSoldiers({});
  };

  useEffect(() => {
    const deleteSoldiersButton = document.getElementById("delete-selected");

    if (deleteSoldiersButton) {
      if (Object.keys(selectedSoldiers).length > 0) {
        deleteSoldiersButton.style.backgroundColor = "purple";
        setDeleteButtonDisabled(false);
      } else {
        deleteSoldiersButton.style.backgroundColor = "lightgrey";
        setDeleteButtonDisabled(true);
      }
    }
  }, [selectedSoldiers]);

  const deleteSelected = () => {
    const selectedMisparIshis = Object.keys(selectedSoldiers).filter(
      (misparIshi) => selectedSoldiers[misparIshi]
    );
    const updatedSoldiers = soldiers.filter(
      (soldier) => !selectedMisparIshis.includes(soldier.mispar_ishi)
    );

    setSoldiers(updatedSoldiers);
    setSelectedSoldiers({});
  };

  const saveChanges = async () => {
    await api().updateMadorSoldiers(soldiers);
    closeModal();
  };

  return (
    <Modal
      show={props.showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div className="divs">
          <CloseButton onClick={closeModal} />
        </div>
        <div className="divs">
          <h2>חיילי המדור</h2>
          <h6>{currentTime}</h6>
        </div>
      </Modal.Header>
      <Modal.Body style={{ direction: "rtl" }}>
        <form className="form" onSubmit={checkFormInfo}>
          <input
            placeholder="שם החייל"
            className="inputs"
            name="soldierName"
            value={soldierName}
            onChange={handleChange}
            required
          />
          <hr />
          <input
            placeholder="מספר אישי"
            className="inputs"
            name="mispar_ishi"
            value={formData.mispar_ishi}
            onChange={handleChange}
            required
          />
          <hr />
          <input
            placeholder="שם משתמש"
            className="inputs"
            name="User_Name"
            value={formData.User_Name}
            onChange={handleChange}
            required
          />
          <hr />
          <div>
            <div style={{ color: "grey" }}>מין</div>
            <input
              type="radio"
              id="gender1"
              value="ז"
              name="gender"
              onChange={handleChange}
            />
            &nbsp;
            <label htmlFor="gender1">זכר</label>
            &nbsp; &nbsp;
            <input
              type="radio"
              id="gender2"
              value="נ"
              name="gender"
              onChange={handleChange}
            />
            &nbsp;
            <label htmlFor="gender2">נקבה</label>
          </div>
          <br />
          <button
            className="modal-buttons"
            style={{ alignSelf: "end" }}
            id="addSoldier"
            disabled
            type="submit"
          >
            הוספה
          </button>
        </form>
        <br />
        <div>
          סדר לפי:
          <select className="select" onChange={handleOrderChange}>
            <option selected className="order-options" value="city">
              עיר
            </option>
            <option className="order-options" value="city_location">
              מיקום עיר בארץ
            </option>
            <option className="order-options" value="gender">
              מין
            </option>
            <option className="order-options" value="role">
              תפקיד + דרגה
            </option>
          </select>
        </div>
        <div className="soldiers-overflow">{renderSoldiersByCategory()}</div>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <button
          className="modal-buttons"
          onClick={saveChanges}
          style={{ backgroundColor: "purple" }}
        >
          שמירה
        </button>
        <button
          className="modal-buttons"
          style={{ backgroundColor: "purple" }}
          onClick={selectAll}
        >
          בחר הכל
        </button>
        <button
          className="modal-buttons"
          style={{ backgroundColor: "purple" }}
          onClick={unselectAll}
        >
          נקה הכל
        </button>
        <button
          className="modal-buttons"
          disabled={deleteButtonDisabled}
          id="delete-selected"
          onClick={deleteSelected}
        >
          מחיקת מסומנים
        </button>
      </Modal.Footer>
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import { IoIosArrowDown } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { FaUser } from "react-icons/fa";

import OrderContent from "./total/OrderContent";
import "./Oder.css";
import { LinkAPI } from "../LinkAPI";
function TotalOder() {
  const [tableID, setTableID] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [showTableList, setShowTableList] = useState(false);
  const [iconRotated, setIconRotated] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const customerInfoArray =
    JSON.parse(localStorage.getItem("customerInfoArray")) || {};

  useEffect(() => {
    const fetchTableIDFromLocalStorage = () => {
      const storedTableID = localStorage.getItem("selectedTableID");
      if (storedTableID) {
        setTableID(storedTableID);
      }
    };

    fetchTableIDFromLocalStorage();
  }, []);

  useEffect(() => {
    const fetchTableList = async () => {
      try {
        // Fetch the list of tables from the API
        const response = await axios.get(`${LinkAPI}table`);
        // Update the table list state with the fetched data
        setTableList(response.data);
      } catch (error) {
        console.error("Error fetching table list:", error);
      }
    };

    fetchTableList();
  }, []);

  useEffect(() => {
    const storedTableID = localStorage.getItem("selectedTableID");
    const customerInfoArray =
      JSON.parse(localStorage.getItem("customerInfoArray")) || {};
    if (customerInfoArray && customerInfoArray[storedTableID]) {
      const latestCustomerInfo =
        customerInfoArray[storedTableID][
          customerInfoArray[storedTableID].length - 1
        ];
      setCustomerInfo(latestCustomerInfo);
      if (latestCustomerInfo && latestCustomerInfo.customerName) {
        setCustomerName(latestCustomerInfo.customerName);
      }
    }
  }, []);

  const handleIconClick = () => {
    setIconRotated(!iconRotated);
    setShowTableList(!showTableList);
  };

  const handleTableSelect = (selectedTableID) => {
    setTableID(selectedTableID);
    localStorage.setItem("selectedTableID", selectedTableID); // Update selectedTableID in localStorage

    setShowTableList(false);

    // Retrieve customer info from localStorage based on the selected table ID
    const storedCustomerInfo = JSON.parse(
      localStorage.getItem("customerInfoArray")
    );
    if (storedCustomerInfo && storedCustomerInfo[selectedTableID]) {
      const latestCustomerInfo =
        storedCustomerInfo[selectedTableID][
          storedCustomerInfo[selectedTableID].length - 1
        ];
      setCustomerInfo(latestCustomerInfo);
      if (latestCustomerInfo && latestCustomerInfo.customerName) {
        setCustomerName(latestCustomerInfo.customerName);
      }
    }
  };

  return (
    <div className="totalOder">
      <Navbar className="totalNav">
        <Container>
          <div>
            <Navbar className="pt-0 pb-0">
              Bàn <span className="ms-1">{tableID}</span>
            </Navbar>

            {customerInfo && (
              <span className="d-flex align-items-center">
                <FaUser className="me-1" size={"12px"} />
                {customerName}
              </span>
            )}
          </div>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <IoIosArrowDown
                className="totalIconArrow"
                size={"18px"}
                style={{
                  transform: iconRotated ? "rotate(360deg)" : "rotate(0deg)",
                }}
                onClick={handleIconClick}
              />
              <CiEdit className="ms-2" size={"18px"} />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showTableList && (
        <ul className="totalTableList">
          {tableList
            .filter((table) => {
              return (
                customerInfoArray[table.id] &&
                customerInfoArray[table.id].length > 0
              );
            })
            .map((table) => (
              <li
                className="totalTableItem"
                key={table.id}
                onClick={() => handleTableSelect(table.id)}
              >
                Bàn {table.id}
              </li>
            ))}
        </ul>
      )}

      <OrderContent tableID={tableID} />
    </div>
  );
}

export default TotalOder;

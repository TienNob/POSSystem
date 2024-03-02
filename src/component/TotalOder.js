
import React, { useEffect, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import { IoIosArrowDown } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import OrderContent from "./total/OrderContent";
import "./Oder.css";
import { LinkAPI } from "../LinkAPI";

function TotalOder( ) {
  const [tableID, setTableID] = useState(null); // State to store the selected table ID
  const [tableList, setTableList] = useState([]); // State to store the list of tables
  const [showTableList, setShowTableList] = useState(false); // State to control the visibility of the table list
  const [iconRotated, setIconRotated] = useState(false); // State to control the rotation of the icon
  

  useEffect(() => {
    const fetchTableIDFromLocalStorage = () => {
      // Get the table ID from localStorage when the component mounts
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

  const handleIconClick = () => {
    setIconRotated(!iconRotated)
    setShowTableList(!showTableList);
  };
 
  const handleTableSelect = (selectedTableID) => {
    // Set the selected table ID and hide the table list when a table is selected
    setTableID(selectedTableID);
    localStorage.setItem("selectedTableID", selectedTableID); // Update selectedTableID in localStorage

    setShowTableList(false);
  };


  return (
    <div className="totalOder">
      <Navbar className="totalNav">
        <Container>
          <Navbar>Bàn</Navbar>
          <span className="ms-1">{tableID}</span>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <IoIosArrowDown className="totalIconArrow" size={"18px"}style={{ transform: iconRotated ? 'rotate(360deg)' : 'rotate(0deg)' }}  onClick={handleIconClick} />
              <CiEdit className="ms-2" size={"18px"} />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Render the table list when showTableList state is true */}
      {showTableList && (
        <ul className="totalTableList">
          {tableList.map((table) => (
            <li className="totalTableItem" key={table.id} onClick={() => handleTableSelect(table.id)}>
              Bàn {table.id}
            </li>
          ))}
        </ul>
      )}
      <OrderContent tableID={tableID}/>
    </div>
  );
}

export default TotalOder;


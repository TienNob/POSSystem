import React, { useEffect, useState } from "react";
import { Navbar, Container, Modal, Button, Form } from "react-bootstrap";
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
  const [newTable, setNewTable] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);

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

  const handleIconEditClick = () => {
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Kiểm tra xem bàn mới có tồn tại không
    const tableExists = newTable <= tableList.length;
    if (!tableExists) {
      alert("Bàn mới không tồn tại trong danh sách!");
      return;
    }

    const isTableOccupied =
      customerInfoArray[parseInt(newTable)] &&
      customerInfoArray[parseInt(newTable)].length > 0;

    if (isTableOccupied) {
      // Nếu không có thông tin khách hàng, hiển thị cảnh báo
      alert("Không thể chuyển bàn khi bàn đã có khách!");
      return;
    }

    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID];

    // Lấy thông tin khách hàng và sản phẩm đã đặt hàng từ localStorage
    const customerInfoForNewTable = customerInfoArray[newTable] || [];
    const productsForNewTable = storedProductsByTable[newTable] || [];

    // Cập nhật thông tin khách hàng và sản phẩm đã đặt hàng cho bàn mới
    customerInfoArray[newTable] = [...customerInfoForNewTable, customerInfo];
    storedProductsByTable[newTable] = [
      ...productsForNewTable,
      ...productsForTable,
    ];

    // Xóa thông tin khách hàng và sản phẩm đã đặt hàng của bàn cũ
    delete customerInfoArray[tableID];
    delete storedProductsByTable[tableID];

    // Lưu các thay đổi vào localStorage
    localStorage.setItem(
      "customerInfoArray",
      JSON.stringify(customerInfoArray)
    );
    localStorage.setItem(
      "selectedProductsByTable",
      JSON.stringify(storedProductsByTable)
    );

    // Cập nhật tableID mới
    setTableID(newTable);
    localStorage.setItem("selectedTableID", newTable);

    // Đóng modal sau khi xử lý
    setShowFormModal(false);
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
              <CiEdit
                className="ms-2 totalIconArrow"
                size={"18px"}
                onClick={handleIconEditClick}
              />
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

      <Modal centered show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header className="justify-content-center">
          <Modal.Title className="blackColor ">Chuyển Bàn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formNewTable">
              <Form.Label className="blackColor">Chọn bàn mới:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số bàn mới"
                value={newTable}
                onChange={(e) => setNewTable(e.target.value)}
              />
            </Form.Group>
            <Modal.Footer>
              <Button
                className="me-2 buttonDisible"
                variant="secondary"
                onClick={handleCloseFormModal}
              >
                Huỷ
              </Button>
              <Button variant="primary" type="submit">
                Chuyển bàn{" "}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TotalOder;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Modal, Button, Form } from "react-bootstrap";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Person2Icon from "@mui/icons-material/Person2";
import MergeIcon from "@mui/icons-material/Merge";
import Tooltip from "@mui/material/Tooltip";
import OrderContent from "./OrderContent";
import "./Oder.css";
import { LinkAPI } from "../../LinkAPI";
import Notification from "../../notification/Notification";

function TotalOder({ openDrawer }) {
  const [tableID, setTableID] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [showTableList, setShowTableList] = useState(false);
  const [iconRotated, setIconRotated] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [newTable, setNewTable] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [mergeTable, setMergeTable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const totalOderClass = openDrawer ? "totalOder show" : "totalOder";

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
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }
    axios
      .get(`${LinkAPI}table`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTableList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate]);

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
    setMergeTable(false);
    setShowFormModal(false);
  };
  const handleMergeButtonClick = () => {
    setMergeTable(true); // Set mergeTable state to true to indicate merging tables
    setShowFormModal(true); // Open the modal
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Kiểm tra xem bàn mới có tồn tại không
    const tableExists = tableList.some((table) => {
      return table.id === parseInt(newTable);
    });
    console.log(tableExists);
    if (!tableExists) {
      setShowAlert(true);
      setAlertSeverity("warning");
      setAlertMessage(`Bàn mới không tồn tại trong danh sách!`);
      return;
    }

    const isTableOccupied =
      customerInfoArray[parseInt(newTable)] &&
      customerInfoArray[parseInt(newTable)].length > 0;

    if (isTableOccupied && !mergeTable) {
      setShowAlert(true);
      setAlertSeverity("warning");
      setAlertMessage(`Không thể chuyển bàn khi bàn đang có khách!`);
      return;
    }
    if (!isTableOccupied && mergeTable) {
      setShowAlert(true);
      setAlertSeverity("warning");
      setAlertMessage(`Không thể gộp bàn khi bàn chưa có khách`);
      return;
    }
    if (mergeTable && tableID === newTable) {
      setShowAlert(true);
      setAlertSeverity("warning");
      setAlertMessage(`Không thể gộp với bàn hiện tại`);
      return;
    }
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID];

    // Lấy thông tin khách hàng và sản phẩm đã đặt hàng từ localStorage
    const customerInfoForNewTable = customerInfoArray[newTable] || [];
    const productsForNewTable = storedProductsByTable[newTable] || [];

    // Cập nhật thông tin khách hàng và sản phẩm đã đặt hàng cho bàn mới
    if (mergeTable) {
      // Gộp bàn
      const mergedProducts = [];

      productsForTable.forEach((product) => {
        const existingProduct = mergedProducts.find(
          (p) => p.productName === product.productName
        );
        if (existingProduct) {
          existingProduct.quantity += product.quantity;
        } else {
          mergedProducts.push({ ...product });
        }
      });

      productsForNewTable.forEach((product) => {
        const existingProduct = mergedProducts.find(
          (p) => p.productName === product.productName
        );
        if (existingProduct) {
          existingProduct.quantity += product.quantity;
        } else {
          mergedProducts.push({ ...product });
        }
      });

      storedProductsByTable[newTable] = mergedProducts;
      customerInfoArray[newTable] = [...customerInfoForNewTable, customerInfo];

      delete customerInfoArray[tableID];
      delete storedProductsByTable[tableID];
    } else {
      // Chuyển bàn
      customerInfoArray[newTable] = [...customerInfoArray[tableID]];
      storedProductsByTable[newTable] = [...productsForTable];

      delete customerInfoArray[tableID];
      delete storedProductsByTable[tableID];
    }

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
    <div className={totalOderClass}>
      <Navbar className="totalNav">
        <Container>
          <div>
            <Navbar className="pt-0 pb-0">
              Bàn <span className="ms-1">{tableID}</span>
            </Navbar>

            {customerInfo && (
              <span className="d-flex align-items-center">
                <Person2Icon className="me-1" size={"12px"} />
                {customerName}
              </span>
            )}
            {/* {customerInfo && (
              <small className="ms-4 ps-2 d-flex align-items-center">Điểm: 1</small>
            )} */}
          </div>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Tooltip title="Bàn có khách" arrow>
                <KeyboardArrowDownIcon
                  className="totalIconArrow"
                  sx={{ fontSize: 20 }}
                  style={{
                    transform: iconRotated ? "rotate(360deg)" : "rotate(0deg)",
                  }}
                  onClick={handleIconClick}
                />
              </Tooltip>
              <Tooltip title="Chuyển bàn" arrow>
                <DriveFileRenameOutlineIcon
                  className="ms-2 totalIconArrow"
                  sx={{ fontSize: 20 }}
                  onClick={handleIconEditClick}
                />
              </Tooltip>
              <Tooltip title="Gộp bàn" arrow>
                <MergeIcon
                  sx={{ fontSize: 20 }}
                  tooltipTitle={"gộp bàn"}
                  className="ms-2 totalIconArrow"
                  onClick={handleMergeButtonClick}
                />
              </Tooltip>
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
      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
      <Modal centered show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header className="justify-content-center">
          <Modal.Title className="blackColor ">
            {mergeTable ? "Gộp Bàn" : "Chuyển Bàn"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formNewTable">
              <Form.Label className="blackColor">
                {mergeTable ? "Chọn bàn mới:" : "Chọn bàn đến:"}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={`Nhập số bàn ${mergeTable ? "mới" : "đến"}`}
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
                {mergeTable ? "Gộp bàn" : "Chuyển bàn"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TotalOder;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Modal, Form } from "react-bootstrap";
import Tooltip from "@mui/material/Tooltip";
import SafetyDividerIcon from "@mui/icons-material/SafetyDivider";
import Invoice from "./Invoice";
import "./Oder.css";
import axios from "axios";
import { LinkAPI } from "../../LinkAPI";

function Total({ totalPrice, products, tableID }) {
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [splitInvoice, setSplitInvoice] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  useEffect(() => {
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }
    axios
      .get(`${LinkAPI}employees/account?account=${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserId(res.data.employeeId);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate, userName]);

  useEffect(() => {
    // Retrieve customer's phone number from localStorage
    const storedCustomerInfoArray = JSON.parse(
      localStorage.getItem("customerInfoArray")
    );
    if (storedCustomerInfoArray && storedCustomerInfoArray[tableID]) {
      const latestCustomerInfo =
        storedCustomerInfoArray[tableID][
          storedCustomerInfoArray[tableID].length - 1
        ];
      if (latestCustomerInfo && latestCustomerInfo.phoneNumber) {
        setPhoneNumber(latestCustomerInfo.phoneNumber);
      }
      if (latestCustomerInfo && latestCustomerInfo.customerName) {
        setPhoneName(latestCustomerInfo.customerName);
      }
    }
  }, [tableID]);
  const handleShowSplitModal = () => {
    if (products.length < 1) {
      alert("Không thể tách hoá đơn khi không có sản phẩm");
      return;
    }
    setShowSplitModal(true);
    // Initialize selected products and quantities
    const initialSelectedProducts = {};
    const initialProductQuantities = {};
    products.forEach((product) => {
      initialSelectedProducts[product.id] = false;
      initialProductQuantities[product.id] = 1;
    });
    setSelectedProducts(initialSelectedProducts);
    setProductQuantities(initialProductQuantities);
  };

  const handleCloseSplitModal = () => {
    setShowSplitModal(false);
  };

  const handleSplitBill = () => {
    const selectedProductsToPay = [];
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID] || [];

    for (const productId in selectedProducts) {
      if (selectedProducts[productId]) {
        const productQuantity = productQuantities[productId];
        // Tìm sản phẩm trong mảng productsForTable
        const productInTable = productsForTable.find(
          (product) => product.id === parseInt(productId)
        );
        if (productInTable && productQuantity === 0) {
          alert("Không thể tách khi giá trị bằng 0");
          return;
        }
        if (productInTable && productInTable.quantity >= productQuantity) {
          // Nếu số lượng sản phẩm đủ, thêm vào mảng selectedProductsToPay
          selectedProductsToPay.push({
            id: productId,
            quantity: productQuantity,
            price: productInTable.price, // Lấy giá từ sản phẩm trong mảng productsForTable
            productName: productInTable.productName, // Lấy tên sản phẩm từ sản phẩm trong mảng productsForTable
          });
          console.log(selectedProductsToPay);
        } else {
          // Nếu số lượng không đủ, hiển thị thông báo
          alert(`Sản phẩm ${productInTable.productName} không đủ số lượng.`);
          return;
        }
        // Tạo hoá đơn mới với các sản phẩm được chọn
        setSplitInvoice({
          totalPrice: selectedProductsToPay.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
          products: selectedProductsToPay,
        });
        setShowSplitModal(false);
        setShowModal(true); // Hiển thị Modal hoá đơn với thông tin đã được tách
      }
    }
  };

  const handleProductCheckboxChange = (productId) => {
    setSelectedProducts({
      ...selectedProducts,
      [productId]: !selectedProducts[productId],
    });
  };

  const handleQuantityChange = (productId, value) => {
    setProductQuantities({
      ...productQuantities,
      [productId]: value,
    });
  };

  const handlePayment = () => {
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID];

    const customers = {
      phoneNumber: phoneNumber,
      point: Math.floor((totalPrice * 10) / 100),
      name: phoneName,
    };

    if (splitInvoice) {
      // Step 1: Tạo hoá đơn mới và gửi lên máy chủ
      axios
        .post(
          `${LinkAPI}orders`,
          {
            ban: { id: tableID },
            orderDate: new Date(),
            totalAmount: splitInvoice.totalPrice,
            phoneNumber: phoneNumber,
            products: splitInvoice.products,
            employee: { employeeId: userId },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Invoice data sent successfully:", response.data);
          axios
            .get(`${LinkAPI}customers`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const filteredCustomers = response.data.filter(
                (customer) => customer.phoneNumber === phoneNumber
              );
              if (filteredCustomers.length > 0) {
                // Nếu khách hàng đã tồn tại, lấy thông tin về điểm hiện tại của họ
                const currentCustomer = filteredCustomers[0];
                console.log(currentCustomer);
                const currentPoints = currentCustomer.point || 0;

                // Tính toán điểm mới dựa trên tổng cộng của hoá đơn hiện tại
                const newPoints =
                  currentPoints +
                  Math.floor((splitInvoice.totalPrice * 10) / 100);
                customers.point = newPoints;
                // Cập nhật lại điểm của khách hàng
                axios
                  .put(`${LinkAPI}customers/${currentCustomer.id}`, customers, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    console.log(
                      "Customer points updated successfully:",
                      response.data
                    );
                  })
                  .catch((error) => {
                    console.error("Error updating customer points:", error);
                  });
              } else {
                // Nếu khách hàng chưa tồn tại, thêm mới thông tin khách hàng
                axios
                  .post(`${LinkAPI}customers`, customers, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    console.log(
                      "New customer added successfully:",
                      response.data
                    );
                  })
                  .catch((error) => {
                    console.error("Error adding new customer:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error fetching customer data:", error);
            });
          const maxOrderId = response.data.id;

          // Step 2: Tạo các order-items cho hoá đơn mới
          const orderItemPromises = splitInvoice.products.map(
            (productToPay) => {
              return axios.post(
                `${LinkAPI}order-items`,
                {
                  order: { id: maxOrderId },
                  product: { id: productToPay.id },
                  quantity: productToPay.quantity,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }
          );

          // Gửi các request tạo order-items song song
          Promise.all(orderItemPromises)
            .then((responses) => {
              console.log("Order items data sent successfully:", responses);
              // Trừ số lượng sản phẩm đã tách từ số lượng trong local storage
              const storedProductsByTable =
                JSON.parse(localStorage.getItem("selectedProductsByTable")) ||
                {};
              const productsForTable = storedProductsByTable[tableID] || [];

              splitInvoice.products.forEach((productToPay) => {
                const index = productsForTable.findIndex(
                  (product) => product.id === parseInt(productToPay.id)
                );
                if (index !== -1) {
                  productsForTable[index].quantity -= productToPay.quantity;
                }
                if (productsForTable[index].quantity <= 0) {
                  productsForTable.splice(index, 1);
                }
              });

              // Cập nhật lại local storage
              storedProductsByTable[tableID] = productsForTable;
              localStorage.setItem(
                "selectedProductsByTable",
                JSON.stringify(storedProductsByTable)
              );

              setShowModal(false);
              console.log(currentPath);
              if (currentPath === "/tableList") {
                window.location.reload();
              } else {
                navigate("/tableList");
              }
            })
            .catch((error) => {
              console.error("Error sending order items data:", error);
            });
        })
        .catch((error) => {
          console.error("Error sending invoice data:", error);
        });
    } else {
      const invoiceData = {
        ban: { id: tableID },
        orderDate: new Date(),
        totalAmount: totalPrice,
        phoneNumber: phoneNumber,
        employee: { employeeId: userId },
      };
      axios
        .post(`${LinkAPI}orders`, invoiceData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(invoiceData);
          console.log("Invoice data sent successfully:", response.data);
          axios
            .get(`${LinkAPI}customers`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const filteredCustomers = response.data.filter(
                (customer) => customer.phoneNumber === phoneNumber
              );
              if (filteredCustomers.length > 0) {
                // Nếu khách hàng đã tồn tại, lấy thông tin về điểm hiện tại của họ
                const currentCustomer = filteredCustomers[0];
                const currentPoints = currentCustomer.point || 0;

                // Tính toán điểm mới dựa trên tổng cộng của hoá đơn hiện tại
                const newPoints =
                  currentPoints + Math.floor((totalPrice * 10) / 100);
                customers.point = newPoints;

                // Cập nhật lại điểm của khách hàng
                axios
                  .put(`${LinkAPI}customers/${currentCustomer.id}`, customers, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    console.log(
                      "Customer points updated successfully:",
                      response.data
                    );
                  })
                  .catch((error) => {
                    console.error("Error updating customer points:", error);
                  });
              } else {
                // Nếu khách hàng chưa tồn tại, thêm mới thông tin khách hàng
                axios
                  .post(`${LinkAPI}customers`, customers, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    console.log(
                      "New customer added successfully:",
                      response.data
                    );
                  })
                  .catch((error) => {
                    console.error("Error adding new customer:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error fetching customer data:", error);
            });

          axios
            .get(`${LinkAPI}orders/max`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const maxOrderId = response.data;
              for (let i = 0; i < products.length; i++) {
                const orderItem = {
                  order: { id: maxOrderId },
                  product: { id: products[i].id },
                  quantity: products[i].quantity,
                };
                // Gửi dữ liệu order item
                axios
                  .post(`${LinkAPI}order-items`, orderItem, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    console.log(
                      "Order item data sent successfully:",
                      response.data
                    );
                  })
                  .catch((error) => {
                    console.error("Error sending order item data:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error fetching max order id:", error);
            });
        });

      if (productsForTable) {
        const updatedProducts = [];
        const updatedInfo = [];
        // Cập nhật mảng trong local storage
        storedProductsByTable[tableID] = updatedProducts;
        localStorage.setItem(
          "selectedProductsByTable",
          JSON.stringify(storedProductsByTable)
        );

        const storedInfoByTable =
          JSON.parse(localStorage.getItem("customerInfoArray")) || {};
        storedInfoByTable[tableID] = updatedInfo;
        localStorage.setItem(
          "customerInfoArray",
          JSON.stringify(storedInfoByTable)
        );
        setShowModal(false);

        if (currentPath === "/tableList") {
          window.location.reload();
        } else {
          navigate("/tableList");
        }
      }
    }
  };
  const handleShowModal = () => {
    if (totalPrice <= 0) {
      return alert("Không thể thanh toán khi không có sản phẩm");
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="total pt-3 pb-3">
      <div className="d-flex justify-content-between mb-2">
        <p>Tổng cộng: {totalPrice} K</p>
        <div className=" total-divideIcon d-flex justify-content-center align-items-center">
          <Tooltip title="Tách hoá đơn" placement="top" arrow>
            <SafetyDividerIcon
              sx={{ fontSize: 24 }}
              onClick={handleShowSplitModal}
            />
          </Tooltip>
        </div>
      </div>

      <Button
        variant="primary"
        style={{ width: "100%" }}
        onClick={handleShowModal}
      >
        Thanh toán
      </Button>

      {/* Modal hiển thị hoá đơn */}
      <Modal
        className="modalInvoice"
        centered
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="justify-content-center">
          <Modal.Title className="blackColor">Hoá Đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Invoice
            totalPrice={splitInvoice ? splitInvoice.totalPrice : totalPrice}
            products={splitInvoice ? splitInvoice.products : products}
            tableID={tableID}
            phoneNumber={phoneNumber}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="buttonDisible"
            variant="secondary"
            onClick={handleCloseModal}
          >
            Huỷ
          </Button>
          <Button onClick={handlePayment} variant="primary">
            Thanh Toán
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        centered
        show={showSplitModal}
        onHide={handleCloseSplitModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="justify-content-center">
          <Modal.Title className="blackColor">Tách Hoá Đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="blackColor">Tên bàn: {tableID}</h5>
          <p className="blackColor">SĐT: {phoneNumber}</p>

          <Form>
            <Form.Group controlId="formProducts">
              <Form.Label className="blackColor">Sản Phẩm</Form.Label>
              {products.map((product) => (
                <div key={product.id}>
                  <Form.Check
                    className="blackColor"
                    type="checkbox"
                    id={product.id}
                    label={product.productName}
                    onChange={() => handleProductCheckboxChange(product.id)}
                  />
                  <Form.Control
                    type="number"
                    value={productQuantities[product.id]}
                    min="1"
                    required
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value))
                    }
                  />
                </div>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="buttonDisible"
            variant="secondary"
            onClick={handleCloseSplitModal}
          >
            Huỷ
          </Button>
          <Button onClick={handleSplitBill} variant="primary">
            Tách Hoá Đơn
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Total;

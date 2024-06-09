import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { LinkAPI } from "../../LinkAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./branch.css";
function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    nameDepartment: "",
    fullAddress: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${LinkAPI}department`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  const handleAddBranch = async () => {
    try {
      const response = await axios.post(`${LinkAPI}department`, newBranch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBranches([...branches, response.data]);
      setShowModal(false);
      setNewBranch({ nameDepartment: "", fullAddress: "" });
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    try {
      await axios.delete(`${LinkAPI}department/${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBranches(branches.filter((branch) => branch.id !== branchId));
      setAnchorEl(null);
      setSelectedBranchId(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e, branchId) => {
    setAnchorEl(e.currentTarget);
    setSelectedBranchId(branchId);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="container mt-4">
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ color: "white", width: "100%" }}
      >
        <h3>Quản lý chi nhánh</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <AddIcon className="me-1" />
          Thêm chi nhánh
        </Button>
      </div>
      {branches.length < 1 ? (
        <i>Không có chi nhánh nào trên hệ thống</i>
      ) : (
        <div className="table mt-4">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Tên chi nhánh</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branches
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((branch, index) => (
                    <TableRow key={branch.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{branch.nameDepartment}</TableCell>
                      <TableCell>{branch.fullAddress}</TableCell>
                      <TableCell align="right">
                        <MoreVertIcon
                          aria-label="more"
                          id="long-button"
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, branch.id)}
                        />
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={handleClose}>
                            <EditIcon className="blackColor me-2" />
                            Chỉnh sửa
                          </MenuItem>
                          <MenuItem
                            className="logout-btn"
                            onClick={() => handleDeleteBranch(selectedBranchId)}
                          >
                            <DeleteIcon className="logout-btn me-2" />
                            Xoá
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className="adminHome_pagination"
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={branches.length}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage="Số dòng tối đa"
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm chi nhánh mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên chi nhánh</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên chi nhánh"
                value={newBranch.nameDepartment}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, nameDepartment: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ chi nhánh</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ chi nhánh"
                value={newBranch.fullAddress}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, fullAddress: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddBranch}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BranchManagement;

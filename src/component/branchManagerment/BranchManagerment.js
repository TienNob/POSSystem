import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./branch.css";

function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formBranch, setFormBranch] = useState({
    id: "",
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

  const handleSaveBranch = async () => {
    if (isEditing) {
      await handleEditBranch();
    } else {
      await handleAddBranch();
    }
  };

  const handleAddBranch = async () => {
    try {
      const response = await axios.post(`${LinkAPI}department`, formBranch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBranches([...branches, response.data]);
      setShowModal(false);
      setFormBranch({ id: "", nameDepartment: "", fullAddress: "" });
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const handleEditBranch = async () => {
    try {
      const response = await axios.put(
        `${LinkAPI}department/${formBranch.id}`,
        formBranch,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBranches(
        branches.map((branch) =>
          branch.id === formBranch.id ? response.data : branch
        )
      );
      setShowModal(false);
      setFormBranch({ id: "", nameDepartment: "", fullAddress: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing branch:", error);
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

  const handleEditClick = (branch) => {
    setFormBranch(branch);
    setIsEditing(true);
    setShowModal(true);
    handleClose();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormBranch({ id: "", nameDepartment: "", fullAddress: "" });
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
                <TableRow className="custom-colorRow">
                  <TableCell>ID</TableCell>
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
                          <MenuItem onClick={() => handleEditClick(branch)}>
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

      <Dialog open={showModal} onClose={handleModalClose}>
        <DialogTitle>
          {isEditing ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
        </DialogTitle>
        <DialogContent>
          <Form>
            <Form.Group className="mb-3 mt-3">
              <TextField
                id="outlined-basic"
                label="Tên chi nhánh"
                fullWidth
                variant="outlined"
                value={formBranch.nameDepartment}
                onChange={(e) =>
                  setFormBranch({
                    ...formBranch,
                    nameDepartment: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3 w-100">
              <TextField
                fullWidth
                label="Địa chỉ chi nhánh"
                variant="outlined"
                value={formBranch.fullAddress}
                onChange={(e) =>
                  setFormBranch({ ...formBranch, fullAddress: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleModalClose}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveBranch}
          >
            {isEditing ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BranchManagement;

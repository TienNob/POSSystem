import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { bouncy } from "ldrs";
function Loadding() {
  bouncy.register();
  return (
    <Modal
      className="loadding"
      disableAutoFocus
      open
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description"
      sx={{
        display: "flex",
        p: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <l-bouncy size="70" speed="1.25" color="#634fbb"></l-bouncy>
      </Box>
    </Modal>
  );
}
export default Loadding;

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import "./Nav.css";

function Nav() {
  return (
    <div className="navBar">
      <Navbar className="bg-body-tertiary Nav">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <BsArrowLeftShort size={"40px"} />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Link to="/history">
                <Button variant="primary">Hoá đơn</Button>
              </Link>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Nav;

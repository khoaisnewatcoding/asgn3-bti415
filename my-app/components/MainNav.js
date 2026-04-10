import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(readToken());
  }, [router.asPath]);

  const logout = () => {
    removeToken();
    setToken(null);
    router.push("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">Hoang Dang Khoa Nguyen</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/about">About</Nav.Link>
          </Nav>
          {token && (
            <Nav>
              <NavDropdown title={token.userName} id="user-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} href="/favourites">Favourites</NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
          {!token && (
            <Nav>
              <Nav.Link as={Link} href="/register">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
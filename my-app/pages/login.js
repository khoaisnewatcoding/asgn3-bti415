import { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PageHeader from "@/components/PageHeader";
import { favouritesAtom } from "@/store";
import { authenticateUser } from "@/lib/authenticate";
import { getFavourites } from "@/lib/userData";

export default function Login() {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function updateAtom() {
    setFavouritesList(await getFavourites());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setWarning("");
    setIsSubmitting(true);

    try {
      await authenticateUser(user, password);
      await updateAtom();
      router.push("/");
    } catch (err) {
      setWarning(err.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader text="Login" subtext="Log in to your account:" />
      {warning && <Alert variant="danger">{warning}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginUserName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Login"}
        </Button>
      </Form>
    </>
  );
}
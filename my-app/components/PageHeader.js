import Card from "react-bootstrap/Card";

export default function PageHeader({ text, subtext }) {
  return (
    <Card className="mb-4 bg-light">
      <Card.Body>
        <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{text}</span>
        {subtext && (
          <div style={{ marginTop: "0.5rem", color: "#555", fontSize: "1rem" }}>
            {subtext}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
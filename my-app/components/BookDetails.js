import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function BookDetails({ book, workId, showFavouriteBtn = true }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(workId));
  }, [favouritesList, workId]);

  if (!book) return <p>No book details available.</p>;

  // example cover image from Open Library
  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;

  // description
  const description = book.description
    ? typeof book.description === "string"
      ? book.description
      : book.description.value
    : "No description available.";

  // characters
  const characters = book.characters ? book.characters.join(", ") : "";

  // settings
  const settings = book.subject_places ? book.subject_places.join(", ") : "";

  // links
  const links = book.links || [];

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  const favouritesClicked = async () => {
    if (!workId) {
      return;
    }

    if (showAdded) {
      setFavouritesList(await removeFromFavourites(workId));
    } else {
      setFavouritesList(await addToFavourites(workId));
    }
  };

  return (
    <Row>
      <Col lg={4}>
        {coverUrl && (
          <img
            onError={handleImageError}
            className="img-fluid w-100"
            src={coverUrl}
            alt={book.title}
            style={{ maxWidth: 350 }}
          />
        )}
      </Col>
      <Col lg={8}>
        <Card className="mb-4">
          <Card.Body>
            <h3>{book.title}</h3>
            <p>{description}</p>
            {characters && (
              <>
                <h5>Characters</h5>
                <p>{characters}</p>
              </>
            )}
            {settings && (
              <>
                <h5>Settings</h5>
                <p>{settings}</p>
              </>
            )}
            {links.length > 0 && (
              <>
                <h5>More Information</h5>
                {links.map((link, idx) => (
                  <div key={idx}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.title || link.url}
                    </a>
                  </div>
                ))}
              </>
            )}
            {showFavouriteBtn && (
              <Button
                variant={showAdded ? "primary" : "outline-primary"}
                onClick={favouritesClicked}
                className="mt-3"
              >
                {showAdded ? "+ Favourite (added)" : "+ Favourite"}
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
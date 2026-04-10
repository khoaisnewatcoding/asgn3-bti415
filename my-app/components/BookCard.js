import Link from "next/link";
import Error from "next/error";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function BookCard({ workId }) {
	const { data, error } = useSWR(
		workId ? `https://openlibrary.org/works/${workId}.json` : null
	);

	if (error || (!data && workId === undefined)) {
		return <Error statusCode={404} />;
	}

	if (!data && !error) {
		return null;
	}

	if (!data) {
		return <Error statusCode={404} />;
	}

	const coverId = data.covers && data.covers.length > 0 ? data.covers[0] : null;
	const coverUrl = coverId
		? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
		: null;

	const handleImageError = (event) => {
		event.currentTarget.style.display = "none";
	};

	return (
		<Card className="h-100">
			{coverUrl && (
				<Card.Img
					variant="top"
					onError={handleImageError}
					className="img-fluid w-100"
					src={coverUrl}
					alt={data.title}
				/>
			)}
			<Card.Body className="d-flex flex-column">
				<Card.Title>{data.title || ""}</Card.Title>
				<Card.Text>{data.first_published_date || "N/A"}</Card.Text>
				<Button as={Link} href={`/works/${workId}`} variant="primary" className="mt-auto">
					View Details
				</Button>
			</Card.Body>
		</Card>
	);
}
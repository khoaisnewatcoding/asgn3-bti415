import PageHeader from "@/components/PageHeader";
import BookDetails from "@/components/BookDetails";

export async function getStaticProps() {
  const res = await fetch("https://openlibrary.org/works/OL9200964W.json");
  const data = await res.json();

  return { props: { book: data } };
}

export default function About({ book }) {
  return (
    <>
      <PageHeader text="About the Developer: Hoang Dang Khoa Nguyen" />
      <div>
          <b>Hoang Dang Khoa Nguyen</b>
        <p>
          I&apos;m a vietnamese student currently studying at Senecapolytechnic College. I have a passion for developing web applications and exploring new technologies. I enjoy working on projects that challenge me to learn and grow as a developer. In my free time, I like to read books, play video games, and spend time with friends and family. Growing up around comic books and games, I&apos;ve always been very fond of DC comics and one of my favorite author is Nei Gaiman and his books Sandman.
        </p>
        <BookDetails book={book} workId="OL9200964W" showFavouriteBtn={false} />
      </div>
    </>
  );
}

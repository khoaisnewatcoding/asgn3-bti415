import { useRouter } from 'next/router';
import useSWR from 'swr';
import BookDetails from '@/components/BookDetails';
import Error from 'next/error';
import PageHeader from '@/components/PageHeader';

export default function Work() {
  const router = useRouter();
  const { workId } = router.query;
  const { data, error, isLoading } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null
  );

  if (isLoading) {
    return null;
  }

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data || Object.keys(data).length === 0) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <PageHeader text={data.title || 'Book Details'} />
      <BookDetails book={data} workId={workId} />
    </>
  );
}

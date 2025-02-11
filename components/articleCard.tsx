import { NewsItem } from '@/components/myInterfaces';
import Image from 'next/image';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { sourceImages } from '@/components/sourceImages';
import Link from 'next/link';

type ArticleCartProps = {
  selectedNews: NewsItem[];
};

export default function ArticleCart({ selectedNews }: ArticleCartProps) {
  const alertArticle = async (item: NewsItem) => {
    const userConfirmed = confirm(
      'Möchten sie diesen Artikel/Herausgeber melden?'
    );
    if (userConfirmed) {
      try {
        const response = await fetch('/api/savetodb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ collectionName: 'Alerts', data: item }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Artikel/Herausgeber wurde gemeldet:', result);
          alert('Artikel/Herausgeber wurde gemeldet.');
        } else {
          console.error(
            'Fehler beim Melden des Artikels/Herausgebers:',
            response.statusText
          );
          alert('Fehler beim Melden des Artikels/Herausgebers.');
        }
      } catch (error) {
        console.error('Fehler beim Melden des Artikels/Herausgebers:', error);
        alert('Fehler beim Melden des Artikels/Herausgebers.');
      }
    }
  };

  function getSourceImage(source: keyof typeof sourceImages) {
    return sourceImages[source] || null;
  }

  return (
    <>
      {selectedNews.map((item, index) => (
        <Link key={index} href={item.url || item.link}>
          <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col justify-between h-full">
            <div>
              <div className="relative">
                <Image
                  src={
                    item.urlToImage ||
                    item.image ||
                    item.image_url ||
                    'https://fakeimg.pl/600x400?text=Kein+Bild'
                  }
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover"
                />
                <div
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer w-4 h-4 flex items-center justify-center"
                  onClick={() => alertArticle(item)}
                  title="Melden"
                >
                  <PriorityHighOutlinedIcon sx={{ fontSize: '12px' }} />
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  {item.description || 'Keine Beschreibung verfügbar'}
                </p>
              </div>
            </div>
            <div className="p-4 mt-auto">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString()
                    : item.published_at
                    ? new Date(item.published_at).toLocaleDateString()
                    : item.pubDate
                    ? new Date(item.pubDate).toLocaleDateString()
                    : item.image_url}
                </span>
                <span className="text-xs">
                  {(() => {
                    const sourceData = getSourceImage(
                      item.source as keyof typeof sourceImages
                    );
                    return sourceData ? (
                      <Image
                        src={sourceData.src}
                        alt={sourceData.alt}
                        className="inline-block"
                        width={sourceData.width}
                        height={sourceData.height}
                      />
                    ) : null;
                  })()}
                </span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </>
  );
}

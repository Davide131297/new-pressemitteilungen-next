export interface Institute {
  id: number;
  Name: string;
}

export interface Parliament {
  id: number;
  Shortcut: string;
  Name: string;
  Election: string;
}

export interface Party {
  id: number;
  Shortcut: string;
  Name: string;
}

export interface Survey {
  id: number;
  Date: string;
  Institute_ID: string;
  Method_ID: string;
  Parliament_ID: string;
  Results: number[];
  Survey_Period: {
    Date_End: string;
    Date_Start: string;
  };
  Surveyed_Persons: string;
  Tasker_ID: string;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  image_url: string;
  publishedAt: string;
  item: string;
  published_at: string;
  pubDate: string;
  source_icon: string;
  image: string;
  source: string | { id: string };
  link: string;
  date?: Date;
}

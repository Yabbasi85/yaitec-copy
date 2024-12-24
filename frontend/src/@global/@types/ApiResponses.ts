
type SocialMediaPlatformPosts = {
  [platform: string]: SocialMediaPost[];
};

type SocialMediaSummaryType = {
  [url: string]: SocialMediaPlatformPosts; 
};

type SocialMediaPost = {
  id: string;
  publishedAt: string;
  salary?: string;
  title?: string;
  jobUrl?: string;
  companyName?: string;
  location?: string;
  description?: string;

  // Facebook-specific fields
  facebookUrl?: string;
  postId?: string;
  pageName?: string;
  user?: {
    id: string;
    name: string;
    profileUrl: string;
    profilePic: string;
  };
  text?: string;
  link?: string;
  likes?: number;
  shares?: number;
  media?: Array<{
    thumbnail: string;
    photo_image: {
      uri: string;
      height: number;
      width: number;
    };
    ocrText?: string;
  }>;

  feedbackId?: string;
  topLevelUrl?: string;
  facebookId?: string;
  pageAdLibrary?: {
    is_business_page_active: boolean;
    id: string;
  };

  // Instagram-specific fields
  username?: string;
  fullName?: string;
  followersCount?: number;
  biography?: string;
  externalUrl?: string;

  // Twitter (X)-specific fields
  full_text?: string;
  permalink?: string;
  favorite_count?: number;

  // LinkedIn-specific fields
  numLikes?: number;
  numShares?: number;
  numComments?: number;
  authorName?: string;
  authorProfileUrl?: string;
  timeSincePosted?: string;

  // YouTube-specific fields
  url?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  date?: string;
  channelName?: string;
  channelUrl?: string;
  numberOfSubscribers?: number;
  channelDescription?: string;
};

export interface BusinessResponse {
  brand_voice: string;
  id: string;
  name: string;
  website: string;
  social_media: string;
  product?: string;
  location?: string;
  social_media_summary: SocialMediaSummaryType;
  competitors: Array<{
    name: string;
    url: string;
    description: string;
    products: string[];
    services: string[];
    about: string;
    vision: string;
    history: string;
}>;
  website_urls?: string[]; 
  extracted_social_links?: { [key: string]: string }; 
  competitors_website_data: Array<{ url: string; content: string }>;
}

export interface CompetitorsResponse {
  id: string;
  name: string;
  website: string;
  social_media: string;
  brand_voice: string;
}

export interface ContentApiResponse {
  id: string;
  content: string;
  createdAt: string;
  type: string;
}
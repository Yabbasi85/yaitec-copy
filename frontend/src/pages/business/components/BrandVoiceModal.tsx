import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  Text,
  List,
  ListItem,
  TabPanel,
  VStack,
  TabList,
  TabPanels,
  Tab,
  Tabs,
  Box,
  Link,
} from "@chakra-ui/react";


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
  name?: string;
  picture?: string;
  social?: string;
  education?: string;
  experiences?: string;
  about?: string;

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



type SocialMediaPlatformPosts = {
  [platform: string]: SocialMediaPost[];
};

type SocialMediaSummaryType = {
  [url: string]: SocialMediaPlatformPosts;
};

type BrandVoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  website: string;
  product: string;
  location: string;
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
  websiteUrls: string[];
  extractedSocialLinks: string[];
  socialMediaSummary: SocialMediaSummaryType;
  competitorsWebsiteData: Array<{ url: string; content: string }>;
};

const BrandVoiceModal = ({
  isOpen,
  onClose,
  website,
  product,
  location,
  competitors,
  websiteUrls,
  extractedSocialLinks,
  socialMediaSummary,
  competitorsWebsiteData,
}: BrandVoiceModalProps) => {
  const modalBg = useColorModeValue("brand.white", "gray.800");
  const headerColor = useColorModeValue("brand.darkBlue", "white");
  const buttonBg = useColorModeValue("brand.purple", "purple.600");
  const buttonHoverBg = useColorModeValue("brand.electricGreen", "green.400");
  const tabBg = useColorModeValue("gray.100", "gray.700");
  const tabSelectedBg = useColorModeValue("brand.purple", "purple.600");

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <VStack align="start" spacing={2} w="full">
      <Text fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      {children}
    </VStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent bg={modalBg} maxWidth="90vw" maxHeight="90vh">
        <ModalHeader color={headerColor}>Business Analytics</ModalHeader>
        <ModalCloseButton color={headerColor} />
        <ModalBody overflowY="auto">
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab _selected={{ bg: tabSelectedBg, color: "white" }}>Overview</Tab>
              <Tab _selected={{ bg: tabSelectedBg, color: "white" }}>Competitors</Tab>
              <Tab _selected={{ bg: tabSelectedBg, color: "white" }}>Website Data</Tab>
              <Tab _selected={{ bg: tabSelectedBg, color: "white" }}>Social Links</Tab>
              <Tab _selected={{ bg: tabSelectedBg, color: "white" }}>Website URLs</Tab>
              <Tab _selected={{ bg: tabSelectedBg, color: "white" }}>Social Media Summary</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Section title="Overview">
                  <Text><strong>Website:</strong> {website}</Text>
                  <Text><strong>Product:</strong> {product}</Text>
                  <Text><strong>Location:</strong> {location}</Text>
                </Section>
              </TabPanel>
              <TabPanel>
                <Section title="Competitors">
                  {competitors.map((competitor, index) => (
                    <Box key={index} bg={tabBg} p={4} borderRadius="md" mb={2}>
                      <Text fontWeight="bold" fontSize="xl">{competitor.name}</Text>

                      {/* Website link */}
                      <Link href={competitor.url} isExternal color="blue.500">
                        {competitor.url}
                      </Link>

                      {/* Description */}
                      <Text mt={2}>{competitor.description}</Text>

                      {/* Products */}
                      {competitor.products && (
                        <Section title="Products">
                          <List spacing={1}>
                            {competitor.products.map((product, i) => (
                              <ListItem key={i}>{product}</ListItem>
                            ))}
                          </List>
                        </Section>
                      )}

                      {/* Services */}
                      {competitor.services && (
                        <Section title="Services">
                          <List spacing={1}>
                            {competitor.services.map((service, i) => (
                              <ListItem key={i}>{service}</ListItem>
                            ))}
                          </List>
                        </Section>
                      )}

                      {/* About, Vision, History */}
                      <Text mt={4}><strong>About:</strong> {competitor.about}</Text>
                      <Text><strong>Vision:</strong> {competitor.vision}</Text>
                      <Text><strong>History:</strong> {competitor.history}</Text>
                    </Box>
                  ))}
                </Section>
              </TabPanel>
              <TabPanel>
                <Section title="Competitors Website Data">
                  {competitorsWebsiteData.length > 0 ? (
                    <List spacing={3}>
                      {competitorsWebsiteData.map((data, index) => (
                        <ListItem key={index} bg={tabBg} p={4} borderRadius="md">
                          <Text><strong>URL:</strong> <Link href={data.url} isExternal color="blue.500">{data.url}</Link></Text>
                          <Text><strong>Content:</strong>{data.content}</Text>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text>No competitors website data available.</Text>
                  )}
                </Section>
              </TabPanel>
              <TabPanel>
                <Section title="Extracted Social Links">
                  {extractedSocialLinks.map((url, index) => (
                    <Box key={index} bg={tabBg} p={4} borderRadius="md" mb={2}>
                      <Text fontWeight="bold">Social Link</Text>
                      <Link href={url} isExternal color="blue.500">
                        {url}
                      </Link>
                    </Box>
                  ))}
                </Section>
              </TabPanel>
              <TabPanel>
                <Section title="Website URLs">
                  {websiteUrls.length > 0 ? (
                    <List spacing={3}>
                      {websiteUrls.map((url, index) => (
                        <ListItem key={index}>
                          <Link href={url} isExternal color="blue.500">
                            {url}
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text>No additional URLs available.</Text>
                  )}
                </Section>
              </TabPanel>
              <TabPanel>
                <Section title="Social Media Summary">
                  {Array.isArray(socialMediaSummary) && socialMediaSummary.length > 0 ? (
                    <List spacing={3}>
                      {socialMediaSummary.map((summary, index) => (
                        typeof summary === 'object' && summary !== null ? (
                          Object.entries(summary as SocialMediaSummaryType).map(([url, platforms]) => (
                            <ListItem key={`${index}-${url}`} bg={tabBg} p={4} borderRadius="md">
                              <Text fontWeight="bold">URL: <Link href={url} isExternal color="blue.500">{url}</Link></Text>
                              {Object.entries(platforms).map(([platform, posts]) => (
                                <Box key={`${platform}-${index}`} mt={2}>
                                  <Text fontWeight="bold">Platform: {platform}</Text>
                                  {Array.isArray(posts) && posts.length > 0 ? (
                                    posts.map((post, postIndex) => (
                                      <Box key={postIndex} mt={2} pl={4}>
                                        {platform === "Instagram" && post.username ? (
                                          <>
                                            <Text><strong>Username:</strong> {post.username}</Text>
                                            <Text><strong>Full Name:</strong> {post.fullName}</Text>
                                            <Text><strong>Followers:</strong> {post.followersCount}</Text>
                                            <Text><strong>Biography:</strong> {post.biography}</Text>
                                            <Link href={post.externalUrl} isExternal color="blue.500">External Link</Link>
                                          </>
                                        ) : platform === "X" && post.full_text ? (
                                          <>
                                            <Text><strong>Tweet:</strong> {post.full_text}</Text>
                                            <Link href={`https://x.com${post.permalink}`} isExternal color="blue.500">See on X</Link>
                                            <Text><strong>Likes:</strong> {post.favorite_count}</Text>
                                          </>
                                        ) : platform === "Facebook" && post.facebookUrl ? (
                                          <>
                                            <Text><strong>Facebook URL:</strong> <Link href={post.facebookUrl} isExternal color="blue.500">{post.facebookUrl}</Link></Text>
                                            <Text><strong>Post Text:</strong> {post.text}</Text>
                                            <Text><strong>Likes:</strong> {post.likes || 0}</Text>
                                          </>
                                        ) : platform === "LinkedIn" ? (
                                          <>
                                            <Box key={index} mt={2} pl={4} borderLeft="2px solid" borderColor="gray.200">
                                              <Text><strong>Name:</strong> {post.name}</Text>
                                              <Box mt={2}>
                                                <img src={post.picture} alt={post.name} style={{ maxWidth: '50%' }} />
                                              </Box>
                                              <Link href={post.url} isExternal color="blue.500">View on LinkedIn</Link>
                                              <Text><strong>About:</strong> {post.about}</Text>
                                              <Text><strong>Location:</strong> {post.location}</Text>
                                              <Text><strong>Education:</strong> {post.education}</Text>
                                              <Text><strong>Experiences:</strong> {post.experiences}</Text>
                                            </Box>
                                          </>
                                        ) : platform === "YouTube" && post.url ? (
                                          <>
                                            <Text><strong>Video Title:</strong> {post.title}</Text>
                                            <Link href={post.url} isExternal color="blue.500">Watch on YouTube</Link>
                                            <Text><strong>Views:</strong> {post.viewCount}</Text>
                                            <Text><strong>Channel Name:</strong> <Link href={post.channelUrl} isExternal color="blue.500">{post.channelName}</Link></Text>
                                            <Text><strong>Subscribers:</strong> {post.numberOfSubscribers}</Text>
                                            <Text><strong>Channel Description:</strong> {post.channelDescription}</Text>
                                            <Text><strong>Video Date:</strong> {post.date ? new Date(post.date).toLocaleDateString() : "Date not available"}</Text>
                                            <Box mt={2}>
                                              <img src={post.thumbnailUrl} alt={post.title} style={{ maxWidth: '50%' }} />
                                            </Box>
                                          </>
                                        ) : (
                                          <Text>{post.title || "No posts available."}</Text>
                                        )}
                                      </Box>
                                    ))
                                  ) : (
                                    <Text>No posts available for this platform.</Text>
                                  )}
                                </Box>
                              ))}
                            </ListItem>
                          ))
                        ) : null
                      ))}
                    </List>
                  ) : (
                    <Text>No social media summary available.</Text>
                  )}
                </Section>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button bg={buttonBg} color="white" _hover={{ bg: buttonHoverBg }} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BrandVoiceModal;

export type Lang = "fr" | "ar";

export type Poem = {
  id: string;
  titleFr: string;
  titleAr: string;
  authorFr: string;
  authorAr: string;
  translatorFr?: string;
  translatorAr?: string;
  introFr?: string;
  introAr?: string;
  dedicationFr?: string;
  dedicationAr?: string;
  placeFr?: string;
  placeAr?: string;
  bodyFr: string;
  bodyAr: string;
  featured?: boolean;
  source?: "official" | "admin" | "community";
};

export type Comment = {
  id: string;
  poemId: string;
  author: string;
  body: string;
  createdAt: string;
  avatar?: string;
};

export type Reaction = {
  id: string;
  poemId: string;
  visitorId: string;
  createdAt?: string;
};

export type Submission = {
  id: string;
  author: string;
  titleFr: string;
  titleAr: string;
  bodyFr: string;
  bodyAr: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type AdminPoem = {
  id: string;
  titleFr: string;
  titleAr: string;
  authorFr: string;
  authorAr: string;
  translatorFr?: string;
  translatorAr?: string;
  introFr?: string;
  introAr?: string;
  dedicationFr?: string;
  dedicationAr?: string;
  placeFr?: string;
  placeAr?: string;
  bodyFr: string;
  bodyAr: string;
  createdAt: string;
};

export type StoreData = {
  comments: Comment[];
  reactions: Reaction[];
  submissions: Submission[];
  adminPoems: AdminPoem[];
  poems: AdminPoem[];
  seeded?: boolean;
};

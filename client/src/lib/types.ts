export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  sport: string;
  competition: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  startsAt: string;
  endsAt: string | null;
  commentaryLang: string;
  isFeatured: boolean;
  status: string;
  venueArea: string | null;
  description: string | null;
  heroImageUrl: string | null;
}

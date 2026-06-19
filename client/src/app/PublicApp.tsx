import { Route, Switch } from "wouter";
import { PublicLayout } from "../components/PublicLayout";
import HomePage from "../pages/Home";
import SportsBarPage from "../pages/SportsBar";
import WhatsOnPage from "../pages/WhatsOn";
import WorldCupPage from "../pages/WorldCup";
import WorldCupTeamPage from "../pages/WorldCupTeam";
import WorldCupMatchPage from "../pages/WorldCupMatch";
import WatchSportPage from "../pages/WatchSport";
import BlogIndexPage from "../pages/Blog";
import BlogCategoryPage from "../pages/BlogCategory";
import BlogPostPage from "../pages/BlogPost";
import AboutPage from "../pages/About";
import ReservationsPage from "../pages/Reservations";
import ContactPage from "../pages/Contact";
import FaqPage from "../pages/Faq";
import {
  PrivacyPage,
  CookiesPage,
  LegalNoticePage,
  TermsPage,
  AccessibilityPage,
} from "../pages/Legal";
import NotFoundPage from "../pages/NotFound";

export function PublicApp() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/sports-bar" component={SportsBarPage} />
        <Route path="/whats-on" component={WhatsOnPage} />
        <Route path="/world-cup-2026" component={WorldCupPage} />
        <Route path="/world-cup-2026/team/:teamSlug" component={WorldCupTeamPage} />
        <Route path="/world-cup-2026/:matchSlug" component={WorldCupMatchPage} />
        <Route path="/watch/:competitionSlug" component={WatchSportPage} />
        <Route path="/blog" component={BlogIndexPage} />
        <Route path="/blog/category/:categorySlug" component={BlogCategoryPage} />
        <Route path="/blog/:postSlug" component={BlogPostPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/reservations" component={ReservationsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/cookies" component={CookiesPage} />
        <Route path="/legal-notice" component={LegalNoticePage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/accessibility" component={AccessibilityPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </PublicLayout>
  );
}

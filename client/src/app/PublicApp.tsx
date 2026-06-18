import { Route, Switch } from "wouter";
import { PublicLayout } from "../components/PublicLayout";
import HomePage from "../pages/Home";
import SportsBarPage from "../pages/SportsBar";
import WhatsOnPage from "../pages/WhatsOn";
import WorldCupPage from "../pages/WorldCup";
import WorldCupTeamPage from "../pages/WorldCupTeam";
import WorldCupMatchPage from "../pages/WorldCupMatch";
import WatchSportPage from "../pages/WatchSport";
import AboutPage from "../pages/About";
import ReservationsPage from "../pages/Reservations";
import ContactPage from "../pages/Contact";
import FaqPage from "../pages/Faq";
import { PrivacyPage, CookiesPage } from "../pages/Legal";
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
        <Route path="/about" component={AboutPage} />
        <Route path="/reservations" component={ReservationsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/cookies" component={CookiesPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </PublicLayout>
  );
}

import { Route, Switch } from "wouter";
import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminLeads from "../pages/admin/Leads";
import AdminEvents from "../pages/admin/Events";
import AdminReservations from "../pages/admin/Reservations";
import AdminCampaigns from "../pages/admin/Campaigns";
import { AdminShell } from "../components/admin/AdminShell";

export function AdminApp() {
  return (
    <Switch>
      <Route path="/login" component={AdminLogin} />
      <Route>
        <AdminShell>
          <Switch>
            <Route path="/" component={AdminDashboard} />
            <Route path="/leads" component={AdminLeads} />
            <Route path="/events" component={AdminEvents} />
            <Route path="/reservations" component={AdminReservations} />
            <Route path="/campaigns" component={AdminCampaigns} />
            <Route>
              <div className="p-8 text-ink-soft">Not found</div>
            </Route>
          </Switch>
        </AdminShell>
      </Route>
    </Switch>
  );
}

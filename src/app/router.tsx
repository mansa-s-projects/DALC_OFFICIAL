import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import VenueDetail from '../features/nightlife/pages/VenueDetail';
import Request from '../pages/Request';
import RequestSuccess from '../pages/RequestSuccess';
import Onboarding from '../pages/Onboarding';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyRequests from '../pages/MyRequests';
import AuthGuard from '../components/auth/AuthGuard';
import AdminGuard from '../components/auth/AdminGuard';
import AdminLayout from '../admin/pages/AdminLayout';
import AdminOverview from '../admin/pages/AdminOverview';
import AdminVenues from '../admin/pages/AdminVenues';
import AdminVenueForm from '../admin/pages/AdminVenueForm';
import AdminRequests from '../admin/pages/AdminRequests';
import AdminSuppliers from '../admin/pages/AdminSuppliers';
import AdminSupplierForm from '../admin/pages/AdminSupplierForm';

// ─── Move to Dubai (Pillar 1) ─────────────────────────────────────────────────
import MoveToDubai from '../features/move-to-dubai/pages/MoveToDubai';
import Intake from '../features/move-to-dubai/pages/Intake';
import Dashboard from '../features/move-to-dubai/pages/Dashboard';
import Documents from '../features/move-to-dubai/pages/Documents';
import CostEstimator from '../features/move-to-dubai/pages/CostEstimator';

// ─── Experiences (Pillar 2) ───────────────────────────────────────────────────
import ExperiencesHub from '../features/experiences/pages/ExperiencesHub';
import ExperiencesSubcategoryList from '../features/experiences/pages/SubcategoryList';
import ExperienceDetail from '../features/experiences/pages/ExperienceDetail';

// ─── Nightlife (Pillar 3) ─────────────────────────────────────────────────────
import Nightlife from '../features/nightlife/pages/NightlifeHub';
import NightClubs from '../features/nightlife/pages/NightClubs';
import BeachClubs from '../features/nightlife/pages/BeachClubs';
import Restaurants from '../features/nightlife/pages/Restaurants';
import DiningEntertainment from '../features/nightlife/pages/DiningEntertainment';

// ─── Stays (Pillar 4) ─────────────────────────────────────────────────────────
import StaysHub from '../features/stays/pages/StaysHub';
import HotelsList from '../features/stays/pages/HotelsList';
import VillasList from '../features/stays/pages/VillasList';
import ResidencesList from '../features/stays/pages/ResidencesList';
import PropertyDetail from '../features/stays/pages/PropertyDetail';

// ─── Transport (Pillar 5) ─────────────────────────────────────────────────────
import TransportHub from '../features/transport/pages/TransportHub';
import CarsList from '../features/transport/pages/CarsList';
import YachtsList from '../features/transport/pages/YachtsList';
import JetsList from '../features/transport/pages/JetsList';
import TransportDetail from '../features/transport/pages/TransportDetail';

// ─── Business Setup (Pillar 6) ────────────────────────────────────────────────
import BusinessHub from '../features/business/pages/BusinessHub';
import BusinessSubcategoryList from '../features/business/pages/SubcategoryList';
import ServiceDetail from '../features/business/pages/ServiceDetail';
import ConsultationPage from '../features/business/pages/ConsultationPage';

// ─── Concierge (Pillar 7) ─────────────────────────────────────────────────────
import ConciergeHub from '../pages/concierge/ConciergeHub';
import ConciergeRequest from '../pages/concierge/ConciergeRequest';

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Shell ─────────────────────────────────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── Explore ───────────────────────────────────────────────────────── */}
      <Route path="/explore" element={<Explore />} />
      <Route path="/explore/:filter" element={<Explore />} />

      {/* ── Venue Detail (cross-vertical) ─────────────────────────────────── */}
      <Route path="/venue/:id" element={<VenueDetail />} />

      {/* ── Request System ────────────────────────────────────────────────── */}
      <Route path="/request" element={<Request />} />
      <Route path="/request/success" element={<RequestSuccess />} />
      <Route path="/my-requests" element={<AuthGuard><MyRequests /></AuthGuard>} />

      {/* ── Admin ─────────────────────────────────────────────────────────── */}
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="venues" element={<AdminVenues />} />
        <Route path="venues/new" element={<AdminVenueForm />} />
        <Route path="venues/:id" element={<AdminVenueForm />} />
        <Route path="suppliers" element={<AdminSuppliers />} />
        <Route path="suppliers/new" element={<AdminSupplierForm />} />
        <Route path="suppliers/:id" element={<AdminSupplierForm />} />
      </Route>

      {/* ── Pillar 1: Move to Dubai ───────────────────────────────────────── */}
      <Route path="/move-to-dubai" element={<MoveToDubai />} />
      <Route path="/move-to-dubai/intake" element={<AuthGuard><Intake /></AuthGuard>} />
      <Route path="/move-to-dubai/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
      <Route path="/move-to-dubai/documents" element={<AuthGuard><Documents /></AuthGuard>} />
      <Route path="/move-to-dubai/cost" element={<AuthGuard><CostEstimator /></AuthGuard>} />

      {/* ── Pillar 2: Experiences ─────────────────────────────────────────── */}
      <Route path="/experiences" element={<ExperiencesHub />} />
      <Route path="/experiences/:subcategory" element={<ExperiencesSubcategoryList />} />
      <Route path="/experiences/:subcategory/:slug" element={<ExperienceDetail />} />

      {/* ── Pillar 3: Nightlife ───────────────────────────────────────────── */}
      <Route path="/nightlife" element={<Nightlife />} />
      <Route path="/nightlife/clubs" element={<NightClubs />} />
      <Route path="/nightlife/beach-clubs" element={<BeachClubs />} />
      <Route path="/nightlife/restaurants" element={<Restaurants />} />
      <Route path="/nightlife/dining" element={<DiningEntertainment />} />

      {/* ── Pillar 4: Stays ───────────────────────────────────────────────── */}
      <Route path="/stays" element={<StaysHub />} />
      <Route path="/stays/hotels" element={<HotelsList />} />
      <Route path="/stays/villas" element={<VillasList />} />
      <Route path="/stays/residences" element={<ResidencesList />} />
      <Route path="/stays/:subcategory/:slug" element={<PropertyDetail />} />

      {/* ── Pillar 5: Transport ───────────────────────────────────────────── */}
      <Route path="/transport" element={<TransportHub />} />
      <Route path="/transport/cars" element={<CarsList />} />
      <Route path="/transport/yachts" element={<YachtsList />} />
      <Route path="/transport/jets" element={<JetsList />} />
      <Route path="/transport/:subcategory/:slug" element={<TransportDetail />} />

      {/* ── Pillar 6: Business Setup ──────────────────────────────────────── */}
      <Route path="/business" element={<BusinessHub />} />
      <Route path="/business/:subcategory" element={<BusinessSubcategoryList />} />
      <Route path="/business/:subcategory/:slug" element={<ServiceDetail />} />
      <Route path="/business/consultation/:id" element={<ConsultationPage />} />

      {/* ── Pillar 7: Concierge ───────────────────────────────────────────── */}
      <Route path="/concierge" element={<ConciergeHub />} />
      <Route path="/concierge/request" element={<ConciergeRequest />} />

      {/* ── Live Map ──────────────────────────────────────────────────────── */}
      <Route path="/live-map" element={<div className="pt-40 text-center text-white">Live Map Coming Soon</div>} />

      {/* ── Legacy Redirects ──────────────────────────────────────────────── */}
      {/* Nightlife sub-pages previously at root level */}
      <Route path="/restaurants" element={<Navigate to="/nightlife/restaurants" replace />} />
      <Route path="/beach-clubs" element={<Navigate to="/nightlife/beach-clubs" replace />} />
      <Route path="/dining-entertainment" element={<Navigate to="/nightlife/dining" replace />} />
      {/* Old /explore/* editorial routes */}
      <Route path="/explore/dining" element={<Navigate to="/nightlife/restaurants" replace />} />
      <Route path="/explore/beach-clubs" element={<Navigate to="/nightlife/beach-clubs" replace />} />
      <Route path="/explore/nightlife" element={<Navigate to="/nightlife" replace />} />
      <Route path="/explore/dining-entertainment" element={<Navigate to="/nightlife/dining" replace />} />
      <Route path="/explore/experiences" element={<Navigate to="/experiences" replace />} />
      {/* Old broken /experiences/category prefix */}
      <Route path="/experiences/category" element={<Navigate to="/experiences" replace />} />
      {/* Auth */}
      <Route path="/auth" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

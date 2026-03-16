import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from '../components/auth/AuthGuard';
import AdminGuard from '../components/auth/AdminGuard';
const Home = lazy(() => import('../pages/home/HomePage'));
const Explore = lazy(() => import('../pages/explore/ExplorePage'));
const VenueDetail = lazy(() => import('../pages/nightlife/VenueDetail'));
const Request = lazy(() => import('../pages/Request'));
const RequestSuccess = lazy(() => import('../pages/RequestSuccess'));
const RequestDetail = lazy(() => import('../pages/RequestDetail'));
const Onboarding = lazy(() => import('../pages/auth/Onboarding'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const MyRequests = lazy(() => import('../pages/concierge/MyRequests'));
const AdminLayout = lazy(() => import('../admin/pages/AdminLayout'));
const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'));
const AdminVenues = lazy(() => import('../pages/admin/AdminVenues'));
const AdminVenueForm = lazy(() => import('../admin/pages/AdminVenueForm'));
const AdminRequests = lazy(() => import('../pages/admin/AdminRequests'));
const AdminSuppliers = lazy(() => import('../admin/pages/AdminSuppliers'));
const AdminSupplierForm = lazy(() => import('../admin/pages/AdminSupplierForm'));
const AdminConcierge = lazy(() => import('../admin/pages/AdminConcierge'));
const AdminTransport = lazy(() => import('../admin/pages/AdminTransport'));
const AdminExperiences = lazy(() => import('../admin/pages/AdminExperiences'));
const AdminBusiness = lazy(() => import('../admin/pages/AdminBusiness'));
const AdminStays = lazy(() => import('../admin/pages/AdminStays'));
const LiveMapPage = lazy(() => import('../features/live-map/LiveMapPage'));
const MoveToDubai = lazy(() => import('../pages/move-to-dubai/MoveToDubaiPage'));
const Intake = lazy(() => import('../pages/move-to-dubai/VisaServices'));
const Dashboard = lazy(() => import('../pages/move-to-dubai/RelocationServices'));
const Documents = lazy(() => import('../pages/move-to-dubai/BankSetup'));
const CostEstimator = lazy(() => import('../pages/move-to-dubai/Schooling'));
const ExperiencesHub = lazy(() => import('../pages/experiences/ExperiencesHub'));
const ExperiencesSubcategoryList = lazy(() => import('../features/experiences/pages/SubcategoryList'));
const ExperienceDetail = lazy(() => import('../pages/experiences/ExperienceDetail'));
const Nightlife = lazy(() => import('../pages/nightlife/NightlifeHub'));
const NightClubs = lazy(() => import('../pages/nightlife/Nightclubs'));
const BeachClubs = lazy(() => import('../pages/nightlife/BeachClubs'));
const Restaurants = lazy(() => import('../pages/nightlife/Restaurants'));
const DiningEntertainment = lazy(() => import('../pages/nightlife/PrivateEvents'));
const TravelHub = lazy(() => import('../pages/travel/TravelHub'));
const Flights = lazy(() => import('../pages/travel/Flights'));
const Hotels = lazy(() => import('../pages/travel/Hotels'));
const Villas = lazy(() => import('../pages/travel/Villas'));
const Residences = lazy(() => import('../pages/travel/Residences'));
const PropertyDetail = lazy(() => import('../features/stays/pages/PropertyDetail'));
const TransportHub = lazy(() => import('../features/transport/pages/TransportHub'));
const CarsList = lazy(() => import('../features/transport/pages/CarsList'));
const YachtsList = lazy(() => import('../features/transport/pages/YachtsList'));
const JetsList = lazy(() => import('../features/transport/pages/JetsList'));
const TransportDetail = lazy(() => import('../features/transport/pages/TransportDetail'));
const BusinessHub = lazy(() => import('../pages/business/BusinessHub'));
const BusinessSubcategoryList = lazy(() => import('../features/business/pages/SubcategoryList'));
const ServiceDetail = lazy(() => import('../features/business/pages/ServiceDetail'));
const ConsultationPage = lazy(() => import('../pages/business/ConsultationPage'));
const ConciergeHub = lazy(() => import('../pages/concierge/ConciergeHub'));
const ConciergeRequest = lazy(() => import('../pages/concierge/RequestPage'));
const SearchResults = lazy(() => import('../pages/explore/SearchResults'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

function RouteLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#050607] px-6 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-[#C8A46B]/20 bg-[#111214]/85 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-[#C8A46B]/35 border-t-[#E1C58A] animate-spin" />
        <p className="font-display text-2xl text-[#EFD7A4]">Dubai A La Carte</p>
        <p className="mt-2 text-sm tracking-[0.08em] text-white/55">Loading destination</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
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
      <Route path="/my-requests/:id" element={<AuthGuard><RequestDetail /></AuthGuard>} />

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
        <Route path="concierge" element={<AdminConcierge />} />
        <Route path="transport" element={<AdminTransport />} />
        <Route path="experiences" element={<AdminExperiences />} />
        <Route path="business" element={<AdminBusiness />} />
        <Route path="stays" element={<AdminStays />} />
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

      {/* ── Pillar 4: Travel ─────────────────────────────────────────────── */}
      <Route path="/travel" element={<TravelHub />} />
      <Route path="/travel/flights" element={<Flights />} />
      <Route path="/travel/hotels" element={<Hotels />} />
      <Route path="/travel/villas" element={<Villas />} />
      <Route path="/travel/residences" element={<Residences />} />
      <Route path="/travel/:subcategory/:slug" element={<PropertyDetail />} />

      {/* Legacy stays paths */}
      <Route path="/stays" element={<Navigate to="/travel" replace />} />
      <Route path="/stays/hotels" element={<Navigate to="/travel/hotels" replace />} />
      <Route path="/stays/villas" element={<Navigate to="/travel/villas" replace />} />
      <Route path="/stays/residences" element={<Navigate to="/travel/residences" replace />} />
      <Route path="/stays/:subcategory/:slug" element={<Navigate to="/travel" replace />} />

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

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <Route path="/search" element={<SearchResults />} />

      {/* ── Profile ───────────────────────────────────────────────────────── */}
      <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />

      {/* ── Live Map ──────────────────────────────────────────────────────── */}
      <Route path="/live-map" element={<LiveMapPage />} />

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
    </Suspense>
  );
}

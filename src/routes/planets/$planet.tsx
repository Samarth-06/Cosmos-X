import { createFileRoute, Navigate } from "@tanstack/react-router";
import PlanetAcademy from "@/components/PlanetAcademy";
import { AcademyPlanetId, PLANET_ACADEMIES } from "@/lib/planet-academies";

export const Route = createFileRoute("/planets/$planet")({
  component: PlanetAcademyRoute,
});

function PlanetAcademyRoute() {
  const { planet } = Route.useParams();
  if (!(planet in PLANET_ACADEMIES)) return <Navigate to="/" />;
  return <PlanetAcademy planetId={planet as AcademyPlanetId} />;
}

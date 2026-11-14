import {
  PrivacyRoute,
  privacyMetadata,
  type PrivacyRouteProps,
} from "@/components/pages/privacy-route";

// Spanish privacy policy: /es/privacidad. /en/privacidad is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "es" }];
}

export function generateMetadata({ params }: PrivacyRouteProps) {
  return privacyMetadata(params, "es");
}

export default function Page({ params }: PrivacyRouteProps) {
  return <PrivacyRoute params={params} lang="es" />;
}

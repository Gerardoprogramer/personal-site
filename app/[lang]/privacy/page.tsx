import {
  PrivacyRoute,
  privacyMetadata,
  type PrivacyRouteProps,
} from "@/components/pages/privacy-route";

// English privacy policy: /en/privacy. /es/privacy is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export function generateMetadata({ params }: PrivacyRouteProps) {
  return privacyMetadata(params, "en");
}

export default function Page({ params }: PrivacyRouteProps) {
  return <PrivacyRoute params={params} lang="en" />;
}

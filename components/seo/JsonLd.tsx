import { serializeJsonLd } from "@/lib/structured-data";

// One <script type="application/ld+json"> per schema.org object.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

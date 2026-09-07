import { fetchPropertyById } from "../../lib/data";
import PropertyDetailClient from "./PropertyDetailClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    return [];
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
    const property = await fetchPropertyById(params.id);

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
                <Link href="/properties" className="text-[var(--primary)] hover:underline">Back to Properties</Link>
            </div>
        );
    }

    return <PropertyDetailClient initialProperty={property} />;
}

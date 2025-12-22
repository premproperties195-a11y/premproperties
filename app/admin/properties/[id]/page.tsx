import fs from "fs";
import path from "path";
import PropertyEditClient from "./PropertyEditClient";

export async function generateStaticParams() {
    try {
        const dataPath = path.join(process.cwd(), "app/data/properties.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        const params = data.map((p: any) => ({ id: p.id }));
        params.push({ id: "new" });
        return params;
    } catch (e) {
        return [{ id: "new" }];
    }
}

export default function PropertyEdit({ params }: { params: { id: string } }) {
    return <PropertyEditClient id={params.id} />;
}

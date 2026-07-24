import { AdminShell } from "@/components/admin/AdminShell";
import { DestinationEditor, type DestinationDraft } from "@/components/admin/DestinationEditor";

const empty: DestinationDraft = {
  name: "", slug: "", region: "", keyFact: "", overview: "", attractions: [""],
  bestTime: "", gettingThere: "", image: "", lat: 9.0108, lng: 38.7613, distanceFromAddisKm: 0,
};

export default function NewDestinationPage() {
  return (
    <AdminShell title="New destination">
      <DestinationEditor initial={empty} />
    </AdminShell>
  );
}

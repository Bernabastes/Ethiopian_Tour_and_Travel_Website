import { AdminShell } from "@/components/admin/AdminShell";
import { GuideEditor, type GuideDraft } from "@/components/admin/GuideEditor";

const empty: GuideDraft = {
  name: "", slug: "", title: "", yearsExperience: 5, licenseNumber: "",
  specialties: [""], languages: ["Amharic", "English"], bio: "", rating: 5, image: "",
};

export default function NewGuidePage() {
  return (
    <AdminShell title="New guide">
      <GuideEditor initial={empty} />
    </AdminShell>
  );
}

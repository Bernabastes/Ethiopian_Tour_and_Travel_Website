import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor, type BlogDraft } from "@/components/admin/BlogEditor";

const empty: BlogDraft = {
  title: "", slug: "", excerpt: "", content: "", coverImage: "",
  category: "Travel Tips", author: "Habesha Heritage Tours", readMinutes: 5,
  metaTitle: "", metaDescription: "", published: false,
};

export default function NewBlogPostPage() {
  return (
    <AdminShell title="New blog post">
      <BlogEditor initial={empty} />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin/AdminShell";
import { MessagesList, type MessageRow } from "@/components/admin/MessagesList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getMessages(): Promise<MessageRow[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      subject: m.subject,
      tour: m.tour,
      message: m.message,
      status: m.status,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[ADMIN] messages query failed:", err);
    return null;
  }
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return (
    <AdminShell title="Messages">
      {messages === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">
          Database not connected yet.
        </div>
      ) : (
        <MessagesList initial={messages} />
      )}
    </AdminShell>
  );
}

import { useUserStore } from "@/store";

export function Admin() {
  const { user } = useUserStore();

  if (!user) {
    return null;
  }

  return (
    <div className="flex  min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <h1>Admin {user.email}</h1>
    </div>
  );
}

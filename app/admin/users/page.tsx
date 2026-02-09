// // // // export const runtime = 'edge';
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserRoleForm } from "./_components/user-role-form";
import { CreateUserForm } from "./_components/create-user-form";
import { deleteUser } from "./actions";
import { Users, Shield, UserCheck, AlertCircle, Trash2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
};

export default async function AdminUsersPage() {
  const users: User[] = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const userCount = users.filter((user) => user.role === "USER").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-background to-amber-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Users</h1>
              <p className="text-muted-foreground mt-1">
                Manage user accounts and admin permissions
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[100px]">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admins
              </p>
              <p className="text-xl font-bold text-amber-500">{adminCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[100px]">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Users
              </p>
              <p className="text-xl font-bold text-foreground">{userCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Form */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Create New User
        </h2>
        <CreateUserForm />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Users</h2>
            <p className="text-sm text-muted-foreground">{users.length} accounts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.name || "—"}</td>
                  <td className="px-6 py-4">
                    <UserRoleForm
                      userId={user.id}
                      currentRole={user.role as "ADMIN" | "USER"}
                      disabled={user.role === "ADMIN" && adminCount === 1}
                    />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <form action={deleteUser.bind(null, user.id)}>
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        disabled={user.role === "ADMIN" && adminCount === 1}
                        className="gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No users yet</h3>
            <p className="text-muted-foreground">Create your first user using the form above</p>
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-yellow-500">Note:</strong> At least one admin account must remain active.
          You cannot delete or demote the last admin.
        </p>
      </div>
    </div>
  );
}

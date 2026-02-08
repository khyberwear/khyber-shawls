"use client";

import { useState } from "react";
import { createUser } from "../actions";
import { Button } from "@/components/ui/button";

export function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    try {
      setError(null);
      setSuccess(null);
      const result = await createUser(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("User created successfully");
        setIsOpen(false);
        // Reset the form
        const form = document.getElementById("create-user-form") as HTMLFormElement;
        form?.reset();
      }
    } catch (err) {
      setError("Failed to create user. Please try again.");
    }
  }

  return (
    <div className="rounded-lg border bg-background/80 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add New User</h2>
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant={isOpen ? "secondary" : "default"}
        >
          {isOpen ? "Cancel" : "Add User"}
        </Button>
      </div>

      {isOpen && (
        <form id="create-user-form" action={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
                <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
                <span className="text-destructive">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="role">
                Role
                <span className="text-destructive">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-primary">{success}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="submit">
              Create User
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

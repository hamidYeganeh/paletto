"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Checkbox from "@repo/ui/Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/DropdownMenu";
import { Button } from "@repo/ui/Button";
import { getAuthToken, useCurrentUser } from "@repo/api";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  const { data: profile, isLoading } = useCurrentUser();

  const isAuthenticated = Boolean(token);

  return (
    <main className="bg-blue-500 min-h-dvh h-dvh p-4 flex items-center justify-center flex-col gap-4">
      <div className="flex flex-col items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg">
        <p className="text-sm font-semibold">
          {isAuthenticated
            ? "Authenticated"
            : "Not authenticated. Please log in."}
        </p>
        {isAuthenticated && (
          <p className="text-xs">
            {isLoading
              ? "Loading profile..."
              : (profile?.user?.email ?? "Signed in")}
          </p>
        )}
      </div>

      <Link href={"/login"}>LOGIN</Link>
      <Link href={"/profile/art-taste"}>ART TASTE</Link>

      <div className="max-w-xl flex flex-col gap-1">
        <Checkbox
          color={"white"}
          defaultChecked
          label="من شرایط و ضوابط عمومی فروش و سیاست حفظ حریم خصوصی پالِتو  را می‌پذیرم."
        />
        <Checkbox
          color={"primary"}
          defaultChecked
          label="من شرایط و ضوابط عمومی فروش و سیاست حفظ حریم خصوصی پالِتو  را می‌پذیرم."
        />
        <Checkbox
          color={"black"}
          defaultChecked
          label="من شرایط و ضوابط عمومی فروش و سیاست حفظ حریم خصوصی پالِتو  را می‌پذیرم."
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="contained">Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Keyboard shortcuts
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </main>
  );
}

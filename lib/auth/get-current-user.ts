import { cache } from "react";

import type { UserStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/auth/roles";

export type AuthenticatedAppUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  organizationId: string;
  organizationName: string;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
  supabaseUserId: string;
};

export type CurrentUserResult =
  | { kind: "anonymous" }
  | { kind: "account-not-found"; email: string; supabaseUserId: string }
  | { kind: "authenticated"; user: AuthenticatedAppUser };

export const getCurrentUser = cache(async (): Promise<CurrentUserResult> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser?.email) {
    return { kind: "anonymous" };
  }

  const prismaUser = await prisma.user.findFirst({
    where: {
      email: supabaseUser.email,
    },
    include: {
      organization: true,
    },
  });

  if (!prismaUser) {
    return {
      kind: "account-not-found",
      email: supabaseUser.email,
      supabaseUserId: supabaseUser.id,
    };
  }

  return {
    kind: "authenticated",
    user: {
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      role: prismaUser.role,
      status: prismaUser.status,
      organizationId: prismaUser.organizationId,
      organizationName: prismaUser.organization.name,
      avatarUrl: prismaUser.avatarUrl,
      lastLoginAt: prismaUser.lastLoginAt,
      supabaseUserId: supabaseUser.id,
    },
  };
});

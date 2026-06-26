type OrganizationCardProps = {
  organization: {
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string | null;
    _count?: { users: number; resources: number; leads: number; communityPosts: number };
  };
};

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="flex items-start gap-4">
        <div className="flex size-16 items-center justify-center rounded-3xl text-lg font-bold text-white" style={{ backgroundColor: organization.primaryColor || "#6E4BD8" }}>
          {organization.logoUrl ? "Logo" : organization.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{organization.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">/{organization.slug}</p>
          <p className="mt-2 text-sm text-muted-foreground">Branding, contact information, colors, and future domains are managed here.</p>
        </div>
      </div>
      {organization._count ? (
        <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm md:grid-cols-4">
          <div className="rounded-2xl bg-surface p-3"><strong className="block text-lg text-foreground">{organization._count.users}</strong>Users</div>
          <div className="rounded-2xl bg-surface p-3"><strong className="block text-lg text-foreground">{organization._count.resources}</strong>Resources</div>
          <div className="rounded-2xl bg-surface p-3"><strong className="block text-lg text-foreground">{organization._count.leads}</strong>Leads</div>
          <div className="rounded-2xl bg-surface p-3"><strong className="block text-lg text-foreground">{organization._count.communityPosts}</strong>Posts</div>
        </div>
      ) : null}
    </article>
  );
}

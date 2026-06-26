import { notFound } from "next/navigation";

import { PostDetail } from "@/components/community/post-detail";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCommunityHomeData, getCommunityPostDetail } from "@/lib/community/service";

export default async function CommunityPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
  const { postId } = await params;
  const post = await getCommunityPostDetail(user, postId);

  if (!post) {
    notFound();
  }

  const related = await getCommunityHomeData(user, { space: post.space.slug });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[2.25rem] bg-gradient-to-br from-[#172B4D] via-[#1E4E9A] to-[#29B7E5] p-5 text-white shadow-[0_24px_60px_rgba(30,78,154,0.24)] sm:p-6">
        <p className="text-sm font-medium text-white/80">Post detail</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
      </section>
      <PostDetail post={post} relatedPosts={related.posts.filter((item) => item.id !== post.id).slice(0, 3)} />
    </div>
  );
}

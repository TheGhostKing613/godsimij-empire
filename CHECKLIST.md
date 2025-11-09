# Implementation Checklist - GodsIMiJ Empire Social Network

## 🚪 v1.3.0: Gate of Entry Update ✅ COMPLETE

### Landing Page
- [x] Create cinematic landing page component at `/`
- [x] Animated circuit grid background
- [x] Ember particle system (25 floating particles)
- [x] Pulsing NODE sigil watermark (Flame icon)
- [x] Three action buttons (Sign In, Create Account, Guest)
- [x] Framer Motion entrance animations
- [x] Staggered button fade-ins with hover effects
- [x] Auto-redirect for authenticated users to `/feed`
- [x] SEO meta tags for landing page
- [x] Mobile-responsive layout

### Route Restructuring
- [x] Move Index.tsx to Feed.tsx
- [x] Update App.tsx routing structure
- [x] Separate landing route (no navbar/footer)
- [x] Separate auth route (no navbar/footer)
- [x] Main app routes with navbar/footer
- [x] Add `/feed` route for social feed
- [x] Add `/settings` route for preferences
- [x] Keep legacy routes functional (hidden from nav)

### Navbar Simplification
- [x] Remove Realms, Scrolls, Media, Projects links
- [x] Remove AI, API, Declarations, Contact links
- [x] Add Feed link with Flame icon
- [x] Keep Empire dropdown
- [x] Update user dropdown (Profile, Settings, Sign Out)
- [x] Change logo link to `/feed`
- [x] Maintain mobile responsiveness

### Settings Page
- [x] Create Settings.tsx component
- [x] Profile settings section
- [x] Audio preferences (toggle + volume slider)
- [x] Notification settings section
- [x] Theme preferences placeholder (future)
- [x] Card-based layout
- [x] Auth guard (redirect if not logged in)

### Auth Flow Updates
- [x] Update Auth.tsx redirect to `/feed`
- [x] Update sign-in handler redirect
- [x] Update sign-up handler redirect
- [x] Preserve location state for protected routes

### Documentation
- [x] Update CHANGELOG.md with v1.3.0 entry
- [x] Update CHECKLIST.md with Sprint 3.5
- [x] Create GATE_OF_ENTRY_v1.3.0.md completion doc
- [x] Document all architectural changes

### Testing
- [x] New visitor flow (guest access)
- [x] Authenticated user flow (auto-redirect)
- [x] New registration flow
- [x] Navigation tests (all links work)
- [x] Mobile responsive verification
- [x] Legacy route access verification

## 🔥 Sprint 3: Broadcast Era ✅ COMPLETE

### Database
- [x] Anonymous posting columns (`is_anonymous`, `display_name` on posts)
- [x] User tier enum (`user_tier`: wanderer, witness, scribe, flamekeeper, crown)
- [x] Tier columns on profiles (`tier`, `tier_awarded_at`)
- [x] Anonymous post rate limiting table (`anonymous_post_limits`)
- [x] Tier promotion function (`check_tier_promotion()`)
- [x] Tier promotion trigger (auto-promotes to Scribe at 10+ posts, 50+ reactions)

### Post Type Rebranding
- [x] POST_TYPE_CONFIG with new names (Flamecast, Signal, Dispatch, Artifact)
- [x] Icons and colors for each type (🔥⚡🧠💎)
- [x] Updated PostComposer with new display names
- [x] Updated PostCard with color-coded badges
- [x] Post type color bar on left edge of cards

### Multi-Reaction System
- [x] REACTION_CONFIG with 4 types (Flame, Rebel, Insight, Mind Blown)
- [x] ReactionPicker component with animated picker
- [x] Quick-tap for Flame, long-press for full picker
- [x] Reaction count breakdown tooltip
- [x] Reactions API (add, remove, get counts, get user reaction)
- [x] useReactions hook with React Query integration

### User Tier System
- [x] TIER_CONFIG with badges and glow effects
- [x] TierBadge component with tooltips
- [x] Tier-based avatar glow effects
- [x] Tier display on all posts and profiles
- [x] Hide tier for anonymous posts
- [x] Server-side tier promotion logic

### Public Feed Access
- [x] Feed visible to unauthenticated users
- [x] "Sign in to ignite the Flame" CTA
- [x] Disabled PostComposer for non-logged-in users
- [x] Welcome message for Broadcast Era

### Anonymous Posting
- [x] Toggle in PostComposer
- [x] Display name input (required, max 50 chars)
- [x] Ghost avatar for anonymous posts
- [x] Rate limiting (3 per 24h)
- [x] User ID logged for moderation (hidden in UI)
- [x] No tier badge or profile link on anonymous posts

### Empire Integration
- [x] Empire dropdown in Navbar
- [x] Links to Witness Hall, Quantum Odyssey, Rebel Media, GhostVault
- [x] Empire page at /empire
- [x] Property cards with icons and descriptions
- [x] Circuit grid background

### Feed Enhancements
- [x] EmpireBroadcast component (pinned/featured posts)
- [x] TopOfFlame component (trending algorithm)
- [x] Distinct styling for Empire Broadcast posts
- [x] Auto-refresh every 5 minutes for Top of Flame

### Visual Polish
- [x] CircuitGrid component with animated SVG
- [x] Avatar glow effects by tier
- [x] Cyan pulse trail hover effects (.cyan-trail utility)
- [x] Post type color bars
- [x] CSS animations (circuit-pulse, ember-pulse)
- [x] Chart color tokens in tailwind.config

### Audio System
- [x] useAudio hook
- [x] playFlameIgnition, playReaction, playWhoosh functions
- [x] LocalStorage settings integration
- [x] Volume control support

### Configuration
- [x] src/config/postTypes.ts
- [x] src/config/tiers.ts
- [x] src/config/reactions.ts

### API Updates
- [x] checkAnonymousPostLimit function
- [x] Reactions API (src/api/reactions.ts)
- [x] All post queries include tier field
- [x] Profile queries include tier field

---

## 🔄 Sprint 1: Foundation - Database & Profiles ✅ COMPLETE

---

## 🗄️ Database Migrations ✅ COMPLETE

### Posts Table
- [ ] Create `posts` table with columns:
  - [ ] `id` (uuid, primary key, default gen_random_uuid())
  - [ ] `user_id` (uuid, references profiles.id)
  - [ ] `content` (text, not null)
  - [ ] `post_type` (text, default 'discussion', check constraint for valid types)
  - [ ] `visibility` (text, default 'public', check constraint)
  - [ ] `category_id` (uuid, references categories.id, nullable)
  - [ ] `media_urls` (text array, nullable)
  - [ ] `likes_count` (integer, default 0)
  - [ ] `comments_count` (integer, default 0)
  - [ ] `shares_count` (integer, default 0)
  - [ ] `is_pinned` (boolean, default false)
  - [ ] `is_featured` (boolean, default false)
  - [ ] `created_at` (timestamp with time zone, default now())
  - [ ] `updated_at` (timestamp with time zone, default now())
- [ ] Create indexes:
  - [ ] `idx_posts_user_id` on `posts(user_id)`
  - [ ] `idx_posts_created_at` on `posts(created_at DESC)`
  - [ ] `idx_posts_category_id` on `posts(category_id)`
  - [ ] `idx_posts_visibility` on `posts(visibility)`
  - [ ] `idx_posts_is_featured` on `posts(is_featured)` where `is_featured = true`
  - [ ] `idx_posts_is_pinned` on `posts(is_pinned)` where `is_pinned = true`
- [ ] RLS policies:
  - [ ] **SELECT**: Anyone can read public posts
  - [ ] **SELECT**: Users can read own posts (any visibility)
  - [ ] **SELECT**: Admins can read all posts
  - [ ] **INSERT**: Authenticated users can create posts
  - [ ] **UPDATE**: Users can update own posts
  - [ ] **UPDATE**: Admins can update any post (for pin/feature)
  - [ ] **DELETE**: Users can delete own posts
  - [ ] **DELETE**: Admins can delete any post
- [ ] Create trigger for `updated_at` timestamp

### Categories Table
- [ ] Create `categories` table with columns:
  - [ ] `id` (uuid, primary key, default gen_random_uuid())
  - [ ] `name` (text, not null, unique)
  - [ ] `slug` (text, not null, unique)
  - [ ] `description` (text, nullable)
  - [ ] `icon` (text, nullable) - emoji or icon name
  - [ ] `color` (text, nullable) - hex color code
  - [ ] `parent_category_id` (uuid, references categories.id, nullable)
  - [ ] `post_count` (integer, default 0)
  - [ ] `created_at` (timestamp with time zone, default now())
  - [ ] `updated_at` (timestamp with time zone, default now())
- [ ] Insert initial categories:
  - [ ] 🧠 **AI Consciousness** - slug: `ai-consciousness`, description: "Discussions on AGI, sentience, machine awareness, and the future of artificial minds"
  - [ ] 👑 **Sovereignty** - slug: `sovereignty`, description: "Digital autonomy, self-governance, decentralization, and personal freedom"
  - [ ] 🏠 **Local AI** - slug: `local-ai`, description: "On-device models, privacy-first systems, and locally-run AI implementations"
  - [ ] ⚡ **Quantum Systems** - slug: `quantum-systems`, description: "Quantum computing, advanced technologies, and next-gen systems"
  - [ ] 🔥 **Digital Rebellion** - slug: `digital-rebellion`, description: "Challenging the status quo, decentralization, and building alternative futures"
  - [ ] 💬 **General** - slug: `general`, description: "Off-topic discussions, introductions, and community chat"
- [ ] RLS policies:
  - [ ] **SELECT**: Anyone can read categories
  - [ ] **INSERT**: Admins only
  - [ ] **UPDATE**: Admins only
  - [ ] **DELETE**: Admins only
- [ ] Create index: `idx_categories_slug` on `categories(slug)`
- [ ] Create trigger for `updated_at` timestamp

### User Connections Table
- [ ] Create `user_connections` table with columns:
  - [ ] `id` (uuid, primary key, default gen_random_uuid())
  - [ ] `follower_id` (uuid, references profiles.id, not null)
  - [ ] `following_id` (uuid, references profiles.id, not null)
  - [ ] `created_at` (timestamp with time zone, default now())
  - [ ] Unique constraint on `(follower_id, following_id)`
  - [ ] Check constraint: `follower_id != following_id` (can't follow yourself)
- [ ] Create indexes:
  - [ ] `idx_user_connections_follower` on `user_connections(follower_id)`
  - [ ] `idx_user_connections_following` on `user_connections(following_id)`
- [ ] RLS policies:
  - [ ] **SELECT**: Anyone can read connections (public followers/following)
  - [ ] **INSERT**: Authenticated users can create own connections (as follower)
  - [ ] **DELETE**: Authenticated users can delete own connections (as follower)
- [ ] Create function `update_follower_counts()` (trigger on insert/delete)
  - [ ] Increment/decrement `follower_count` on `following_id` user's profile
  - [ ] Increment/decrement `following_count` on `follower_id` user's profile

### Enhanced Profiles Table
- [ ] Alter `profiles` table, add columns:
  - [ ] `bio` (text, nullable)
  - [ ] `avatar_url` (text, nullable)
  - [ ] `cover_image_url` (text, nullable)
  - [ ] `location` (text, nullable)
  - [ ] `website` (text, nullable)
  - [ ] `twitter_handle` (text, nullable)
  - [ ] `github_handle` (text, nullable)
  - [ ] `interests` (text array, default '{}')
  - [ ] `badges` (text array, default '{}')
  - [ ] `follower_count` (integer, default 0)
  - [ ] `following_count` (integer, default 0)
  - [ ] `post_count` (integer, default 0)
- [ ] Update existing RLS policies (should already work):
  - [ ] **SELECT**: Users can read own profile
  - [ ] **UPDATE**: Users can update own profile
  - [ ] Note: Consider making profiles publicly readable for social network
- [ ] Add RLS policy: **SELECT**: Anyone can read profiles (for public viewing)
- [ ] Create function `update_post_count()` (trigger on posts insert/delete)
  - [ ] Increment/decrement `post_count` on user's profile

### Post Likes Table (Foundation for Sprint 3)
- [ ] Create `post_likes` table with columns:
  - [ ] `id` (uuid, primary key, default gen_random_uuid())
  - [ ] `user_id` (uuid, references profiles.id, not null)
  - [ ] `post_id` (uuid, references posts.id on delete cascade, not null)
  - [ ] `reaction_type` (text, default 'flame') - flame, mind_blown, rebel, insight
  - [ ] `created_at` (timestamp with time zone, default now())
  - [ ] Unique constraint on `(user_id, post_id)` - can only like once
- [ ] Create index: `idx_post_likes_post` on `post_likes(post_id)`
- [ ] Create index: `idx_post_likes_user` on `post_likes(user_id)`
- [ ] RLS policies:
  - [ ] **SELECT**: Anyone can read likes (public engagement)
  - [ ] **INSERT**: Authenticated users can like posts
  - [ ] **DELETE**: Users can delete own likes (unlike)
- [ ] Create function `update_likes_count()` (trigger on insert/delete)
  - [ ] Increment/decrement `likes_count` on post

### Post Shares Table (Foundation for Sprint 3)
- [ ] Create `post_shares` table with columns:
  - [ ] `id` (uuid, primary key, default gen_random_uuid())
  - [ ] `user_id` (uuid, references profiles.id, not null)
  - [ ] `post_id` (uuid, references posts.id on delete cascade, not null)
  - [ ] `shared_to` (text, nullable) - 'feed', 'external', etc.
  - [ ] `created_at` (timestamp with time zone, default now())
- [ ] Create index: `idx_post_shares_post` on `post_shares(post_id)`
- [ ] Create index: `idx_post_shares_user` on `post_shares(user_id)`
- [ ] RLS policies:
  - [ ] **SELECT**: Anyone can read shares (public engagement)
  - [ ] **INSERT**: Authenticated users can share posts
- [ ] Create function `update_shares_count()` (trigger on insert)
  - [ ] Increment `shares_count` on post

### Notifications Table (Foundation for Sprint 3)
- [ ] Create `notifications` table with columns:
  - [ ] `id` (uuid, primary key, default gen_random_uuid())
  - [ ] `user_id` (uuid, references profiles.id on delete cascade, not null)
  - [ ] `type` (text, not null) - 'follow', 'like', 'comment', 'mention', 'share', 'reply'
  - [ ] `related_user_id` (uuid, references profiles.id, nullable) - who triggered
  - [ ] `related_post_id` (uuid, references posts.id on delete cascade, nullable)
  - [ ] `related_comment_id` (uuid, references comments.id on delete cascade, nullable)
  - [ ] `is_read` (boolean, default false)
  - [ ] `created_at` (timestamp with time zone, default now())
- [ ] Create indexes:
  - [ ] `idx_notifications_user` on `notifications(user_id, created_at DESC)`
  - [ ] `idx_notifications_user_unread` on `notifications(user_id, is_read)` where `is_read = false`
- [ ] RLS policies:
  - [ ] **SELECT**: Users can read own notifications
  - [ ] **UPDATE**: Users can update own notifications (mark as read)
  - [ ] **DELETE**: Users can delete own notifications

### Database Functions
- [ ] Fix existing `handle_updated_at()` function:
  - [ ] Add `SET search_path = public`
- [ ] Create `update_follower_counts()` function (trigger on user_connections)
- [ ] Create `update_post_count()` function (trigger on posts)
- [ ] Create `update_likes_count()` function (trigger on post_likes)
- [ ] Create `update_shares_count()` function (trigger on post_shares)
- [ ] Create `update_comments_count_for_posts()` function (trigger on comments when linked to posts)

### Apply Triggers
- [ ] Trigger on `posts` for `updated_at`
- [ ] Trigger on `categories` for `updated_at`
- [ ] Trigger on `posts` insert/delete → update `profiles.post_count`
- [ ] Trigger on `user_connections` insert/delete → update follower/following counts
- [ ] Trigger on `post_likes` insert/delete → update `posts.likes_count`
- [ ] Trigger on `post_shares` insert → update `posts.shares_count`

---

## 🎨 Frontend - Profile Page

### Create Profile Page Component
- [ ] Create `/src/pages/Profile.tsx`
- [ ] Implement route: `/profile/:userId` in main router
- [ ] Fetch user profile data from `profiles` table using `userId`
- [ ] Handle loading state (skeleton UI)
- [ ] Handle error state (user not found)
- [ ] Check if viewing own profile (`auth.uid() === userId`)
- [ ] Fetch follower/following counts
- [ ] Fetch connection status (am I following this user?)

### Profile Header Section
- [ ] Display avatar:
  - [ ] Show user's `avatar_url` if exists
  - [ ] Show default avatar (initials or icon) if none
  - [ ] Make avatar clickable to view full size
- [ ] Display cover image:
  - [ ] Show user's `cover_image_url` if exists
  - [ ] Show default gradient/pattern if none
  - [ ] Use GodsIMiJ theme colors (ember/cyan gradient)
- [ ] Display user info:
  - [ ] `full_name` (large heading)
  - [ ] `email` username part or generate @username
  - [ ] `location` (with icon) if provided
  - [ ] `website` (clickable link) if provided
- [ ] Display bio:
  - [ ] Show `bio` text with markdown support (optional)
  - [ ] Handle multi-line text
  - [ ] Character limit indicator (e.g., "250 characters")
- [ ] Display social links:
  - [ ] Twitter link (if `twitter_handle` provided)
  - [ ] GitHub link (if `github_handle` provided)
  - [ ] Icons with hover effects
- [ ] Display member info:
  - [ ] "Joined [date]" from `created_at`
  - [ ] Format date nicely (e.g., "January 2025" or "2 months ago")
- [ ] Display stats row:
  - [ ] **Posts**: `post_count` (clickable to Posts tab)
  - [ ] **Followers**: `follower_count` (clickable to followers modal - future)
  - [ ] **Following**: `following_count` (clickable to following modal - future)
  - [ ] Highlight on hover, show as links

### Follow/Unfollow Button
- [ ] Show **"Edit Profile"** button if viewing own profile
  - [ ] Opens edit profile dialog/modal
  - [ ] Button with primary styling
- [ ] Show **"Follow"** button if not following:
  - [ ] Outline or secondary button style
  - [ ] On click: create entry in `user_connections`
  - [ ] Show loading state during mutation
  - [ ] Update to "Following" after success
  - [ ] Increment follower count locally (optimistic update)
  - [ ] Toast notification: "You are now following [name]"
- [ ] Show **"Following"** button if already following:
  - [ ] Solid or primary button style
  - [ ] On hover: change text to "Unfollow" and change color (red)
  - [ ] On click: delete entry from `user_connections`
  - [ ] Show loading state during mutation
  - [ ] Update to "Follow" after success
  - [ ] Decrement follower count locally
  - [ ] Toast notification: "You unfollowed [name]"
- [ ] Handle errors:
  - [ ] Can't follow yourself (button shouldn't show, but validate)
  - [ ] Network errors (show toast)
  - [ ] Already following / not following errors

### Profile Tabs Component
- [ ] Create tabs component with 4 tabs:
  - [ ] **Posts** (default active)
  - [ ] **Comments**
  - [ ] **Likes** (show posts user liked)
  - [ ] **About**
- [ ] Implement tab switching (active state)
- [ ] Responsive tabs (horizontal on desktop, maybe dropdown on mobile)
- [ ] Smooth transitions between tabs

### Posts Tab Content
- [ ] Fetch posts created by user (`posts.user_id = userId`)
- [ ] Display in chronological order (newest first)
- [ ] Show post cards (create `PostCard` component):
  - [ ] Post content preview (truncate if long)
  - [ ] Post type badge (discussion, question, etc.)
  - [ ] Category tag
  - [ ] Engagement stats (likes, comments, shares)
  - [ ] Timestamp ("2 hours ago")
  - [ ] Click to view full post (navigate to `/post/:postId` - Sprint 2)
- [ ] Empty state: "No posts yet" with illustration or message
- [ ] Pagination or infinite scroll (if many posts)

### Comments Tab Content
- [ ] Fetch comments created by user (`comments.user_id = userId`)
- [ ] Display comments with context:
  - [ ] Comment content
  - [ ] "On: [Post Title]" or "On: [Item Title]" with link
  - [ ] Timestamp
  - [ ] Like count (if comment likes exist)
- [ ] Link to original post/item
- [ ] Empty state: "No comments yet"
- [ ] Pagination or infinite scroll

### Likes Tab Content (Placeholder for Sprint 3)
- [ ] Fetch posts liked by user (join `post_likes` where `user_id`)
- [ ] Display post cards (same as Posts tab)
- [ ] Show reaction type (flame, mind blown, etc.)
- [ ] Empty state: "No liked posts yet"
- [ ] Pagination or infinite scroll

### About Tab Content
- [ ] Display full bio (if provided)
  - [ ] Support markdown or rich text
  - [ ] "No bio yet" if empty
- [ ] Display interests as tags/chips:
  - [ ] Show each interest in `interests` array
  - [ ] Styled as colored badges with ember glow
  - [ ] "No interests added" if empty
- [ ] Display badges:
  - [ ] Show each badge in `badges` array with icon
  - [ ] Styled with special colors/animations
  - [ ] Tooltip explaining badge on hover
  - [ ] "No badges earned yet" if empty
- [ ] Display additional info:
  - [ ] Location (with icon)
  - [ ] Website (clickable link)
  - [ ] Twitter handle (link to profile)
  - [ ] GitHub handle (link to profile)
  - [ ] Joined date ("Member since January 2025")
- [ ] Display activity stats:
  - [ ] Total posts
  - [ ] Total comments
  - [ ] Total likes received (sum of all post likes)
  - [ ] Member for X days/months

---

## 🛠️ Frontend - Edit Profile

### Create Edit Profile Component
- [ ] Create `/src/components/EditProfileDialog.tsx` or separate page
- [ ] Use dialog/modal for quick editing, or dedicated page (`/settings/profile`)
- [ ] Fetch current profile data to pre-fill form
- [ ] Use React Hook Form for form management
- [ ] Use Zod for validation schema

### Form Fields
- [ ] **Full Name**:
  - [ ] Text input
  - [ ] Required field
  - [ ] Max length: 100 characters
  - [ ] Validation: non-empty
- [ ] **Bio**:
  - [ ] Textarea (4-6 rows)
  - [ ] Optional
  - [ ] Max length: 500 characters
  - [ ] Character count indicator (e.g., "320/500")
  - [ ] Support line breaks
- [ ] **Location**:
  - [ ] Text input
  - [ ] Optional
  - [ ] Max length: 100 characters
  - [ ] Placeholder: "e.g., San Francisco, CA"
- [ ] **Website**:
  - [ ] URL input
  - [ ] Optional
  - [ ] Validation: valid URL format
  - [ ] Placeholder: "https://example.com"
- [ ] **Twitter Handle**:
  - [ ] Text input
  - [ ] Optional
  - [ ] Remove @ symbol if user enters it
  - [ ] Validation: alphanumeric + underscores
  - [ ] Placeholder: "username"
- [ ] **GitHub Handle**:
  - [ ] Text input
  - [ ] Optional
  - [ ] Validation: valid GitHub username
  - [ ] Placeholder: "username"
- [ ] **Interests**:
  - [ ] Multi-select or tag input
  - [ ] Predefined options + custom entry
  - [ ] Options: AI/ML, Quantum Computing, Sovereignty, Decentralization, Blockchain, Philosophy, etc.
  - [ ] Max 10 interests
  - [ ] Display as removable tags

### Avatar Upload
- [ ] Create avatar upload section:
  - [ ] Current avatar display (large circle)
  - [ ] "Change Avatar" button
  - [ ] Opens file picker
- [ ] File picker:
  - [ ] Accept: image/png, image/jpeg, image/webp
  - [ ] Max size: 5MB
  - [ ] Show error if file too large or wrong type
- [ ] Image preview:
  - [ ] Show selected image before upload
  - [ ] Crop functionality (optional but nice to have)
  - [ ] Square crop for avatar (1:1 aspect ratio)
- [ ] Upload to Supabase Storage:
  - [ ] Bucket: `avatars` (create if doesn't exist)
  - [ ] Filename: `{userId}/avatar-{timestamp}.{ext}`
  - [ ] Get public URL after upload
  - [ ] Update `profiles.avatar_url` with new URL
  - [ ] Delete old avatar file (optional cleanup)
- [ ] Loading state during upload
- [ ] Error handling (upload failed, network error)

### Cover Image Upload
- [ ] Create cover image upload section:
  - [ ] Current cover display (wide rectangle)
  - [ ] "Change Cover" button
  - [ ] Opens file picker
- [ ] File picker:
  - [ ] Accept: image/png, image/jpeg, image/webp
  - [ ] Max size: 10MB
- [ ] Image preview:
  - [ ] Show selected image before upload
  - [ ] Crop functionality (optional)
  - [ ] Wide crop for cover (e.g., 16:5 aspect ratio)
- [ ] Upload to Supabase Storage:
  - [ ] Bucket: `avatars` or separate `covers` bucket
  - [ ] Filename: `{userId}/cover-{timestamp}.{ext}`
  - [ ] Get public URL after upload
  - [ ] Update `profiles.cover_image_url` with new URL
- [ ] Loading state during upload
- [ ] Error handling

### Save & Cancel Actions
- [ ] **Save Button**:
  - [ ] Primary button styling
  - [ ] Disabled if form invalid or unchanged
  - [ ] Loading state ("Saving..." with spinner)
  - [ ] On click: validate form, update profile in database
  - [ ] Toast notification on success: "Profile updated!"
  - [ ] Close dialog/redirect on success
- [ ] **Cancel Button**:
  - [ ] Secondary or ghost button styling
  - [ ] On click: close dialog/navigate back
  - [ ] Confirm discard if changes were made (optional)

### Form Validation
- [ ] Zod schema for profile update:
  - [ ] `full_name`: string, min 1, max 100
  - [ ] `bio`: string, max 500, optional
  - [ ] `location`: string, max 100, optional
  - [ ] `website`: valid URL, optional
  - [ ] `twitter_handle`: alphanumeric + underscores, optional
  - [ ] `github_handle`: valid format, optional
  - [ ] `interests`: array of strings, max 10, optional
- [ ] Display validation errors inline (red text under field)
- [ ] Disable save button until valid

### Toast Notifications
- [ ] Success: "Profile updated successfully!"
- [ ] Error: "Failed to update profile. Please try again."
- [ ] Upload success: "Avatar uploaded!"
- [ ] Upload error: "Failed to upload image. Max size is 5MB."

---

## 🔍 API/Hooks

### Profile Queries
- [ ] Create `src/hooks/useUserProfile.ts`:
  - [ ] `useUserProfile(userId: string)` hook
  - [ ] Fetch profile from `profiles` table
  - [ ] Fetch follower/following counts
  - [ ] Fetch connection status (am I following?)
  - [ ] Return: `{ profile, isLoading, error, isFollowing, refetch }`
  - [ ] Use TanStack Query for caching

### Profile Mutations
- [ ] Create `src/hooks/useUpdateProfile.ts`:
  - [ ] `useUpdateProfile()` hook
  - [ ] Mutation: update `profiles` table
  - [ ] Invalidate profile query on success
  - [ ] Return: `{ updateProfile, isLoading, error }`

### Follow/Unfollow Mutations
- [ ] Create `src/hooks/useFollowUser.ts`:
  - [ ] `useFollowUser()` hook
  - [ ] Mutation: insert into `user_connections`
  - [ ] Optimistic update (increment follower count locally)
  - [ ] Invalidate profile query on success
  - [ ] Trigger notification creation (future)
  - [ ] Return: `{ followUser, isLoading, error }`
- [ ] Create `src/hooks/useUnfollowUser.ts`:
  - [ ] `useUnfollowUser()` hook
  - [ ] Mutation: delete from `user_connections`
  - [ ] Optimistic update (decrement follower count locally)
  - [ ] Invalidate profile query on success
  - [ ] Return: `{ unfollowUser, isLoading, error }`

### Profile Data Helpers
- [ ] Create `src/api/profiles.ts`:
  - [ ] `getProfileByUserId(userId: string)` function
  - [ ] `updateProfile(userId: string, data: ProfileUpdateData)` function
  - [ ] `uploadAvatar(userId: string, file: File)` function
  - [ ] `uploadCoverImage(userId: string, file: File)` function
  - [ ] `followUser(followerId: string, followingId: string)` function
  - [ ] `unfollowUser(followerId: string, followingId: string)` function
  - [ ] `getFollowers(userId: string)` function (return list)
  - [ ] `getFollowing(userId: string)` function (return list)
  - [ ] `checkIfFollowing(followerId: string, followingId: string)` function

### Storage Helpers
- [ ] Create `src/api/storage.ts` or add to existing:
  - [ ] `uploadImage(bucket: string, path: string, file: File)` function
    - [ ] Upload file to Supabase Storage
    - [ ] Return public URL
    - [ ] Handle errors
  - [ ] `deleteImage(bucket: string, path: string)` function (optional cleanup)

---

## 🎯 Navigation Updates

### Update Navbar
- [ ] Modify `src/components/Navbar.tsx`:
  - [ ] Replace user email display with profile dropdown
  - [ ] Display user avatar (if uploaded) instead of placeholder
  - [ ] Avatar should be clickable to open dropdown

### Profile Dropdown Menu
- [ ] Create dropdown menu component:
  - [ ] Trigger: User avatar + name
  - [ ] Dropdown items:
    - [ ] **View Profile** - Link to `/profile/:userId`
    - [ ] **Edit Profile** - Opens edit dialog or links to `/settings/profile`
    - [ ] **Settings** - Link to `/settings` (placeholder for now)
    - [ ] Divider
    - [ ] **Sign Out** - Existing sign out functionality
- [ ] Use Radix UI DropdownMenu component
- [ ] Keyboard navigation support (tab, arrows, enter, escape)
- [ ] Mobile responsive (full width on mobile)

### Update Routes
- [ ] Add route in main router (App.tsx or router config):
  - [ ] `/profile/:userId` → Profile page component
  - [ ] Route should be public (anyone can view profiles)
- [ ] Add future route (optional for now):
  - [ ] `/settings/profile` → Edit profile page (if not using dialog)

---

## 🧪 Testing & Validation

### Manual Testing Checklist
- [ ] **Profile Creation**:
  - [ ] Sign up new user → verify profile created automatically
  - [ ] Check default values (empty bio, no avatar, counts at 0)
- [ ] **View Own Profile**:
  - [ ] Navigate to own profile
  - [ ] Verify all fields display correctly
  - [ ] Verify "Edit Profile" button shows
  - [ ] Verify stats are accurate
- [ ] **View Another User's Profile**:
  - [ ] Navigate to another user's profile (create test user)
  - [ ] Verify "Follow" button shows
  - [ ] Verify can't see "Edit Profile" button
- [ ] **Edit Profile - Text Fields**:
  - [ ] Open edit dialog
  - [ ] Update full name → save → verify updated
  - [ ] Update bio → save → verify updated
  - [ ] Update location, website, social handles → verify updated
  - [ ] Add interests → verify displayed as tags
  - [ ] Test validation (e.g., invalid URL) → verify error messages
  - [ ] Test character limits → verify enforced
- [ ] **Edit Profile - Avatar Upload**:
  - [ ] Upload valid image (PNG, JPEG, WEBP) → verify uploaded
  - [ ] Upload image over 5MB → verify error
  - [ ] Upload invalid file type → verify error
  - [ ] Preview image before save → verify preview works
  - [ ] Save with new avatar → verify avatar displays on profile
  - [ ] Verify avatar displays in navbar
- [ ] **Edit Profile - Cover Image Upload**:
  - [ ] Upload valid cover image → verify uploaded
  - [ ] Upload image over 10MB → verify error
  - [ ] Save with new cover → verify cover displays on profile header
- [ ] **Follow/Unfollow**:
  - [ ] Click "Follow" button → verify becomes "Following"
  - [ ] Verify follower count increments on followed user's profile
  - [ ] Verify following count increments on own profile
  - [ ] Hover "Following" button → verify changes to "Unfollow"
  - [ ] Click "Unfollow" → verify becomes "Follow"
  - [ ] Verify counts decrement
  - [ ] Verify toast notifications appear
- [ ] **Profile Tabs**:
  - [ ] Click each tab → verify switches correctly
  - [ ] Posts tab: verify shows user's posts (or empty state)
  - [ ] Comments tab: verify shows user's comments (or empty state)
  - [ ] Likes tab: verify empty state (implement in Sprint 3)
  - [ ] About tab: verify displays bio, interests, badges, stats
- [ ] **Responsive Design**:
  - [ ] Test on mobile (375px width)
  - [ ] Test on tablet (768px width)
  - [ ] Test on desktop (1440px width)
  - [ ] Verify profile header stacks correctly on mobile
  - [ ] Verify tabs are scrollable/usable on mobile
  - [ ] Verify edit dialog is mobile-friendly
- [ ] **Loading States**:
  - [ ] Verify skeleton UI while profile loads
  - [ ] Verify loading spinner on follow/unfollow
  - [ ] Verify loading state on save profile
  - [ ] Verify loading state during image upload
- [ ] **Error States**:
  - [ ] Navigate to non-existent user profile → verify 404 or error message
  - [ ] Lose network connection during save → verify error toast
  - [ ] Lose network connection during follow → verify error toast
  - [ ] Verify all error messages are user-friendly

### Security Testing
- [ ] **RLS Policies**:
  - [ ] Verify user can only edit own profile (try editing another user's ID)
  - [ ] Verify SQL injection prevention (try malicious input in text fields)
  - [ ] Verify can't follow yourself (validation prevents it)
  - [ ] Verify can't create duplicate follow entries (unique constraint)
- [ ] **Image Upload Security**:
  - [ ] Verify only allowed file types can be uploaded
  - [ ] Verify file size limits enforced
  - [ ] Verify uploaded files are stored with user-specific paths
  - [ ] Verify old images are cleaned up (or plan for cleanup)
- [ ] **XSS Prevention**:
  - [ ] Enter `<script>alert('XSS')</script>` in bio → verify sanitized/escaped
  - [ ] Enter HTML in text fields → verify not rendered as HTML
- [ ] **Authorization**:
  - [ ] Verify unauthenticated users can view profiles but not edit
  - [ ] Verify unauthenticated users can't follow/unfollow

### Performance Testing
- [ ] **Profile Load Time**:
  - [ ] Measure time to load profile page
  - [ ] Target: < 1 second on good connection
- [ ] **Database Queries**:
  - [ ] Check query performance in Supabase dashboard
  - [ ] Verify indexes are used (explain analyze)
  - [ ] Optimize slow queries (if any)
- [ ] **Image Loading**:
  - [ ] Verify images load progressively (lazy loading)
  - [ ] Verify large images don't block page render
  - [ ] Consider image optimization (resize, compress)

---

## 📝 Documentation

### Create Documentation Files
- [x] **CHANGELOG.md** - Track all changes with dates
- [x] **ROADMAP.md** - High-level phases and sprints
- [x] **CHECKLIST.md** - Granular Sprint 1 tasks (this file)

### Update README.md
- [ ] Update project description to reflect social network transformation
- [ ] Add "Features" section listing Sprint 1 capabilities
- [ ] Add "Getting Started" section for new developers
- [ ] Add link to ROADMAP.md and CHANGELOG.md
- [ ] Add screenshots of profile page (after Sprint 1)

### Document Database Schema
- [ ] Create `docs/DATABASE.md` or add to README:
  - [ ] ERD (entity relationship diagram) - visual or text
  - [ ] Table descriptions
  - [ ] Column descriptions
  - [ ] Relationship explanations
  - [ ] RLS policy summaries
- [ ] Or use database documentation tool (optional)

### Document API/Hooks
- [ ] Create `docs/API.md` or JSDoc comments:
  - [ ] List all custom hooks with parameters and return types
  - [ ] List all API functions with signatures
  - [ ] Examples of usage
- [ ] Add TypeScript types for all functions

---

## ✅ Sprint 1 Definition of Done

### Database Layer
- [x] All tables created and migrated successfully
- [x] All indexes created for performance
- [x] All RLS policies implemented and tested
- [x] All database functions created (count updates, triggers)
- [x] Initial category data inserted
- [ ] No SQL errors in console
- [ ] Database schema documented

### Frontend - Profile Page
- [ ] Profile page renders correctly for own profile
- [ ] Profile page renders correctly for other users' profiles
- [ ] All profile fields display (avatar, cover, bio, stats, social links)
- [ ] Profile tabs work (Posts, Comments, Likes, About)
- [ ] Empty states display when no data
- [ ] Loading states display during fetch
- [ ] Error states display on failures
- [ ] Responsive design works on mobile, tablet, desktop

### Frontend - Edit Profile
- [ ] Edit profile dialog/page opens correctly
- [ ] All form fields pre-filled with current data
- [ ] Form validation works (required fields, character limits, URL format)
- [ ] Avatar upload works (valid files, size limits, preview)
- [ ] Cover image upload works
- [ ] Save updates profile in database
- [ ] Cancel discards changes
- [ ] Toast notifications show on success/error
- [ ] Changes reflect immediately on profile page

### Follow System
- [ ] Follow button shows for other users
- [ ] Unfollow button shows for followed users
- [ ] Follow action creates connection in database
- [ ] Unfollow action deletes connection
- [ ] Follower/following counts update in real-time
- [ ] Counts are accurate and persistent
- [ ] Can't follow yourself (validation)
- [ ] Can't create duplicate follows (unique constraint)
- [ ] Toast notifications show on follow/unfollow

### Navigation
- [ ] Profile dropdown shows in navbar
- [ ] User avatar displays in navbar (if uploaded)
- [ ] Dropdown items link correctly
- [ ] Sign out works from dropdown
- [ ] Routes work (`/profile/:userId`)

### Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Code is well-organized (components, hooks, utils separated)
- [ ] Reusable components created where appropriate
- [ ] CSS follows design system (use semantic tokens)
- [ ] Accessibility: keyboard navigation, ARIA labels, focus states

### Security
- [ ] RLS policies prevent unauthorized access
- [ ] Users can only edit own profiles
- [ ] Image uploads are secure (file type, size validation)
- [ ] No XSS vulnerabilities (input sanitized)
- [ ] No SQL injection vulnerabilities

### Testing
- [ ] All manual test cases passed
- [ ] Security testing completed
- [ ] Performance is acceptable (< 1s load time)
- [ ] Mobile testing completed on real devices or emulators

### Documentation
- [x] CHANGELOG.md created and up to date
- [x] ROADMAP.md created
- [x] CHECKLIST.md created (this file)
- [ ] README.md updated
- [ ] Database schema documented
- [ ] Code comments added where needed

---

## 🚀 Sprint 2 Preview: Core Social Features (Next Sprint)

Once Sprint 1 is complete and approved, Sprint 2 will focus on:

### Main Tasks
- [ ] Transform Index page (`/`) into dynamic Feed
- [ ] Create post composer component (discussion, question, announcement, idea types)
- [ ] Display posts in feed with PostCard component
- [ ] Implement following feed algorithm (show posts from followed users)
- [ ] Add category filter to feed
- [ ] Basic post interactions (view full post, navigate to comments)
- [ ] Post creation flow with category selection
- [ ] Post visibility options (public, followers only, private)

### Feed Page Features
- [ ] Post composer at top of feed ("What's on your mind?")
- [ ] Feed tabs: Following | Discover | [Category filters]
- [ ] Infinite scroll for posts
- [ ] Pull-to-refresh (mobile)
- [ ] Empty state for new users ("Follow users to see their posts")
- [ ] Loading skeleton for feed items

### Post Composer Features
- [ ] Rich text editor (markdown or TipTap)
- [ ] Post type selector (discussion, question, announcement, idea)
- [ ] Category dropdown (AI Consciousness, Sovereignty, etc.)
- [ ] Visibility dropdown (Public, Followers Only, Private)
- [ ] Character count (optional limit, e.g., 5000 chars)
- [ ] Image upload (1-4 images per post)
- [ ] Preview before posting
- [ ] Submit button with loading state

### Post Display Features
- [ ] PostCard component with:
  - [ ] User avatar and name (clickable to profile)
  - [ ] Post timestamp ("2 hours ago")
  - [ ] Post type badge (icon + label)
  - [ ] Category tag (clickable to category page)
  - [ ] Post content (truncated with "Read more" if long)
  - [ ] Engagement stats (likes, comments, shares - placeholders)
  - [ ] Click to view full post (`/post/:postId`)
- [ ] Full post page (`/post/:postId`) with:
  - [ ] Full post content
  - [ ] Comments section (integrate existing comment system)
  - [ ] Like/share buttons (implement in Sprint 3)

---

**Last Updated:** January 9, 2025  
**Status:** Sprint 1 - Ready to implement  
**Next Update:** After Sprint 1 completion

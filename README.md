# GodsIMiJ - AI-Powered Social Network

A cutting-edge, AI-enhanced social networking platform built for the sovereign digital community. GodsIMiJ combines real-time social features with powerful AI capabilities, offering a unique space for discussions, media sharing, and community building.

## 🔥 Features

### Core Social Features
- **Dynamic Feed System**: Discover and Following feeds with real-time updates
- **Post Types**: Discussions, Questions, Announcements, and Ideas
- **Anonymous Posting**: Share thoughts privately with display name customization (rate-limited for security)
- **Rich Media Support**: Image uploads and media attachments
- **Real-time Messaging**: Direct conversations between users
- **Reactions System**: Flame-based reaction system for engagement
- **Comments & Replies**: Threaded conversations on posts
- **User Profiles**: Customizable profiles with cover images, bios, and interests
- **Follow System**: Build your network and curate your feed
- **Notifications**: Stay updated on interactions and mentions

### Advanced Features
- **Tier System**: Progressive user tiers (Witness → Scribe → Architect → Oracle)
- **Category System**: Organized content with 6 main categories
  - AI Consciousness
  - Digital Rebellion
  - General
  - Local AI
  - Quantum Systems
  - Sovereignty
- **Search Functionality**: Find users, posts, and content
- **Admin Dashboard**: Comprehensive management tools
- **Empire Properties Integration**: Links to affiliated platforms
  - Witness Hall
  - Quantum Odyssey
  - Rebel Media
  - GhostVault (coming soon)

### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **Input Validation**: Protection against XSS and injection attacks
- **Rate Limiting**: Conversation and anonymous post rate limits
- **Password Breach Protection**: Enhanced authentication security
- **Role-Based Access Control**: Admin and moderator roles

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **React Hook Form + Zod** for form validation
- **Framer Motion** for animations

### Backend (Lovable Cloud/Supabase)
- **PostgreSQL** database with RLS
- **Supabase Auth** for authentication
- **Supabase Storage** for file uploads
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless logic

### Key Libraries
- `@supabase/supabase-js` - Database client
- `lucide-react` - Icon system
- `date-fns` - Date formatting
- `react-helmet-async` - SEO management
- `sonner` - Toast notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (or Lovable Cloud)
- Modern web browser

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🌐 Deployment

### Netlify Deployment

1. **Connect Repository**:
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**:
   Add the following environment variables in Netlify dashboard:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_KEY
   VITE_SUPABASE_PROJECT_ID
   ```

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Lovable Deployment

Simply click the "Publish" button in the Lovable editor to deploy to Lovable's hosting.

## 🗄 Database Schema

### Core Tables
- `profiles` - User profiles and metadata
- `posts` - User posts with rich content
- `post_comments` - Comments on posts
- `post_likes` - Reactions to posts
- `categories` - Content organization
- `conversations` - Direct messaging threads
- `messages` - Individual messages
- `notifications` - User notifications
- `user_connections` - Follow relationships
- `user_roles` - Role management

### Security
All tables include Row Level Security (RLS) policies to ensure data privacy and proper access control.

## 🔐 Authentication

The app uses Supabase Auth with:
- Email/password authentication
- Auto-confirm email signups (for development)
- Password breach protection
- Session management
- JWT-based authorization

## 📱 Features Breakdown

### Post Creation
- Rich text content (up to 10,000 characters)
- Post type selection
- Visibility controls (Public, Followers, Private)
- Category assignment
- Anonymous posting with custom display names
- Media attachments

### Messaging System
- Real-time direct messaging
- Conversation management
- Message deletion
- Read receipts
- Rate limiting (10 conversations/hour)

### Tier Progression
- **Witness** (Starting tier)
- **Scribe** (10 posts + 50 reactions)
- **Architect** (Manual promotion)
- **Oracle** (Manual promotion)

### Notifications
- New followers
- Post reactions
- Comments on posts
- Mentions
- Direct messages

## 🎨 Customization

### Theming
The app uses CSS variables for theming. Customize in `src/index.css`:
- Primary colors
- Background colors
- Border styles
- Typography
- Animations

### Design System
All UI components follow the design system defined in:
- `src/index.css` - CSS variables and global styles
- `tailwind.config.ts` - Tailwind configuration
- `src/components/ui/*` - Reusable UI components

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📊 Performance

- Server-side caching with TanStack Query
- Optimistic updates for instant feedback
- Image optimization with lazy loading
- Code splitting for faster initial load
- Real-time subscriptions for live updates

## 🔒 Security Considerations

### Production Checklist
- [ ] Enable RLS on all tables
- [ ] Review and test all RLS policies
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Set up monitoring and logging
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Input Validation
- Client-side validation with Zod schemas
- Server-side validation via RLS policies
- XSS protection through sanitization
- SQL injection prevention through parameterized queries

## 📝 API Documentation

The app uses Supabase's auto-generated API. Key endpoints:
- `/auth` - Authentication
- `/rest/v1/*` - REST API for all tables
- `/realtime/v1/*` - Real-time subscriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, questions, or feedback:
- Visit [Witness Hall](https://thewitnesshall.com)
- Check [Quantum Odyssey](https://quantum-odyssey.com)
- Explore [Rebel Media](https://r3b3lm3d14.thewitnesshall.com/)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- Powered by [Supabase](https://supabase.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)

---

**One Flame. Infinite Realms.** 🔥

© 2025 GodsIMiJ AI Solutions | Sovereign Systems Division

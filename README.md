# YumYumYumi 🍳

A modern recipe sharing platform built with Next.js, TypeScript, Material-UI, and Supabase.

## Features

- 🔐 **User Authentication** - Sign up and log in to create your own recipes
- 📝 **Recipe Management** - Create, edit, and delete your recipes
- 🖼️ **Image Upload** - Upload recipe images with automatic compression and WebP conversion
- 🔍 **Advanced Search** - Search recipes by title, ingredients, category, and cooking time
- 💾 **Bookmarks** - Save your favorite recipes for quick access
- 🎨 **Modern UI** - Beautiful Material-UI design with dark mode support
- 📱 **Responsive** - Works perfectly on all devices

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 18](https://react.dev/)
- **State Management**: React Context API

### Styling & UI Components
- **Component Library**: [Material-UI (MUI) v5](https://mui.com/)
- **CSS-in-JS**: [Emotion](https://emotion.sh/) (styled-components)
- **Icons**: [Material Icons](https://mui.com/material-ui/material-icons/)

### Backend & Database
- **Backend as a Service**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### Form & Validation
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Form Resolvers**: [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

### Development Tools
- **Bundler**: Next.js with Turbopack
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/react)
- **Component Development**: [Storybook](https://storybook.js.org/)
- **Linting**: ESLint, Stylelint, Prettier
- **Type Conversion**: [ts-case-convert](https://github.com/tonivj5/ts-case-convert)

### Deployment & Hosting
- **Platform**: [Vercel](https://vercel.com/)
- **Edge Functions**: Vercel Edge Runtime
- **CDN**: Vercel Edge Network

### Additional Features
- **Image Processing**: [Browser Image Compression](https://github.com/Donaldcwl/browser-image-compression)
- **SSR Support**: [@supabase/ssr](https://github.com/supabase/ssr)
- **Auth Helpers**: [@supabase/auth-helpers-nextjs](https://github.com/supabase/auth-helpers)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yumyumyumi.git
cd yumyumyumi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Service role key - Keep this secret!
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. Set up Supabase:

   a. Create a new project in [Supabase](https://app.supabase.com)
   
   b. Run the database migrations in SQL Editor:
   ```sql
   -- Create recipes table
   CREATE TABLE recipes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     summary TEXT,
     ingredients TEXT[] NOT NULL,
     directions TEXT[] NOT NULL,
     tips TEXT,
     prep_time INTEGER DEFAULT 0,
     cook_time INTEGER DEFAULT 0,
     total_time INTEGER DEFAULT 0,
     servings INTEGER DEFAULT 1,
     category TEXT,
     image_url TEXT,
     source TEXT,
     is_public BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create bookmarks table
   CREATE TABLE bookmarks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, recipe_id)
   );
   ```
   
   c. Set up Storage bucket:
   - Go to Storage in Supabase Dashboard
   - Create a bucket named `recipe-images`
   - Set it as PUBLIC

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key for client-side auth | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side operations (image upload) | Yes |

⚠️ **Security Note**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It's only used in server-side API routes.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   └── recipes/        # Recipe pages
├── components/         # React components
├── contexts/          # React contexts (Auth)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and services
└── types/             # TypeScript type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Original inspiration from the legacy YumYumYumi project
- Icons and images from Unsplash
- UI components from Material-UI
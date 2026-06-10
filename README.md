# YumYumYumi 🍳

A modern recipe sharing platform built with Next.js, TypeScript, Material-UI, Neon (Postgres) and Drizzle ORM.

## Features

- 🔐 **Authentication** - Log in to create, edit, and delete your own recipes
- 📝 **Recipe Management** - Create, edit, and delete your recipes
- 🖼️ **Image Upload** - Upload recipe images with automatic compression and WebP conversion
- 🔍 **Advanced Search** - Search recipes by title, ingredients, and cooking time
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

- **Database**: [Neon](https://neon.tech/) (serverless PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/) — Credentials provider
- **File Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

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
- **Type Conversion**: [ts-case-convert](https://github.com/tonivj5/ts-case-convert) (snake_case ↔ camelCase)

## Getting Started

### Prerequisites

- Node.js 20.19+
- npm or yarn
- A [Neon](https://neon.tech/) account (free Postgres)
- A [Vercel](https://vercel.com/) account with a Blob store (for image uploads)

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

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Neon Postgres connection string (from the Neon console)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"

# Auth.js secret — generate with: npx auth secret
AUTH_SECRET=""

# Vercel Blob token (Vercel dashboard > Storage > Blob > .env.local tab).
# Auto-injected when deployed on Vercel.
BLOB_READ_WRITE_TOKEN=""

# Only used once by `npm run db:seed` to create the single login account.
SEED_EMAIL=""
SEED_PASSWORD=""
```

4. Set up the database:

   a. Create a project in [Neon](https://console.neon.tech) and copy its `DATABASE_URL`.

   b. Apply the schema:

   ```bash
   npm run db:migrate
   ```

   c. (Optional) Seed the account and any rescued recipes from `data-export/`:

   ```bash
   npm run db:seed
   ```

5. Set up image storage:
   - In the Vercel dashboard, create a **Blob** store and copy `BLOB_READ_WRITE_TOKEN` into `.env.local`.

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable                | Description                                            | Required          |
| ----------------------- | ------------------------------------------------------ | ----------------- |
| `DATABASE_URL`          | Neon Postgres connection string                        | Yes               |
| `AUTH_SECRET`           | Auth.js session secret (`npx auth secret`)             | Yes               |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (auto-injected on Vercel)            | Yes (for uploads) |
| `SEED_EMAIL`            | Email for the single account created by `db:seed`      | Seed only         |
| `SEED_PASSWORD`         | Password for that account                              | Seed only         |

## Database scripts

- `npm run db:generate` - Generate a new migration from `src/lib/db/schema.ts`
- `npm run db:migrate` - Apply migrations to the database
- `npm run db:push` - Push the schema directly (handy for the first setup)
- `npm run db:studio` - Open Drizzle Studio to browse data
- `npm run db:seed` - Seed the account + rescued recipes

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

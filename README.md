# TaseesCircle — Islamic Community Engagement Platform

An elegant, modern Islamic community engagement website connecting Muslim communities in **Pakistan** and **Canada** through education, programs, and shared values.

---

## 🚀 Features

- **Dual Community Hubs**: Dedicated, localized content for **Pakistan** (Lahore, Islamabad, Karachi) and **Canada** (Toronto, Vancouver, Calgary).
- **Comprehensive Page Architecture**:
  - `Home`: Mission statement, dual country spotlight, stats counter, upcoming events, community voices testimonial slider, newsletter subscription.
  - `About Us`: Organization story, core values, vision & mission, leadership team, interactive timeline.
  - `Pakistan`: Local programs, events, scholar profiles, community news, office locations.
  - `Canada`: Local programs, events, scholar profiles, community news, office locations.
  - `Programs`: Categorized Islamic education, youth development, women's programs, community service, interfaith initiatives.
  - `Resources`: Filterable Quran study guides, Hadith collections, articles, recommended reading.
  - `Contact`: Interactive contact form, office locations, social media links, FAQ accordion.
  - `Login`: Google OAuth authentication via Supabase.
- **Design System**: Warm beige, pure white, and charcoal palette with gold accents, custom SVG Islamic geometric patterns, glassmorphism cards, and Framer Motion micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v3 & PostCSS
- **Authentication**: Supabase Auth (`@supabase/supabase-js` & `@supabase/ssr`) with Google OAuth
- **Animations**: Framer Motion
- **Icons**: Lucide React & Custom SVG Social Icons
- **Fonts**: Playfair Display (Headings), Inter (Body), Amiri (Arabic Calligraphy)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/shahrozimran/TaseesCircle.git

# Navigate into the project directory
cd TaseesCircle/tasees-circle

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

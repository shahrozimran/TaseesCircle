// ============================================
// Pakistan — Community Content Data
// ============================================

export const pakistanHero = {
  title: "Pakistan Community",
  subtitle: "Knowledge, Guidance & Islamic Discussions Online",
  description:
    "A digital knowledge hub for Muslims across Pakistan — exploring Rizq e Halal, societal challenges, and Islamic wisdom through authenticated Quran and Hadith references. Join our online circles from anywhere in Pakistan.",
};

// Pakistan no longer has physical offices — digital community only
export const pakistanOffices = [];

export const pakistanPrograms = [
  {
    title: "Online Quran Tafseer Circle",
    description:
      "Weekly live online Tafseer sessions guided by qualified scholars. Study the meanings and wisdom of the Quran from the comfort of your home — open to all ages and levels.",
    schedule: "Every Saturday, Live on Zoom",
    icon: "BookOpen",
  },
  {
    title: "Rizq e Halal Discussion Circle",
    description:
      "Weekly online Q&A and discussion on earning halal livelihood in Pakistan's economy. Covers employment, business ethics, and avoiding haram income — grounded in Quran & Sunnah.",
    schedule: "Every Friday, Live Q&A Session",
    icon: "Mic",
  },
  {
    title: "Online Fiqh Advisory Forum",
    description:
      "Submit your Islamic jurisprudence questions to our panel of scholars. Answers are provided via our platform with Quranic and Hadith references, covering everyday life issues.",
    schedule: "Ongoing — Submit Questions Anytime",
    icon: "ScrollText",
  },
  {
    title: "Hadith Study Group",
    description:
      "Deep-dive online study group exploring authentic hadith collections. Each session focuses on a single hadith — its chain, meaning, and practical application in today's Pakistan.",
    schedule: "Every Sunday, WhatsApp & Zoom",
    icon: "Moon",
  },
  {
    title: "Digital Youth Tarbiyah Program",
    description:
      "Character-building online program for young Muslims ages 13-25, focusing on Islamic identity, leadership, and navigating modern challenges with faith.",
    schedule: "Bi-weekly, Live Online Sessions",
    icon: "Users",
  },
  {
    title: "Sisters' Online Halaqah",
    description:
      "Dedicated weekly online study circle for women, covering fiqh, seerah, and practical Islamic living in a supportive digital environment. Private and moderated.",
    schedule: "Every Wednesday, Private Zoom Session",
    icon: "HeartHandshake",
  },
];

export const pakistanSessions = [
  {
    title: "Earning Halal Rizq in Pakistan — A Practical Guide",
    date: "September 27, 2026",
    platform: "YouTube Live + Zoom Q&A",
    description:
      "A comprehensive online webinar on identifying halal income sources in Pakistan's economy — covering employment, freelancing, business, and investments from an Islamic perspective.",
    type: "Webinar",
  },
  {
    title: "Avoiding Riba in Business & Finance",
    date: "October 5, 2026",
    platform: "Zoom — Open Registration",
    description:
      "Live online Q&A with scholars on how to avoid riba (interest) in business dealings, bank accounts, and financial transactions in Pakistan.",
    type: "Live Q&A",
  },
  {
    title: "Quran & Economic Justice — A Discussion",
    date: "October 20, 2026",
    platform: "YouTube Live",
    description:
      "An online panel discussion exploring what the Quran says about economic fairness, workers' rights, and just trade — connecting classical Islamic wisdom to modern Pakistan.",
    type: "Discussion",
  },
  {
    title: "Halal Career Development for Muslim Youth",
    date: "November 15, 2026",
    platform: "Zoom — Youth Only Session",
    description:
      "Online workshop for young Pakistani Muslims on building a halal career — choosing the right fields, navigating workplace ethics, and staying true to Islamic values professionally.",
    type: "Workshop",
  },
];

// Keep named export for backward compat with home page
export const pakistanEvents = pakistanSessions;

export const pakistanScholars = [
  {
    name: "Mufti Ahmad Raza Khan",
    title: "Head of Islamic Jurisprudence",
    expertise: "Hanafi Fiqh, Tafseer, Hadith Sciences",
    description:
      "With over 25 years of teaching experience, Mufti Ahmad leads our online fiqh advisory forum, answering community questions on Islamic law with detailed Quran and Hadith references.",
  },
  {
    name: "Dr. Ayesha Siddiqui",
    title: "Director of Women's Online Programs",
    expertise: "Islamic History, Women in Islam, Seerah",
    description:
      "Dr. Ayesha hosts our Sisters' Online Halaqah and produces knowledge content on the role of women in Islamic history — making scholarship accessible digitally for all Muslim women.",
  },
  {
    name: "Qari Muhammad Hassan",
    title: "Head of Online Quran Academy",
    expertise: "Tajweed, Qira'at, Hifz Coaching",
    description:
      "A certified qari in all ten canonical readings, Qari Hassan leads our online Quran circles and has guided over 500 students to complete their memorization through digital sessions.",
  },
];

export const pakistanDiscussions = [
  {
    title: "How to Earn Rizq e Halal in Today's Pakistan",
    category: "Rizq & Livelihood",
    excerpt:
      "In a world full of shortcuts and haram opportunities, how does a Muslim earn pure, blessed income? This discussion explores practical ways to earn halal in Pakistan's modern economy — freelancing, business, employment — all through the lens of Quran and Hadith.",
    quranRef: {
      arabic: "وَكُلُوا مِمَّا رَزَقَكُمُ اللَّهُ حَلَالًا طَيِّبًا",
      translation: "And eat of what Allah has provided for you, lawful and good.",
      surah: "Surah Al-Ma'idah (5:88)",
    },
    hadithRef: {
      text: "Seeking halal livelihood is an obligation after the obligatory acts of worship.",
      source: "Al-Bayhaqi",
    },
    tags: ["Rizq", "Halal Income", "Business Ethics"],
    readTime: "8 min read",
  },
  {
    title: "Is My Job Halal? A Guide for Pakistani Muslims",
    category: "Work & Ethics",
    excerpt:
      "Many Muslims work in industries or roles that may involve elements of haram — advertising, banking, media, or government. How do we evaluate our jobs Islamically? This knowledge discussion provides clear criteria from fiqh with real-world examples.",
    quranRef: {
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ",
      translation: "O you who have believed, do not consume one another's wealth unjustly.",
      surah: "Surah An-Nisa (4:29)",
    },
    hadithRef: {
      text: "Every body nourished by haram is more deserving of the Fire.",
      source: "Tirmidhi",
    },
    tags: ["Employment", "Halal Work", "Fiqh"],
    readTime: "10 min read",
  },
  {
    title: "Avoiding Riba (Interest) in Pakistan's Banking System",
    category: "Islamic Finance",
    excerpt:
      "Bank accounts, loans, credit cards — riba is embedded in modern financial systems. This discussion provides a practical Islamic roadmap for Pakistani Muslims to minimize and avoid riba in their daily financial lives, with Islamic banking alternatives.",
    quranRef: {
      arabic: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
      translation: "Allah has permitted trade and has forbidden interest.",
      surah: "Surah Al-Baqarah (2:275)",
    },
    hadithRef: {
      text: "The Prophet ﷺ cursed the one who accepts riba, the one who pays it, the one who records it, and the two witnesses to it — saying they are all equal.",
      source: "Sahih Muslim",
    },
    tags: ["Riba", "Islamic Finance", "Banking"],
    readTime: "12 min read",
  },
  {
    title: "The Blessings of Halal Rizq — Quran & Hadith Perspectives",
    category: "Spiritual Wealth",
    excerpt:
      "What happens to a Muslim's life, family, and du'a when they consistently earn halal? This inspiring discussion explores the spiritual, emotional, and practical blessings that flow from purifying one's income — through the beautiful words of the Quran and Prophet ﷺ.",
    quranRef: {
      arabic: "مَن عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً",
      translation: "Whoever does righteousness, whether male or female, while being a believer — We will surely cause him to live a good life.",
      surah: "Surah An-Nahl (16:97)",
    },
    hadithRef: {
      text: "A man sets out on a long journey, his hair disheveled and covered in dust, raising his hands to the sky saying: O Lord! O Lord! — but his food is haram, his drink is haram... so how can his du'a be answered?",
      source: "Sahih Muslim",
    },
    tags: ["Blessings", "Du'a", "Spiritual Growth"],
    readTime: "7 min read",
  },
  {
    title: "Freelancing in Pakistan: Halal or Not?",
    category: "Digital Economy",
    excerpt:
      "Pakistan is one of the world's top freelancing nations. But is all freelancing work halal? This practical discussion covers what types of freelance work are permissible, which are not, and how to handle payments from non-Muslim clients through an Islamic lens.",
    quranRef: {
      arabic: "وَلَا تَبْخَسُوا النَّاسَ أَشْيَاءَهُمْ وَلَا تَعْثَوْا فِي الْأَرْضِ مُفْسِدِينَ",
      translation: "And do not deprive people of their due and do not commit abuse on earth.",
      surah: "Surah Hud (11:85)",
    },
    hadithRef: {
      text: "Give the worker his wages before his sweat dries.",
      source: "Ibn Majah",
    },
    tags: ["Freelancing", "Digital Work", "Modern Economy"],
    readTime: "9 min read",
  },
  {
    title: "Zakat on Business Income: A Complete Guide",
    category: "Zakat & Charity",
    excerpt:
      "How do Pakistani business owners calculate and pay Zakat on their profits, inventory, and receivables? This detailed discussion covers all aspects of business Zakat with examples from Hanafi fiqh and classical scholars.",
    quranRef: {
      arabic: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا",
      translation: "Take from their wealth a charity by which you purify them and cause them increase.",
      surah: "Surah At-Tawbah (9:103)",
    },
    hadithRef: {
      text: "Protect your wealth by giving Zakat, treat your sick by giving charity, and prepare for calamity through du'a.",
      source: "Al-Tabarani",
    },
    tags: ["Zakat", "Business", "Fiqh"],
    readTime: "11 min read",
  },
];

export const pakistanNews = [
  {
    title: "New Discussion Series: 'Rizq e Halal in Modern Pakistan' Launches",
    date: "August 15, 2026",
    excerpt:
      "Our Pakistan community has launched a 6-part online discussion series on earning halal livelihood in Pakistan's modern economy, backed by Quran and Hadith references.",
  },
  {
    title: "Online Fiqh Forum Answers 500+ Community Questions",
    date: "July 28, 2026",
    excerpt:
      "Our digital fiqh advisory forum has successfully responded to over 500 questions from Pakistani Muslims on topics ranging from halal income to Islamic business law.",
  },
  {
    title: "Sisters' Online Halaqah Welcomes 300+ Members",
    date: "June 10, 2026",
    excerpt:
      "The Sisters' Online Halaqah has grown to over 300 active participants across Pakistan, making it one of the largest women's Islamic knowledge circles in the country.",
  },
];

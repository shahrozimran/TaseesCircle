// ============================================
// Canada — Community Content Data
// ============================================

export const canadaHero = {
  title: "Canada Community",
  subtitle: "Islamic Guidance for Muslims Living in Canada",
  description:
    "A digital knowledge hub addressing the unique challenges of Muslims in Canada — halal income, riba-free mortgages, Muslim identity in the West, and raising Islamic families. All discussions grounded in Quran and authentic Hadith.",
};

// Canada no longer has physical offices — digital community only
export const canadaOffices = [];

export const canadaPrograms = [
  {
    title: "Online Islamic Learning Circle",
    description:
      "Comprehensive online Islamic education for all ages, covering Quran, Islamic history, and character development — accessible from anywhere in Canada via live and recorded sessions.",
    schedule: "Saturdays & Sundays, Live Online",
    icon: "GraduationCap",
  },
  {
    title: "Muslim in Canada — Online Q&A",
    description:
      "Regular online Q&A sessions addressing the unique challenges of practicing Islam in Canada — halal income, Muslim identity, family issues, and navigating Canadian society Islamically.",
    schedule: "Bi-weekly, Thursdays — Live Online",
    icon: "Users",
  },
  {
    title: "New Muslim Digital Support Group",
    description:
      "A welcoming online support group for new Muslims and those exploring Islam, offering one-on-one digital guidance, study materials, and community connection across Canada.",
    schedule: "Every Sunday, Private Online Session",
    icon: "HeartHandshake",
  },
  {
    title: "Halal Finance Study Circle",
    description:
      "Monthly deep-dive online sessions on Shariah-compliant financial planning, halal mortgages, riba-free savings, and ethical investing for Canadian Muslims.",
    schedule: "First Wednesday of every month, Online",
    icon: "MessageCircle",
  },
  {
    title: "Online Family Guidance Sessions",
    description:
      "Confidential Islamic guidance for families, couples, and individuals provided by qualified Muslim counselors through secure online sessions.",
    schedule: "By appointment — Online",
    icon: "Shield",
  },
  {
    title: "Digital Seniors' Learning Circle",
    description:
      "Weekly online social and educational gathering for senior community members, featuring Islamic lectures, health discussions, and digital social connection.",
    schedule: "Every Tuesday, Live Online",
    icon: "Coffee",
  },
];

export const canadaSessions = [
  {
    title: "Halal Mortgages in Canada — Islamic Finance Q&A",
    date: "October 18, 2026",
    platform: "Zoom Webinar — Open Registration",
    description:
      "Expert-led online Q&A on Shariah-compliant home financing options in Canada — covering halal mortgage providers, musharakah agreements, and how to avoid riba when buying a home.",
    type: "Live Q&A",
  },
  {
    title: "Earning Rizq e Halal in Canada",
    date: "November 1, 2026",
    platform: "YouTube Live + Zoom",
    description:
      "Online panel discussion with Islamic scholars and Canadian Muslim professionals on identifying halal income sources, navigating workplace ethics, and keeping earnings pure in Canada.",
    type: "Panel Discussion",
  },
  {
    title: "Muslim Identity & Professional Life in Canada",
    date: "October 10, 2026",
    platform: "Zoom — Open Session",
    description:
      "Online discussion on navigating professional life as a practicing Muslim in Canada — hijab at work, prayer accommodations, Friday prayers, halal food, and workplace rights.",
    type: "Discussion",
  },
  {
    title: "Riba-Free Investment Options for Canadian Muslims",
    date: "November 22, 2026",
    platform: "Zoom Webinar",
    description:
      "Comprehensive online seminar on halal investing in Canada — ethical stocks, Shariah-compliant ETFs, halal savings accounts, and how to grow wealth without riba.",
    type: "Webinar",
  },
];

// Keep named export for backward compat with home page
export const canadaEvents = canadaSessions;

export const canadaScholars = [
  {
    name: "Sheikh Omar Abdullah",
    title: "Director of Islamic Education",
    expertise: "Aqeedah, Comparative Religion, Da'wah",
    description:
      "Born and raised in Canada, Sheikh Omar combines deep Islamic scholarship with an understanding of the Canadian Muslim experience. He leads our online knowledge discussions and da'wah content for Canadian Muslims.",
  },
  {
    name: "Dr. Fatima Al-Zahra",
    title: "Head of Online Guidance Services",
    expertise: "Islamic Psychology, Family Counseling, Youth Development",
    description:
      "Dr. Fatima is a licensed clinical psychologist who integrates Islamic spirituality with modern therapeutic approaches, providing online guidance sessions for community mental health.",
  },
  {
    name: "Ustadh Ibrahim Chen",
    title: "Youth Programs Coordinator",
    expertise: "Seerah, Islamic Ethics, Youth Engagement",
    description:
      "A convert to Islam and former educator, Ustadh Ibrahim creates compelling online content for Muslim youth in Canada, making Islamic learning relatable and engaging for the next generation.",
  },
];

export const canadaDiscussions = [
  {
    title: "Is My Salary Halal? A Guide for Canadian Muslims",
    category: "Rizq & Halal Income",
    excerpt:
      "Working in Canada's diverse economy raises many questions for practicing Muslims — is working at a bank haram? What about jobs in entertainment, insurance, or alcohol-adjacent industries? This discussion provides clear Islamic guidance on evaluating your income source.",
    quranRef: {
      arabic: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا",
      translation: "O mankind, eat from whatever is on earth that is lawful and good.",
      surah: "Surah Al-Baqarah (2:168)",
    },
    hadithRef: {
      text: "Every body nourished by haram is more deserving of the Fire.",
      source: "Tirmidhi",
    },
    tags: ["Halal Income", "Canada", "Work Ethics"],
    readTime: "10 min read",
  },
  {
    title: "Buying a Home in Canada: Can I Get a Halal Mortgage?",
    category: "Islamic Finance",
    excerpt:
      "One of the most pressing questions for Canadian Muslims: how do I buy a home without a riba-based mortgage? This discussion covers halal mortgage options in Canada, how musharakah mutanaqisah works, and which institutions offer truly Shariah-compliant solutions.",
    quranRef: {
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا",
      translation: "O you who have believed, fear Allah and give up what remains of riba, if you should be believers.",
      surah: "Surah Al-Baqarah (2:278)",
    },
    hadithRef: {
      text: "The Prophet ﷺ cursed the one who accepts riba, the one who pays it, the one who records it, and the two witnesses — saying they are all equal in sin.",
      source: "Sahih Muslim",
    },
    tags: ["Mortgage", "Riba-Free", "Islamic Finance", "Canada"],
    readTime: "12 min read",
  },
  {
    title: "Raising Muslim Children with Strong Islamic Identity in Canada",
    category: "Family & Identity",
    excerpt:
      "How do we raise children who are proud, confident Muslims while growing up in a society with different values? This discussion draws on Quranic guidance and prophetic wisdom to offer parents practical strategies for nurturing Islamic identity in Canadian schools and communities.",
    quranRef: {
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا",
      translation: "O you who have believed, protect yourselves and your families from a fire.",
      surah: "Surah At-Tahrim (66:6)",
    },
    hadithRef: {
      text: "Every one of you is a shepherd and every one of you is responsible for his flock.",
      source: "Sahih Bukhari & Muslim",
    },
    tags: ["Parenting", "Islamic Identity", "Canada", "Youth"],
    readTime: "9 min read",
  },
  {
    title: "Navigating Canadian Workplace Culture as a Practicing Muslim",
    category: "Muslim Life in Canada",
    excerpt:
      "Friday prayers, hijab, halal food, avoiding handshakes, Ramadan fasting — practicing Islam in Canadian workplaces has its unique challenges. This discussion shares Islamic guidance and practical tips for maintaining your deen while thriving professionally in Canada.",
    quranRef: {
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
      translation: "And whoever fears Allah — He will make for him a way out and will provide for him from where he does not expect.",
      surah: "Surah At-Talaq (65:2-3)",
    },
    hadithRef: {
      text: "Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you.",
      source: "Tirmidhi",
    },
    tags: ["Workplace", "Hijab", "Muslim Identity", "Professional Life"],
    readTime: "8 min read",
  },
  {
    title: "Halal Investing in Canada: ETFs, Stocks & Savings",
    category: "Islamic Finance",
    excerpt:
      "Can a Muslim invest in the Canadian stock market? What about RRSP and TFSA accounts? This discussion breaks down halal investing principles, which sectors to avoid, Shariah-screening methods, and the growing list of halal investment options available to Canadian Muslims.",
    quranRef: {
      arabic: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
      translation: "Allah has permitted trade and has forbidden interest.",
      surah: "Surah Al-Baqarah (2:275)",
    },
    hadithRef: {
      text: "The truthful and trustworthy merchant will be with the Prophets, the truthful, and the martyrs.",
      source: "Tirmidhi",
    },
    tags: ["Investing", "Halal Finance", "RRSP", "TFSA"],
    readTime: "11 min read",
  },
  {
    title: "Muslim Identity in Canada: Between Two Worlds",
    category: "Identity & Community",
    excerpt:
      "What does it mean to be a Muslim in Canada — balancing Canadian citizenship with Islamic values, navigating cultural pressures, and finding community in a vast multicultural society? This discussion offers guidance from Quran and Sunnah on living an integrated, authentic Muslim life in the West.",
    quranRef: {
      arabic: "إِنَّ الَّذِينَ آمَنُوا وَهَاجَرُوا وَجَاهَدُوا بِأَمْوَالِهِمْ وَأَنفُسِهِمْ فِي سَبِيلِ اللَّهِ",
      translation: "Indeed, those who have believed and emigrated and fought with their wealth and lives in the cause of Allah.",
      surah: "Surah Al-Anfal (8:72)",
    },
    hadithRef: {
      text: "Islam began as something strange and will return to being strange — so give glad tidings to the strangers.",
      source: "Sahih Muslim",
    },
    tags: ["Identity", "Muslim in West", "Community", "Canada"],
    readTime: "8 min read",
  },
];

export const canadaNews = [
  {
    title: "New Series: 'Muslim Life in Canada' Discussion Hub Launched",
    date: "August 20, 2026",
    excerpt:
      "Our Canadian community has launched a comprehensive online discussion series addressing the real challenges of Muslim life in Canada — from halal income to Islamic identity.",
  },
  {
    title: "Halal Finance Webinar Draws 800+ Canadian Participants",
    date: "August 5, 2026",
    excerpt:
      "Our live webinar on halal mortgages and riba-free investing in Canada attracted over 800 participants, making it our most attended online session ever.",
  },
  {
    title: "New Muslim Online Support Group Expands Across Canada",
    date: "July 15, 2026",
    excerpt:
      "Our digital support group for new Muslims and those exploring Islam now serves members from over 20 Canadian cities, with weekly online sessions and 24/7 chat support.",
  },
];

export type PreferencesOption = {
  id: string;
  label: string;
};

export type PreferencesStep = {
  id: string;
  title: string;
  multiple: boolean;
  options: PreferencesOption[];
};

export const PREFERENCES_STEPS: PreferencesStep[] = [
  {
    id: "hasBoughtBefore",
    title: "آیا قبلاً آثار هنری خریداری کرده‌اید؟",
    multiple: false,
    options: [
      { id: "true", label: "بله، من عاشق جمع‌آوری آثار هنری هستم." },
      { id: "false", label: "نه، من تازه شروع کردم" },
    ],
  },
  {
    id: "topics",
    title: "چه چیزی را در هنر بیشتر دوست دارید؟",
    multiple: true,
    options: [
      { id: "illustration", label: "پرورش ذوق هنری ام" },
      { id: "photography", label: "پیگیری هنری که به آن علاقه دارم" },
      { id: "typography", label: "پیدا کردن سرمایه‌گذاری عالی بعدی‌ام" },
      {
        id: "branding",
        label: "جمع‌آوری آثار هنری که مرا تحت تأثیر قرار می‌دهند",
      },
    ],
  },
  {
    id: "experience",
    title: "چیزی نمونده… حالا چند اثر انتخاب کن تا گالری تو را دقیق‌تر بسازیم.",
    multiple: false,
    options: [
      { id: "browse", label: "کشف سلیقهٔ هنری تو" },
      { id: "learn", label: "آثار برترِ حراج‌ها" },
      { id: "pro", label: "هنرمندان رو‌به‌رشد" },
      { id: "selected", label: "منتخب بهترین کارها" },
    ],
  },
];

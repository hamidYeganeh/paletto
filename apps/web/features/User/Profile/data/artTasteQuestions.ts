export type ArtTasteItem = {
  label: string;
  value: string;
};

export type ArtTasteQuestion = {
  index: number;
  type: string;
  question: string;
  items: ArtTasteItem[];
  multiple?: boolean;
};

export const artTasteQuestions: ArtTasteQuestion[] = [
  {
    index: 1,
    multiple: false,
    type: "hasBoughtBefore",
    question: "آیا قبلاً آثار هنری خریداری کرده‌اید؟",
    items: [
      {
        label: "بله، من عاشق جمع‌آوری آثار هنری هستم.",
        value: "true",
      },
      {
        label: "نه، من تازه شروع کردم",
        value: "false",
      },
    ],
  },
  {
    index: 2,
    multiple: true,
    type: "categories",
    question: "چه چیزی را در هنر بیشتر دوست دارید؟",
    items: [
      {
        label: "پرورش ذوق هنری ام",
        value: "cat-1",
      },
      {
        label: "پیگیری هنری که به آن علاقه دارم",
        value: "cat-2",
      },
      {
        label: "پیدا کردن سرمایه‌گذاری عالی بعدی‌ام",
        value: "cat-3",
      },
      {
        label: "جمع‌آوری آثار هنری که مرا تحت تأثیر قرار می‌دهند",
        value: "cat-4",
      },
      {
        label: "دنبال آثار هنری متناسب با بودجه‌ام هستم",
        value: "cat-5",
      },
    ],
  },
  {
    index: 3,
    multiple: true,
    type: "styles",
    question:
      "چیزی نمونده… حالا چند اثر انتخاب کن تا گالری تو را دقیق‌تر بسازیم.",
    items: [
      {
        label: "کشف سلیقهٔ هنری تو",
        value: "style-1",
      },
      {
        label: "آثار برترِ حراج‌ها",
        value: "style-2",
      },
      {
        label: "هنرمندان رو‌به‌رشد",
        value: "style-3",
      },
      {
        label: "منتخب بهترین کارها",
        value: "style-4",
      },
    ],
  },
];

import Link from "next/link";
import Checkbox from '@repo/ui/Checkbox'

export default function Home() {
  return (
    <main className="bg-blue-500 min-h-dvh h-dvh p-4 flex items-center justify-center flex-col gap-4">
      <Link href={"/login"}>LOGIN</Link>
      <Link href={"/profile/art-taste"}>ART TASTE</Link>

      <div className="max-w-xl flex flex-col gap-1">
        <Checkbox color={"white"} defaultChecked label="من شرایط و ضوابط عمومی فروش و سیاست حفظ حریم خصوصی پالِتو  را می‌پذیرم." />
        <Checkbox color={"primary"} defaultChecked label="من شرایط و ضوابط عمومی فروش و سیاست حفظ حریم خصوصی پالِتو  را می‌پذیرم." />
        <Checkbox color={"black"} defaultChecked label="من شرایط و ضوابط عمومی فروش و سیاست حفظ حریم خصوصی پالِتو  را می‌پذیرم." />
      </div>
    </main>
  );
}

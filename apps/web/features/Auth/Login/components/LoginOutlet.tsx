import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useLoginLayoutStore } from "../store/LoginLayoutStore";
import { cn } from "@repo/utils";
import Logo from "@/components/shared/Logo";
import { useTranslations } from "next-intl";
import { LoginForm } from "./LoginForm";

const layoutTransition = {
  layout: {
    stiffness: 260,
    damping: 24,
    duration: 0.5,
  },
};

export const LoginOutlet = () => {
  const t = useTranslations();
  const isLayoutTransformed = useLoginLayoutStore(
    (state) => state.isLayoutTransformed
  );

  return (
    <LayoutGroup>
      <motion.section
        layout="position"
        transition={layoutTransition}
        className=" h-[calc(100dvh-var(--auth-header-height-mobile))] w-full"
      >
        <AnimatePresence>
          <>
            <motion.section
              layout="position"
              transition={layoutTransition}
              className={cn("absolute flex items-center w-full", {
                "left-4 top-0 gap-2 flex-row-reverse h-auth-header-height-mobile":
                  isLayoutTransformed,
                "mx-auto left-0 right-0 gap-4 flex-col h-[calc(50dvh-var(--auth-header-height-mobile)-2px)] justify-end pb-4":
                  !isLayoutTransformed,
              })}
            >
              <motion.div layout="position" transition={layoutTransition}>
                <Logo
                  color={"secondary"}
                  size={isLayoutTransformed ? "xs" : "xl"}
                />
              </motion.div>

              <motion.p
                layout="position"
                transition={layoutTransition}
                className={cn(
                  "text-sm font-medium text-white tracking-[0.4em] select-none"
                )}
              >
                {t("Common.Metadata.appName")}
              </motion.p>

              {!isLayoutTransformed && (
                <motion.div
                  layout="position"
                  transition={{ ...layoutTransition, delay: 0.5 }}
                  initial={{ y: -50, opacity: 0, filter: "blur(5px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: 50, opacity: 0, filter: "blur(5px)" }}
                  className="overflow-hidden mt-4"
                >
                  <p className="text-white text-lg font-semibold">
                    {t("Auth.Login.form.online-artworks-market")}
                  </p>
                </motion.div>
              )}
            </motion.section>

            <motion.section
              layout="position"
              transition={layoutTransition}
              className={cn(
                "w-full absolute bottom-0 px-2 py-4 overflow-hidden",
                {
                  "h-[calc(100dvh-var(--auth-header-height-mobile))]":
                    isLayoutTransformed,
                  "h-[50dvh]": !isLayoutTransformed,
                }
              )}
            >
              <LoginForm />
            </motion.section>
          </>
        </AnimatePresence>
      </motion.section>
    </LayoutGroup>
  );
};

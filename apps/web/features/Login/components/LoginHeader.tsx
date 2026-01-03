import { Button } from "@repo/ui/Button";
import { cn } from "@repo/utils";

export const LoginHeader = () => {
  return (
    <header
      className={cn(
        "w-full p-2 h-auth-header-height-desktop",
        "max-md:h-auth-header-height-mobile"
      )}
    >
      <div className="w-full h-full flex flex-row items-center">
        <Button variant="contained" color="default" size={'xs'}>
          FA
        </Button>
      </div>
    </header>
  );
};

import { MotionProps } from "framer-motion";
import { LogoStylesVariants } from "./LogoStyles";

export interface LogoProps extends LogoStylesVariants, MotionProps {
  className?: string;
}

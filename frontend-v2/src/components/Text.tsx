import { cn } from "../utils";

const variants = {
  h1: "text-5xl font-extrabold dark:text-white",
  h2: "text-4xl font-bold dark:text-white",
  h3: "text-3xl font-bold dark:text-white",
  h4: "text-2xl font-bold dark:text-white",
  h5: "text-xl font-bold dark:text-white",
  h6: "text-lg font-bold dark:text-white",
  p: "mb-3 text-gray-500 dark:text-gray-400",
};

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
};

const Text: React.FC<Props> = ({ className, variant = "p", ...props }) => {
  return <span className={cn(variants[variant], className)} {...props} />;
};

export default Text;

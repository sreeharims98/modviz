import Link from "next/link";
import AuthButton from "./AuthButton";

export const Header = () => {
  return (
    <header className="w-full bg-panel border-b border-panel-border p-2">
      <div className="flex items-center justify-between">
        <Link href="/">
          <span className="font-bold text-3xl bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent drop-shadow">
            ModViz
          </span>
        </Link>
        <AuthButton />
      </div>
    </header>
  );
};

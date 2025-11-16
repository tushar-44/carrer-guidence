import { NavBar } from "@/components/navigation/nav-bar";
import { Footer } from "@/sections/footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <NavBar />
      <main className="w-full max-w-[1550px] mx-auto flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

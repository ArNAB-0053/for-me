"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
// import { useUser, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
// import Loader from "./loader";

const Header = () => {
//   const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-5 px-6 rounded-full z-50 w-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href='/'  className="flex items-center gap-2 font-bold">
          <Globe className="h-5 w-5 text-primary" />
          <span>LinkHub</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link
            href="#features"
            aria-label="View features section"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            aria-label="View pricing section"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            aria-label="View testimonials section"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {/* {!isLoaded ? (
            <Loader />
          ) : (
            <>
              <UserButton/>
              <SignedOut>
                <SignInButton>
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
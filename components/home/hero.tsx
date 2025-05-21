import { Roboto, Lexend_Giga, Montserrat } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });
const lexendgiga = Lexend_Giga({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-playfair",
});

const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  return (
    <section className="w-full flex-col mt-32 text-center space-y-6">
      <div className="space-y-2 leading-tight">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className={montserrat.className}>Track</span> <br />
          <span className={`${lexendgiga.className} tracking-wide`}>
            Your Finances
          </span>{" "}
          <br />
          <span className={montserrat.className}>Effortlessly</span>
        </h1>
      </div>
      <p
        className={`${roboto.className} max-w-xl mx-auto text-muted-foreground md:text-lg`}
      >
        Stay informed about your income and expenses with clear reports and
        clean visuals.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row justify-center">
        {isAuthenticated ? (
          <Button size="lg" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Link href="/signup">
              <Button size="lg">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;

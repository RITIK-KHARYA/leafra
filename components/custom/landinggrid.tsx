import { Zap, Lock, Users, Shield, Building, Puzzle, Plus } from "lucide-react";
import Link from "next/link";

export default function LandingGrid() {
  const features = [
    {
      icon: Zap,
      title: "Framework Agnostic",
      subtitle: "Support for popular frameworks.",
      description:
        "Supports popular frameworks, including React, Vue, Svelte, Astro, Solid, Next.js, Nuxt, Tanstack Start, Hono, and more.",
      link: "#",
    },
    {
      icon: Lock,
      title: "Authentication",
      subtitle: "Email & Password Authentication.",
      description:
        "Built-in support for email and password authentication, with session and account management features.",
      link: "#",
    },
    {
      icon: Users,
      title: "Social Sign-on",
      subtitle: "Support multiple OAuth providers.",
      description:
        "Allow users to sign in with their accounts, including GitHub, Google, Discord, Twitter, and more.",
      link: "#",
    },
    {
      icon: Shield,
      title: "Two Factor",
      subtitle: "Multi Factor Authentication.",
      description:
        "Secure your users accounts with two factor authentication with a few lines of code.",
      link: "#",
    },
    {
      icon: Building,
      title: "Multi Tenant",
      subtitle: "Organization Members and Invitation.",
      description:
        "Multi tenant support with members, organization, teams and invitation with access control.",
      link: "#",
    },
    {
      icon: Puzzle,
      title: "Plugin Ecosystem",
      subtitle: "A lot more features with plugins.",
      description:
        "Improve your application experience with our official plugins and those created by the community.",
      link: "#",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="relative">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-neutral-800">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isTopRow = index < 3;
              const isBottomRow = index >= 3;
              const isLeftColumn = index % 3 === 0;
              const isMiddleColumn = index % 3 === 1;
              const isRightColumn = index % 3 === 2;

              return (
                <div
                  key={index}
                  className={`
                    relative p-8 bg-black hover:bg-gray-950 transition-colors group
                    ${!isBottomRow ? "border-b border-gray-800" : ""}
                    ${!isRightColumn ? "border-r border-gray-800" : ""}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start space-x-3 mb-4">
                      <IconComponent className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    <h4 className="text-lg font-medium text-white mb-3 leading-tight">
                      {feature.subtitle}
                    </h4>

                    <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plus symbols at intersections */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top row intersections */}
            <div className="absolute top-0  transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <div className="absolute top-0 -right-4  transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            {/* <div className="absolute top-0 left-1/3 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <div className="absolute top-0 left-2/3 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div> */}

            {/* Middle row intersections */}
            <div className="absolute top-[52%] left-1/3 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <div className="absolute top-[52%] left-2/3 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>

            {/* Bottom row intersections */}
            {/* <div className="absolute bottom-0 left-1/3 transform -translate-x-1/2 translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <div className="absolute bottom-0 left-2/3 transform -translate-x-1/2 translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div> */}
            <div className="absolute -bottom-3  transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <div className="absolute -bottom-3 -right-4  transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>

            {/* Side intersections for medium screens */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:block lg:hidden">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

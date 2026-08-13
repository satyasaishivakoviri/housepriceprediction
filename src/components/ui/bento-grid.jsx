import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4", // Adjusted grid-cols-1 for mobile
                className,
            )}
        >
            {children}
        </div>
    );
};

import GridDistortion from "@/components/ui/grid-distortion";

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
    imageSrc,
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl md:col-span-1",
            "bg-black/20 [box-shadow:0_0_0_1px_rgba(255,255,255,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu backdrop-blur-3xl border border-white/10",
            className,
        )}
    >
        <div className="absolute inset-0 z-0">
            {imageSrc ? (
                <GridDistortion
                    imageSrc={imageSrc}
                    grid={15}
                    mouse={0.1}
                    strength={0.15}
                    relaxation={0.9}
                    className="opacity-100 min-h-full min-w-full object-cover"
                />
            ) : background}
        </div>
        <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-full justify-end">
            <Icon className="h-12 w-12 origin-left transform-gpu text-white transition-all duration-300 ease-in-out group-hover:scale-75" />
            <h3 className="text-xl font-semibold text-white">
                {name}
            </h3>
            <p className="max-w-lg text-neutral-300">{description}</p>
        </div>

        <div
            className={cn(
                "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            )}
        >
            <Button variant="ghost" asChild size="sm" className="pointer-events-auto text-neutral-700 dark:text-neutral-300">
                <a href={href}>
                    {cta}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
            </Button>
        </div>
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div >
);

export { BentoCard, BentoGrid };

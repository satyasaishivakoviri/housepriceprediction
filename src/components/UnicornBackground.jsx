"use client";
import React from 'react';
import UnicornScene from "unicornstudio-react/next";

export default function UnicornBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
            <UnicornScene
                projectId="Sd6swWdp3BCnr0zx5Nmw"
                sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
                width="100%"
                height="100%"
                scale={1}
                dpi={1.5}
                fps={60}
                lazyLoad={true}
            />
            {/* Optional overlay to darken/tint if needed */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        </div>
    );
}

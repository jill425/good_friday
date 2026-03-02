/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable the dev indicator badge that appears in the corner during development
    devIndicators: {
        buildActivity: false,
        // Optional: you can also disable the auto prerender indicator if needed
        // autoPrerender: false,
    },
    // Add any other existing config here if needed
};

module.exports = nextConfig;

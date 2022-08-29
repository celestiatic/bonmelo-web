const prodplugins = [
  // new WebpackObfuscator({
  //         controlFlowFlattening: true,
  //         controlFlowFlatteningThreshold: 0.5,
  //         deadCodeInjection: true,
  //         debugProtection: true,
  //         identifierNamesGenerator: "mangled",
  //         selfDefending: true,
  //         stringArrayEncoding: ['rc4', 'base64'],
  //   })
]
const prodrules = [

];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  experimental: {
    runtime: "experimental-edge",
    serverComponents: true,
    workerThreads: true,
    // optimizeCss: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    // reactRemoveProperties: true,
    // styledComponents: true,
    // experimentalDecorators: true,
    // jsxImportSource: "preact",
    // removeConsole: {
    //   exclude: ["warn", "error"],
    // },
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Include Production Plugins
      if (prodplugins) config.plugins.push(...prodplugins);

      // Simplify and Minify CSS Classes
      if (prodrules) config.module.rules.push(...prodrules);
    }

    return config;
  },
};

module.exports = nextConfig;

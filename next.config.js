/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["i.ytimg.com"],
  },
  async headers() {
    return [
      {
        source: "/api/trpc/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,HEAD,POST,PUT,DELETE,PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: `${process.env.PUBLIC_DOMAIN}` ?? "localhost:3000",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(nextConfig);

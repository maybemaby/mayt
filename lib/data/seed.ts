import db from "./db";

export const seedVideos = async () => {
  await db.video.createMany({
    data: [
      {
        name: "How I made this web app",
        pinned: true,
        ytId: "a31asvafas",
      },
      {
        name: "Secret of being a web developer",
        pinned: false,
        ytId: "glkqwe1310asda",
      },
      {
        name: "Click here to get a free React.js website",
        pinned: false,
        ytId: "asdf1lkma390allfa",
      },
      {
        name: "Check your inbox for this amazing offer",
        pinned: true,
        ytId: "39104nsad831",
      },
    ],
  });
};

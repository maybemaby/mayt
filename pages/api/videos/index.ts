import type { NextApiRequest, NextApiResponse } from "next";
import VideoController from "../../../lib/features/video/controllers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // POST api/videos
    case "POST":
      await VideoController.PostVideo(req, res);
      break;
    default:
      res.status(405).send("Method not supported");
  }
}

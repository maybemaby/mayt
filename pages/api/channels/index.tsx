import type { NextApiRequest, NextApiResponse } from "next";
import ChannelController from "../../../lib/features/channels/controllers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // POST api/videos
    case "POST":
      await ChannelController.postChannel(req, res);
      break;
    default:
      res.status(405).send("Method not supported");
  }
}

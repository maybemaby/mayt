import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import VideoService from "../VideoService";

// DELETE api/videos/[id].ts
export const DeleteVideo = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (id && typeof id === "string") {
    try {
      await VideoService.deleteVideo(id);
      res.status(204);
    } catch (ex) {
      if (ex instanceof PrismaClientKnownRequestError) {
        res.status(404);
      } else res.status(500);
    }
  } else {
    res.status(404);
  }
};

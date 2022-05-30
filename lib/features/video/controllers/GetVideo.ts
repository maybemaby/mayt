import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { getQuerySchema } from "../schema/GetQuery";
import VideoService from "../VideoService";

// GET api/videos?size=&last=&date=asc|desc&tag=&tag=
export const GetVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const casted = getQuerySchema.cast(req.query);

  // if (!(await getQuerySchema.isValid(casted))) {
  //   res.status(400).json({
  //     status: 400,
  //     message: "Invalid query parameters",
  //   });
  //   return;
  // }

  try {
    const videos = await VideoService.findVideos({
      channelId: casted.channelId,
      cursor: casted.last,
      size: casted.size,
      matchingTags: casted.tag,
    });

    res.status(200).json(videos);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(400).json({ status: 400, message: "Could not execute query" });
    } else {
      res.status(500);
    }
  }
};

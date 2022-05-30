import { NextApiRequest, NextApiResponse } from "next";
import { postVideoSchema, PostVideoDto } from "../models/Video";
import VideoService from "../VideoService";

export const PostVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const dto = req.body as PostVideoDto;
  if (await postVideoSchema.isValid(dto)) {
    const video = await VideoService.createVideo(dto);
    res.status(201).json(video);
  } else {
    res.status(400).json({
      status: 400,
      message: "Invalid request body",
    });
  }
};
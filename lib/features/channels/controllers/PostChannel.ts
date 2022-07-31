import { NextApiRequest, NextApiResponse } from "next";
import { postChannelSchema } from "../../video/models/Channel";
import ChannelService from "../ChannelService";

export const postChannel = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const dto = req.body;
  if (await postChannelSchema.isValid(dto)) {
    const channel = await ChannelService.createOrUpdateChannel(dto);
    res.status(201).json(channel);
  } else {
    res.status(400).json({
      status: 400,
      message: "Invalid request body.",
    });
  }
};

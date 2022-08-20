import db from "../../data";

type FindTagOptions = {
  videoId?: string;
};

async function createTag(name: string, typeId?: string) {
  return await db.tag.create({
    data: {
      name,
      typeId,
    },
  });
}

async function findTags(opts: FindTagOptions) {
  const params: Parameters<typeof db.tag.findMany>[0] = {};

  if (opts.videoId) {
    params.where = {
      VideoTag: {
        some: {
          videoId: opts.videoId,
        },
      },
    };
  }

  return await db.tag.findMany({ ...params });
}

async function deleteTag(id: string) {
  return await db.tag.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

const TagService = {
  createTag,
  findTags,
  deleteTag,
};

export default TagService;

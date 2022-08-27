export type VideoForm = {
  channel?: string;
  tags?: string[];
  orderBy?: {
    prop: "addedAt" | "name";
    direction: "asc" | "desc";
  };
};

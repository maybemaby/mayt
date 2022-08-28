import styled from "styled-components";
import { SubmitHandler, useForm } from "react-hook-form";
import RaisedBlockButton from "./common/RaisedBlockButton";
import { VideoForm } from "../lib/types";
import { trpc } from "../lib/utils/trpc";
import BaseTextInput from "./common/BaseTextInput";

const Form = styled.form`
  display: flex;
  gap: 20px;
  row-gap: 10px;
  align-items: center;
  padding: 0 30px 30px 30px;
  flex-direction: column;
  margin-bottom: 20px;

  select {
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSize[2]};
    width: 200px;
    padding: 10px;
    background: ${(props) => props.theme.color.grey[50]};
    border: 2px solid ${(props) => props.theme.color.grey[300]};
    border-radius: 5px;
  }

  select[multiple] {
    height: 80px;
  }

  @media screen and (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Field = styled.span`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: fit-content;

  @media screen and (min-width: 768px) {
    height: 100px;
  }
`;

interface VideoFilterFormProps {
  channels: { name: string; id: string }[];
  submitHandler(values: VideoForm): void;
}

const VideoFilterForm = ({ channels, submitHandler }: VideoFilterFormProps) => {
  const { register, handleSubmit } = useForm<VideoForm>();

  const tags = trpc.useQuery(["tags.find", {}]);

  const onSubmit: SubmitHandler<VideoForm> = (values) => {
    console.log(values);
    if (values.orderBy) {
      const [sortProp, sortOrder] = values.orderBy.prop.split(".") as [
        "name" | "addedAt",
        "asc" | "desc"
      ];
      if (sortProp && sortOrder) {
        submitHandler({
          ...values,
          orderBy: { prop: sortProp, direction: sortOrder },
        });
      }
    } else {
      submitHandler({ ...values, orderBy: undefined });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <BaseTextInput
        style={{
          width: "200px",
          margin: "0",
          boxShadow: "none",
          borderWidth: "2px",
        }}
        {...register("query", { required: false })}
        placeholder="Search"
      />
      <Field>
        <label htmlFor="channel">Channel</label>
        <select {...register("channel", { minLength: 1, required: false })}>
          <option value={""}></option>
          {channels.map((channel) => (
            <option key={channel.id} value={channel.id}>
              {channel.name}
            </option>
          ))}
        </select>
      </Field>

      <Field>
        <label htmlFor="tags">Tags</label>
        <select multiple {...register("tags", { required: false })}>
          {tags.isSuccess &&
            tags.data.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
        </select>
      </Field>

      <Field>
        <label htmlFor="sort">Sort</label>
        <select
          {...register("orderBy.prop", {
            required: false,
          })}
        >
          <option value={"addedAt.desc"}>Added At &#8595;</option>
          <option value={"addedAt.asc"}>Added At &#8593;</option>
          <option value={"name.desc"}>Name &#8595;</option>
          <option value={"name.asc"}>Name &#8593;</option>
        </select>
      </Field>

      <RaisedBlockButton style={{ height: "50px" }} type="submit">
        Filter
      </RaisedBlockButton>
    </Form>
  );
};

export default VideoFilterForm;

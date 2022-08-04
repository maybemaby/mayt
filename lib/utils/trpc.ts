import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../../pages/api/trpc/[trpc]";
import type {
  inferProcedureOutput,
  inferProcedureInput,
  inferSubscriptionOutput,
} from "@trpc/server";

export const trpc = createReactQueryHooks<AppRouter>();

export type TQuery = keyof AppRouter["_def"]["queries"];

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

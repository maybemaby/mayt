import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";

export const defaultServerError = new trpc.TRPCError({
  code: "INTERNAL_SERVER_ERROR",
  message: "Error",
});

export function prismaKnownErrorToTrpc(
  e: PrismaClientKnownRequestError
): trpc.TRPCError {
  switch (e.code) {
    case "P2002":
      return new trpc.TRPCError({
        code: "CONFLICT",
        message: "Entity already exists, cannot create duplicate.",
      });
    default:
      return defaultServerError;
  }
}

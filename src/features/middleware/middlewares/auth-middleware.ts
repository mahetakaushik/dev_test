import { NextResponse } from "next/server";
import {
  isProtectedRoute,
  isPublicRoute,
  isUniversalRoute,
} from "@/features/auth";
import { authConfig } from "@/config/auth";
import { paths } from "@/config/routes";
import type { Middleware } from "../types";

/**
 * Authentication middleware that enforces route access rules.
 */
export const authMiddleware: Middleware = async (request, next) => {
  const path = request.nextUrl.pathname;

  // Universal routes can be accessed by everyone
  if (isUniversalRoute(path)) {
    return await next();
  }

  const hasSession = !!request.cookies.get(authConfig.sessionCookieName);

  // Redirect authenticated users away from public routes
  if (isPublicRoute(path) && hasSession) {
    return NextResponse.redirect(new URL(paths.homePage, request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute(path) && !hasSession) {
    return NextResponse.redirect(new URL(paths.landingPage, request.url));
  }
  // Continue to the next middleware or route handler
  return await next();
};

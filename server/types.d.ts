"use strict";

import { UserConfig } from "vite";

/**
 * mvpjs User Configuration.
 */
declare class MvpUserConfig {
  /**
   * This is the relative path and name of **server directory**.
   * This property **could be set** in a **.env** file also, with **SERVER_PATH key**.
   * @default src/server
   */
  serverPath?: string | undefined;
  /**
   * This is the relative path and name of **client directory**.
   * This property **could be set** in a **.env** file also, with **CLIENT_PATH key**.
   * @default src/client
   */
  clientPath?: string | undefined;

  /**
   * This is the relative path and name of **directory** where code is going to be after build process.
   * This property **could be set** in a **.env** file also, with **OUT_DIR key**.
   * @default /dist
   */
  outDir?: string | undefined;
  /**vite user config */
  vite?: UserConfig | undefined;
}

/**
 * Fluent builder for constructing SEO metadata.
 */
interface SeoBuilder {
  /**
   * Sets the SEO title of the page.
   * @param title - The title of the page.
   * @returns The builder instance for method chaining.
   */
  Title(title: string): SeoBuilder;

  /**
   * Sets the SEO description of the page.
   * @param description - A short description of the page content.
   * @returns The builder instance for method chaining.
   */
  Description(description: string): SeoBuilder;

  /**
   * Sets the SEO keywords for the page.
   * @param keywords - Comma-separated list of keywords or an array of strings.
   * @returns The builder instance for method chaining.
   */
  KeyWords(keywords: string | string[]): SeoBuilder;

  /**
   * Builds and returns the final SEO metadata object.
   * @returns An object containing the title, description, and keywords.
   */
  build(): Seo;
}

/**
 * Entry point for building SEO metadata using a fluent API.
 */
interface Seo {
  title: string;
  description: string;
  keywords: string;
}

import { Request } from "express";
interface MvpJsRequest extends Request {}
import { Response } from "express";
interface MvpJsResponse extends Response {
  index: string;
}

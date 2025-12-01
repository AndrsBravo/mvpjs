"use strict"

import { UserConfig as ViteUserConfig } from "vite"
import { Request, Response } from "express"

/**
 * ============================================
 * MVPJS Configuration Types
 * ============================================
 */

/**
 * HTTP Communication configuration
 */
interface HttpConfig {
  /** Timeout for HTTP requests in milliseconds */
  timeout?: number
  /** Enable automatic retries */
  retries?: number
  /** Retry backoff strategy: 'linear' | 'exponential' */
  retryStrategy?: "linear" | "exponential"
  /** Headers to include in all requests */
  defaultHeaders?: Record<string, string>
  /** Base URL for all requests */
  baseURL?: string
}

/**
 * Caching/Storage configuration
 */
interface CacheConfig {
  /** Enable caching */
  enabled?: boolean
  /** Cache storage type: 'memory' | 'sessionStorage' | 'localStorage' | 'indexedDB' */
  type?: "memory" | "sessionStorage" | "localStorage" | "indexedDB"
  /** Time to live in milliseconds */
  ttl?: number
  /** Max cache size */
  maxSize?: number
}

/**
 * SEO configuration
 */
interface SeoConfig {
  /** Enable SEO meta tag generation */
  enabled?: boolean
  /** Default title suffix/prefix */
  titleTemplate?: string
  /** Default description */
  defaultDescription?: string
  /** Open Graph configuration */
  openGraph?: {
    type?: string
    locale?: string
  }
  /** Twitter Card configuration */
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player"
    creator?: string
  }
}

/**
 * Build and development options
 */
interface BuildConfig {
  /** Frontend-only, backend-only, or fullstack mode */
  mode?: "frontend" | "backend" | "fullstack"
  /** Enable server-side rendering */
  ssr?: boolean
  /** Enable code splitting */
  codeSplitting?: boolean
  /** Minify output */
  minify?: boolean
}

/**
 * Environment-specific configuration
 */
interface EnvironmentConfig {
  /** Development environment settings */
  dev?: Record<string, any>
  /** Staging environment settings */
  staging?: Record<string, any>
  /** Production environment settings */
  prod?: Record<string, any>
}

/**
 * MVPJS User Configuration
 * Extends Vite's UserConfig with MVP-specific options
 */
declare interface MvpUserConfig extends ViteUserConfig {
  /**
   * The relative path and name of the **server directory**.
   * Can also be set in **.env** with **SERVER_PATH** key.
   * @default "src/backend"
   */
  serverPath?: string

  /**
   * The relative path and name of the **client directory**.
   * Can also be set in **.env** with **CLIENT_PATH** key.
   * @default "src/frontend"
   */
  clientPath?: string

  /**
   * The relative path and name of the **directory** where code is generated after build.
   * Can also be set in **.env** with **OUT_DIR** key.
   * @default "dist"
   */
  outDir?: string

  /**
   * Build configuration (mode, SSR, code splitting, etc.)
   */
  build?: BuildConfig & ViteUserConfig["build"]

  /**
   * HTTP communication settings
   */
  http?: HttpConfig

  /**
   * Caching and storage strategy
   */
  cache?: CacheConfig

  /**
   * SEO metadata configuration
   */
  seo?: SeoConfig

  /**
   * Environment-specific configurations
   */
  environments?: EnvironmentConfig

  /**
   * Nested Vite configuration (if needed for advanced cases)
   */
  vite?: ViteUserConfig

  /**
   * Custom input entries for build
   */
  input?: Record<string, string>

  /**
   * Public directory for static assets
   */
  publicDir?: string

  /**
   * Enable automatic page detection with @page decorators
   */
  autoRouting?: boolean

  /**
   * Template parsing configuration
   */
  templates?: {
    /** Enable automatic template detection */
    autoDetect?: boolean
    /** Template file extensions to watch */
    extensions?: string[]
  }
}

/**
 * ============================================
 * SEO Types
 * ============================================
 */

/**
 * Fluent builder for constructing SEO metadata.
 */
interface SeoBuilder {
  /**
   * Sets the SEO title of the page.
   */
  Title(title: string): SeoBuilder

  /**
   * Sets the SEO description of the page.
   */
  Description(description: string): SeoBuilder

  /**
   * Sets the SEO keywords for the page.
   */
  KeyWords(keywords: string | string[]): SeoBuilder

  /**
   * Builds and returns the final SEO metadata object.
   */
  build(): Seo
}

/**
 * SEO Metadata object
 */
interface Seo {
  title: string
  description: string
  keywords: string
}

/**
 * ============================================
 * Express Request/Response Extensions
 * ============================================
 */

/**
 * Extended Express Request with MVPJS utilities
 */
interface MvpJsRequest extends Request {
  /** User data from authentication middleware */
  user?: any
  /** Route parameters */
  params?: Record<string, any>
  /** Query parameters */
  query?: Record<string, any>
  /** Validated and transformed body data */
  validatedData?: Record<string, any>
}

/**
 * Extended Express Response with MVPJS utilities
 */
interface MvpJsResponse extends Response {
  /** Index of current view or component */
  index?: string

  /**
   * Send JSON response with standard structure
   */
  json(data: any): this

  /**
   * Send success response
   */
  success(data: any, message?: string, statusCode?: number): this

  /**
   * Send error response
   */
  error(message: string, statusCode?: number, details?: any): this

  /**
   * Send paginated response
   */
  paginate(data: any[], total: number, page: number, pageSize: number): this
}

/**
 * ============================================
 * HTTP Communication Types
 * ============================================
 */

/**
 * AJAX/HTTP Request configuration
 */
interface AjaxConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  cache?: CacheConfig
}

/**
 * HTTP Response wrapper
 */
interface HttpResponse<T = any> {
  status: number
  statusText: string
  data: T
  headers: Record<string, string>
}

/**
 * Event-based communication handler
 */
interface EventHandler {
  on(event: string, callback: (data: any) => void): void
  off(event: string, callback: (data: any) => void): void
  emit(event: string, data: any): void
}

/**
 * WebSocket connection options
 */
interface WebSocketConfig {
  url: string
  protocols?: string | string[]
  reconnect?: boolean
  reconnectInterval?: number
  reconnectAttempts?: number
}

/**
 * ============================================
 * Router Types
 * ============================================
 */

/**
 * Route metadata
 */
interface RouteMetadata {
  path: string
  method: "get" | "post" | "put" | "delete" | "patch" | "head" | "options"
  handlers: any[]
  middleware?: any[]
}

/**
 * Page decorator options
 */
interface PageDecoratorOptions {
  /** Route path */
  path: string
  /** Layout to use */
  layout?: string
  /** SEO metadata */
  seo?: Partial<Seo>
  /** Page title */
  title?: string
}

/**
 * ============================================
 * EndPoint Collection Types
 * ============================================
 */

/**
 * HTTP Endpoint definition
 */
interface EndPointDefinition {
  url: string
  requestInit?: any
  cache?: CacheConfig
  transform?: (data: any) => any
}

/**
 * EndPoints collection configuration
 */
interface EndPointsConfig {
  name: string
  baseURL: string
  endPoints: Record<string, EndPointDefinition>
}

/**
 * ============================================
 * RequestInitBuilder Types
 * ============================================
 */

/**
 * Fluent builder for HTTP requests
 */
interface RequestInitBuilder {
  method: {
    GET: RequestInitBuilder
    POST: RequestInitBuilder
    PUT: RequestInitBuilder
    DELETE: RequestInitBuilder
    PATCH: RequestInitBuilder
    HEAD: RequestInitBuilder
  }

  headers: {
    ContentType: {
      application_json: RequestInitBuilder
      text_html: RequestInitBuilder
      application_x_www_form_urlencoded: RequestInitBuilder
      multipart_form_data: RequestInitBuilder
    }
    Authorization: {
      Bearer(token: string): RequestInitBuilder
      Basic(credentials: string): RequestInitBuilder
      ApiKey(key: string): RequestInitBuilder
      Custom(name: string, value: string): RequestInitBuilder
    }
  }

  cache: {
    no_store: RequestInitBuilder
    force_cache: RequestInitBuilder
    no_cache: RequestInitBuilder
  }

  credentials: {
    include: RequestInitBuilder
    same_origin: RequestInitBuilder
    omit: RequestInitBuilder
  }

  mode: {
    cors: RequestInitBuilder
    no_cors: RequestInitBuilder
    same_origin: RequestInitBuilder
  }

  redirect: {
    follow: RequestInitBuilder
    error: RequestInitBuilder
    manual: RequestInitBuilder
  }

  keepalive: {
    true: RequestInitBuilder
    false: RequestInitBuilder
  }

  timeout(ms: number): RequestInitBuilder
  retries(
    count: number,
    strategy?: "linear" | "exponential",
  ): RequestInitBuilder
  interceptors(request?: any, response?: any): RequestInitBuilder

  build: any
}

export {
  MvpUserConfig,
  HttpConfig,
  CacheConfig,
  SeoConfig,
  BuildConfig,
  EnvironmentConfig,
  SeoBuilder,
  Seo,
  MvpJsRequest,
  MvpJsResponse,
  AjaxConfig,
  HttpResponse,
  EventHandler,
  WebSocketConfig,
  RouteMetadata,
  PageDecoratorOptions,
  EndPointDefinition,
  EndPointsConfig,
  RequestInitBuilder,
}

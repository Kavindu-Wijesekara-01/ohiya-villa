import mongoose from "mongoose";
import dns from "dns";

const FALLBACK_DNS_SERVERS = ["8.8.8.8", "1.1.1.1", "8.8.4.4"];

// Ensure SRV DNS resolution succeeds across all local ISP routers (especially Windows)
function applyDnsServers() {
  try {
    dns.setServers(FALLBACK_DNS_SERVERS);
  } catch {
    // Ignore if an active DNS query prevents changing global servers right now
  }
}

applyDnsServers();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env or .env.local");
}

/**
 * Fallback resolver for `mongodb+srv://` URIs when the runtime environment's
 * global c-ares DNS defaults to 127.0.0.1 and refuses SRV queries.
 */
async function resolveSrvUriFallback(srvUri: string): Promise<string> {
  const parsed = new URL(srvUri);
  const resolver = new dns.promises.Resolver();
  resolver.setServers(FALLBACK_DNS_SERVERS);

  const [srvRecords, txtRecords] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${parsed.hostname}`),
    resolver.resolveTxt(parsed.hostname).catch(() => [] as string[][]),
  ]);

  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
  const params = new URLSearchParams();
  for (const chunk of txtRecords) {
    const txtParams = new URLSearchParams(chunk.join(""));
    txtParams.forEach((v, k) => params.set(k, v));
  }
  parsed.searchParams.forEach((v, k) => params.set(k, v));
  if (!params.has("tls") && !params.has("ssl")) {
    params.set("tls", "true");
  }

  const auth = parsed.username
    ? `${parsed.username}:${parsed.password}@`
    : "";
  const dbPath = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "/";
  return `mongodb://${auth}${hosts}${dbPath}?${params.toString()}`;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    };

    const uri = MONGODB_URI as string;
    applyDnsServers();

    cached.promise = mongoose.connect(uri, opts).catch(async (err) => {
      const msg = err instanceof Error ? err.message : "";
      if (uri.startsWith("mongodb+srv://") && (msg.includes("querySrv") || msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND"))) {
        const directUri = await resolveSrvUriFallback(uri);
        return mongoose.connect(directUri, opts);
      }
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

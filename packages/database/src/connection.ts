import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL!;

function waitForOpen(): Promise<void> {
  return new Promise((resolve, reject) => {
    mongoose.connection.once('connected', () => resolve());
    mongoose.connection.once('error', (err) => reject(err));
  });
}

export async function connectDB() {
  let readyState: number = mongoose.connection.readyState;
  if (readyState === mongoose.ConnectionStates.connected) return mongoose;

  if (readyState === mongoose.ConnectionStates.connecting) {
    await waitForOpen();
    return mongoose;
  }

  if (global._mongoose?.promise) {
    try {
      await global._mongoose.promise;
    } catch {
      global._mongoose.promise = null;
    }
    readyState = mongoose.connection.readyState;
    if (readyState === mongoose.ConnectionStates.connected) return mongoose;
  }

  const p = mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    autoSelectFamily: false,
  });
  global._mongoose = { conn: mongoose.connection, promise: p };
  await p;
  return mongoose;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  global._mongoose = { conn: null, promise: null };
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  };
}

import mongoose from 'mongoose';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/apon-air-travels';
const ATLAS_URI = process.env.DATABASE_URL!;

async function main() {
  const local = await mongoose.createConnection(LOCAL_URI, { autoSelectFamily: false }).asPromise();
  const atlas = await mongoose.createConnection(ATLAS_URI, { autoSelectFamily: false }).asPromise();

  const collections = await local.db.listCollections().toArray();

  for (const { name } of collections) {
    if (name.startsWith('system.')) continue;
    const docs = await local.db.collection(name).find({}).toArray();
    if (!docs.length) {
      console.log(`⏭️  ${name}: 0 docs, skipping`);
      continue;
    }
    const ops = docs.map((d) => ({
      replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true },
    }));
    const res = await atlas.db.collection(name).bulkWrite(ops);
    console.log(`✅ ${name}: ${docs.length} docs synced`);
  }

  await local.close();
  await atlas.close();
  console.log('🎉 Migration complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

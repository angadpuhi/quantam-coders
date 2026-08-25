async function testMessages() {
  const locales = ["en", "ml", "hi", "bn", "or"];
  for (const loc of locales) {
    try {
      const messages = (await import(`../messages/${loc}.json`, { assert: { type: 'json' } })).default || (await import(`../messages/${loc}.json`));
      console.log(`✅ Loaded ${loc}.json successfully (${Object.keys(messages).length} keys)`);
    } catch (err) {
      console.error(`❌ Error loading ${loc}.json:`, err);
    }
  }
}

testMessages();

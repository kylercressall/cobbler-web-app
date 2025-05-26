// test-dns.js
const dns = require("dns");

dns.lookup("db.rdeiyagvoovjkiopydaa.supabase.co", (err, address, family) => {
  if (err) {
    console.error("DNS lookup failed:", err);
  } else {
    console.log("Address:", address);
  }
});

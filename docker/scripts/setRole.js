try {
    require('mongodb');
} catch(e) {
    require('child_process').execSync('npm install', {
        stdio: 'inherit'
    });
}

const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'capstone_test1';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('users');
  
    const [email, role] = process.argv.slice(2, 4);
    if (!email || !role) {
        console.log("Sets a user's role")
        console.log('Syntax: [email] [role]')
        console.log("email@example.com (pending | user | staff | admin)");
        return;
    }
    const result = await collection.updateOne({ email: email }, { $set: { role: role }})
    if (result.matchedCount == 0) throw new Error('Failed to update, user does not exist!');
    if (result.modifiedCount == 0) return 'User already had role';
  
    console.log('(' + email + ').role = ' + role);

    return 'done';
  }
  
  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
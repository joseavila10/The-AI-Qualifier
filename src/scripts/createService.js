const fs = require('fs');
const path = require('path');
const { createRouteTemplate } = require('./serviceTemplate');

const [,, servicePathRaw] = process.argv;

if (!servicePathRaw) {
    console.error(`❌ Please provide a service name in single quotes, e.g., 'auth' or 'auth/login'`);
    process.exit(1);
}

if (/\s/.test(servicePathRaw)) {
    console.error(`❌ Service name contains spaces. Wrap it in single quotes: 'my-service'`);
    process.exit(1);
}

const servicePath = servicePathRaw.trim();
const segments = servicePath.split('/');
const serviceName = segments[segments.length - 1];

const filePath = path.join(__dirname, `../../src/app/services/${servicePath}/index.ts`);

if (fs.existsSync(filePath)) {
    console.error(`❌ Service file already exists: src/app/services/${servicePath}/index.ts`);
    process.exit(1);
}

const dirPath = path.dirname(filePath);
fs.mkdirSync(dirPath, { recursive: true });

const template = createRouteTemplate(serviceName);

fs.writeFileSync(filePath, template);
console.log(`✅ Service file created: src/app/services/${servicePath}/index.ts`);

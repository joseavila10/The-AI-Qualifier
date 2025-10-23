const fs = require('fs');
const path = require('path');
const { createRouteTemplate } = require('./pageRouteTemplate');

const [,, routePathRaw] = process.argv;

if (!routePathRaw) {
    console.error(`❌ Please provide a route name in single quotes, e.g., 'users'`);
    process.exit(1);
}

if (/\s/.test(routePathRaw)) {
    console.error(`❌ Route name contains spaces. Wrap it in single quotes: 'my-route'`);
    process.exit(1);
}

const routePath = routePathRaw.trim();

const checkDirRoute = path.join(__dirname, `../src/pages/api/${routePath}`);

const includesParameter = routePath.split('/').some(segment => segment.startsWith(':'));

if(includesParameter){
    const paramsArray = routePath
    .split('/')
    .filter(segment => segment.startsWith(':'))
    .map(segment => segment.slice(1));

    const transformDynamicSegments = (pathStr) =>
        pathStr
            .split('/')
            .map(segment => segment.startsWith(':') ? `[${segment.slice(1)}]` : segment)
            .join('/');

    const transformedPath = transformDynamicSegments(routePath);
    const segments = transformedPath.split('/');
    const lastSegment = segments[segments.length - 1];

    const isLastDynamic = lastSegment.startsWith('[') && lastSegment.endsWith(']');

    const filePath = isLastDynamic
        ? path.join(__dirname, `../pages/api/${segments.slice(0, -1).join('/')}`, `${lastSegment}.ts`)
        : path.join(__dirname, `../pages/api/${transformedPath}/index.ts`);

    const relativePath = path.relative(path.join(__dirname, '../pages/api'), filePath);

    console.log(`Creating route file: src/pages/api/${relativePath}`);
    const routeTemplate = createRouteTemplate(paramsArray);

    if (fs.existsSync(filePath)) {
        console.error(`❌ Route file already exists: ${filePath}`);
        process.exit(1);
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, routeTemplate);
    
    console.log(`✅ Route file created: src/pages/api/${relativePath}`);
} else {
    const checkDirRouteWithIndex = path.join(__dirname, `../src/pages/api/${routePath}/index.ts`);

    if (fs.existsSync(checkDirRouteWithIndex)) {
        console.error('❌ Route page already exists');
        process.exit(1);
    }

    const routeTemplate = createRouteTemplate([]);

    const routeDirectory = path.join(__dirname, `../pages/api/${routePath}/index.ts`);

    if (!fs.existsSync(routeDirectory)) {
        const routeDirPath = path.dirname(routeDirectory);
        fs.mkdirSync(routeDirPath, { recursive: true });
        fs.writeFileSync(routeDirectory, routeTemplate);
        console.log(`✅ Route file created: src/pages/api/${routePath}/index.ts`);
    } else {
        console.log(`❌ src/pages/api/${routePath}/index.ts already exists`);
    }
}

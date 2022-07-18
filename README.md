## CheckDeps

Utility for detect too young dependency

### Development

`tsc && check-deps-age -i ./.checkdepsignore --cacheFile ./cd.json`

### Working with yarn because

- when do `npm i package` preinstall script dont working
- when do `yarn add package` preinstall script is working

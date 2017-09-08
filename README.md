ionic-module-pixlive
====================

Ionic (Angular) module for PixLive SDK (ionic >= 2)

How to use
----------

1. Install the PixLive plugin for Cordova. Follow the "Installation" instructions of the [cordova-plugin-pixlive](https://github.com/vidinoti/cordova-plugin-PixLive)
2. Install this plugin: `npm install ionic-module-pixlive`
3. Open the file `app.module.ts` and import the module: `import { PixliveModule } from 'ionic-module-pixlive';`
4. Add the module in the `imports` section of the `@NgModule` declaration
5. Add the Pixlive Component (i.e. the AR scanner) in an HTML page: `<pixlive style="width: 100%; height: 100%;"></pixlive>`
6. Initialize the PixLive module in `app.component.ts`
  ```
    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, pixliveService: PixliveService) {
      platform.ready().then(() => {
        statusBar.styleDefault();
        splashScreen.hide();
        pixliveService.init();
      });
    }
  ```
7. Synchronize the application with the PixLive server (for example, every time that the application starts, it should synchronize with PixLive Maker)
  ```
      pixliveService.sync([]);
  ```

Contribute
----------

### How to build

```
npm install
npm run build
```

### Create new release and publish to NPM registry

Update the version in `package.json` and `dist/package.json`.

```
# Publish on NPM
npm run build
npm publish dist
# Commit your changes
git commit -m "your message"
git push
# Tag the release
git tag -a v0.3.0 -m "release 0.3.0"
git push origin --tags
```

References
----------

https://medium.com/@cyrilletuzi/how-to-build-and-publish-an-angular-module-7ad19c0b4464


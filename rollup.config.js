export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/pixlive.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'pixlive',
    globals: {
        '@angular/core': 'ng.core',
        'ionic-angular': 'ionicangular',
        'rxjs/Observable': 'Rx',
        'rxjs/Subject': 'Rx',
        'rxjs/BehaviorSubject': 'Rx',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable'
    },
    external: [
        '@angular/core',
        'ionic-angular',
        'rxjs',
        'rxjs/BehaviorSubject',
        'rxjs/Subject'
    ]
}
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  database: {
    host: '52.90.231.122', //ip_publica_ec2 , remplazar cada que cambie
    // para conectarse luego remotamente: mysql -h [ip_publica_ec2] -u meditrack_user -p , y luego password: PasswordSeguro123!
    port: 3306,
    database: 'MediTrack',
    username: 'meditrack_user',
    password: 'PasswordSeguro123!'
  },
  // Para desarrollo inicial con JSON Server
  apiUrls: {
    pacientes: 'http://localhost:3001/api',
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


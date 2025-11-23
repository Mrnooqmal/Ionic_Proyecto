// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,

  //referencial
  database: {
    host: '34.233.199.164', //IP pública EC2 (Laravel y MySQL en la misma instancia)
    port: 3306,
    database: 'MediTrack',
    username: 'meditrack_user',
    password: 'PasswordSeguro123!',
  },

  apiUrls: {
    base: 'http://localhost:3001/api',
    pacientes: 'http://localhost:3001/api/pacientes',
    consultas: 'http://localhost:3001/api/consultas',
    diagnosticos: 'http://localhost:3001/api/diagnosticos',
    medicamentos: 'http://localhost:3001/api/medicamentos',
    profesionales: 'http://localhost:3001/api/profesionales',
    servicios: 'http://localhost:3001/api/servicios',
    tiposConsulta: 'http://localhost:3001/api/tipos-consulta',
    tiposProcedimiento: 'http://localhost:3001/api/tipos-procedimiento',
    vacunas: 'http://localhost:3001/api/vacunas',
    alergias: 'http://localhost:3001/api/alergias',
  },
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


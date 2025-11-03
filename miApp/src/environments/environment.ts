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
    base: 'http://34.233.199.164:8000/api',
    pacientes: 'http://34.233.199.164:8000/api/patients',
    consultas: 'http://34.233.199.164:8000/api/consultations',
    diagnosticos: 'http://34.233.199.164:8000/api/diagnostics',
    medicamentos: 'http://34.233.199.164:8000/api/medicines',
    profesionales: 'http://34.233.199.164:8000/api/professionals',
    servicios: 'http://34.233.199.164:8000/api/services',
    tiposConsulta: 'http://34.233.199.164:8000/api/types/consult',
    tiposProcedimiento: 'http://34.233.199.164:8000/api/types/procedure',
    vacunas: 'http://34.233.199.164:8000/api/vaccines',
    alergias: 'http://34.233.199.164:8000/api/allergies',
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


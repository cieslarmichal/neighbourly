// import { RepositoryError } from '../common/errors/repositoryError.js';
// import { type DatabaseClient } from '../libs/database/clients/databaseClient/databaseClient.js';

// interface GetWithinPayload {
//   lon: number;
//   lat: number;
//   distance: number;
// }

// // Sample migration:
// // await databaseClient.schema.raw(`
// // CREATE TABLE "testGeom" (
// //   id SERIAL PRIMARY KEY,
// //   location GEOMETRY(POINT, 4326),
// //   name TEXT
// // );
// // `);

// export class TestRepository {
//   private readonly tableName = 'testGeom';

//   public constructor(private readonly databaseClient: DatabaseClient) {}

//   public async getWithin(payload: GetWithinPayload): any {
//     const { distance, lat, lon } = payload;

//     try {
//       const res = await this.databaseClient(this.tableName)
//         .whereRaw(`ST_DistanceSphere(location, ST_SetSRID(ST_MakePoint(?, ?), 4326)) <= ?`, [lat, lon, distance])
//         .select([
//           `name`,
//           this.databaseClient.raw('ST_X(location) as lon'),
//           this.databaseClient.raw(`ST_Y(location) as lat`),
//         ]);

//       return res;
//     } catch (error) {
//       throw new RepositoryError({
//         entity: 'TestRepository',
//         operation: 'getWithin',
//         error,
//       });
//     }
//   }
// }

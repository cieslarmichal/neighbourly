// import { RepositoryError } from '../common/errors/repositoryError.js';
// import { type DatabaseClient } from '../libs/database/clients/databaseClient/databaseClient.js';

// interface GetWithinPayload {
//   lon: number;
//   lat: number;
//   distance: number;
// }

// export class TestRepository {
//   private readonly tableName = 'testGeom';

//   public constructor(private readonly databaseClient: DatabaseClient) {}

//   public async getWithin(payload: GetWithinPayload): any {
//     const { distance, lat, lon } = payload;

//     try {
//       const res = await this.databaseClient(this.tableName).whereRaw(
//         `ST_DistanceSphere(location, ST_SetSRID(ST_MakePoint(?, ?), 4326)) <= ?`,
//         [lat, lon, distance],
//       );

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

import { faker } from '@faker-js/faker';

export class Generator {
  public static email(): string {
    return faker.internet.email().toLowerCase();
  }

  public static number(min = 0, max = 100, precision = 1): number {
    return faker.number.float({
      min,
      max,
      multipleOf: precision,
    });
  }

  public static string(length: number): string {
    return faker.string.sample(length);
  }

  public static alphanumericString(length: number, casing: 'lower' | 'upper' = 'lower'): string {
    return faker.string.alphanumeric({
      casing,
      length,
    });
  }

  public static alphaString(length: number, casing: 'lower' | 'upper' = 'lower'): string {
    return faker.string.alpha({
      casing,
      length,
    });
  }

  public static numericString(length: number): string {
    return faker.string.numeric({
      length,
    });
  }

  public static uuid(): string {
    return faker.string.uuid();
  }

  public static arrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  public static firstName(): string {
    return faker.person.firstName();
  }

  public static lastName(): string {
    return faker.person.lastName();
  }

  public static fullName(): string {
    return `${Generator.firstName()} ${Generator.lastName()}`;
  }

  public static word(): string {
    return faker.lorem.word();
  }

  public static url(): string {
    return faker.internet.url();
  }

  public static boolean(): boolean {
    return faker.datatype.boolean();
  }

  public static password(): string {
    let password = faker.internet.password({
      length: 13,
    });

    password += Generator.alphaString(1, 'upper');

    password += Generator.alphaString(1, 'lower');

    password += Generator.numericString(1);

    return password;
  }

  public static sentences(count = 3): string {
    return faker.lorem.sentences(count);
  }

  public static sentence(): string {
    return faker.lorem.sentence();
  }

  public static words(count = 3): string {
    return faker.lorem.words(count);
  }

  public static futureDate(): Date {
    return faker.date.future();
  }

  public static pastDate(): Date {
    return faker.date.past();
  }

  public static userGroupRole(): string {
    return faker.helpers.arrayElement(['admin', 'user']);
  }

  public static accessType(): string {
    return faker.helpers.arrayElement(['private', 'public']);
  }

  public static locationNearby(location: { latitude: number; longitude: number; radius?: number }): {
    latitude: number;
    longitude: number;
  } {
    const { latitude, longitude, radius = 1000 } = location;

    const values = faker.location.nearbyGPSCoordinate({
      isMetric: true,
      origin: [latitude, longitude],
      radius: radius / 1000,
    });

    return {
      latitude: values[0],
      longitude: values[1],
    };
  }
}

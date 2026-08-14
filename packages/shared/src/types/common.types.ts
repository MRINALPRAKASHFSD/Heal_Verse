export type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type UUID = Brand<string, 'UUID'>;
export type ISODateString = Brand<string, 'ISODateString'>;
export type EmailAddress = Brand<string, 'EmailAddress'>;
export type Percentage = Brand<number, 'Percentage'>;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type TimeRange = {
  start: ISODateString;
  end: ISODateString;
};

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };
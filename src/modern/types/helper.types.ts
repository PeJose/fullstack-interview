export type ParseDateToString<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string;
};
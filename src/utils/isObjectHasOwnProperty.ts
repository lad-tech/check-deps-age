type KeysOfUnion<T> = T extends T ? keyof T : never;

export function isObjectHasOwnProperty<T, U extends KeysOfUnion<T>>(
  obj: T,
  prop: U
): obj is T & Record<U, T[U]> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

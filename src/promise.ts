export const isPromise = (val): val is Promise<unknown> =>
  val && typeof val === 'object' && 'then' in val && 'catch' in val;

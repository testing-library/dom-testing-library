import {Matcher} from 'matches'
import * as queries from './queries'

type BoundFunction<T> = T extends (
  a1: any,
  text: infer P,
  options: infer Q,
) => infer R
  ? (text: P, options?: Q) => R
  : never
type BoundFunctions<T> = {[P in keyof T]: BoundFunction<T[P]>}

export const bindElementToQueries: (
  element: HTMLElement,
) => BoundFunctions<typeof queries>

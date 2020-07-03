import * as queries from './queries'
import {Matcher, ByRoleOptions, MatcherOptions} from './matches'
import {waitForOptions} from './wait-for'
import {ARIARole} from 'aria-query'
import {SelectorMatcherOptions} from './query-helpers'

export type QueryByBoundAttributeForElement = (
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement | null

export type AllByBoundAttributeForElement = (
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement[]

export type FindAllByBoundAttributeForElement = (
  id: Matcher,
  options?: MatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type GetByBoundAttributeForElement = (
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement

export type FindByBoundAttributeForElement = (
  id: Matcher,
  options?: MatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

export type QueryByTextForElement = (
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement | null

export type AllByTextForElement = (
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement[]

export type FindAllByTextForElement = (
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type GetByTextForElement = (
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement

export type FindByTextForElement = (
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

// disable unified-signatures to have intellisense for aria roles
/* tslint:disable:unified-signatures */
export function AllByRoleForElement(
  role: Matcher,
  options?: ByRoleOptions,
): HTMLElement[]
export function AllByRoleForElement(
  role: ARIARole,
  options?: ByRoleOptions,
): HTMLElement[]

export function GetByRoleForElement(
  role: Matcher,
  options?: ByRoleOptions,
): HTMLElement
export function GetByRoleForElement(
  role: ARIARole,
  options?: ByRoleOptions,
): HTMLElement

export function QueryByRoleForElement(
  role: Matcher | ByRoleOptions,
  options?: ByRoleOptions,
): HTMLElement | null
export function QueryByRoleForElement(
  role: ARIARole,
  options?: ByRoleOptions,
): HTMLElement | null

export function FindByRoleForElement(
  role: Matcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement>
export function FindByRoleForElement(
  role: ARIARole,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement>

export function FindAllByRoleForElement(
  role: Matcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement[]>
export function FindAllByRoleForElement(
  role: Matcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement[]>

export interface BoundFunctions {
  getByLabelText: GetByTextForElement
  getAllByLabelText: AllByTextForElement
  queryByLabelText: QueryByTextForElement
  queryAllByLabelText: AllByTextForElement
  findByLabelText: FindByTextForElement
  findAllByLabelText: FindAllByTextForElement
  getByPlaceholderText: GetByBoundAttributeForElement
  getAllByPlaceholderText: AllByBoundAttributeForElement
  queryByPlaceholderText: QueryByBoundAttributeForElement
  queryAllByPlaceholderText: AllByBoundAttributeForElement
  findByPlaceholderText: FindByBoundAttributeForElement
  findAllByPlaceholderText: FindAllByBoundAttributeForElement
  getByText: GetByTextForElement
  getAllByText: AllByTextForElement
  queryByText: QueryByTextForElement
  queryAllByText: AllByTextForElement
  findByText: FindByTextForElement
  findAllByText: FindAllByTextForElement
  getByAltText: GetByBoundAttributeForElement
  getAllByAltText: AllByBoundAttributeForElement
  queryByAltText: QueryByBoundAttributeForElement
  queryAllByAltText: AllByBoundAttributeForElement
  findByAltText: FindByBoundAttributeForElement
  findAllByAltText: FindAllByBoundAttributeForElement
  getByTitle: GetByBoundAttributeForElement
  getAllByTitle: AllByBoundAttributeForElement
  queryByTitle: QueryByBoundAttributeForElement
  queryAllByTitle: AllByBoundAttributeForElement
  findByTitle: FindByBoundAttributeForElement
  findAllByTitle: FindAllByBoundAttributeForElement
  getByDisplayValue: GetByBoundAttributeForElement
  getAllByDisplayValue: AllByBoundAttributeForElement
  queryByDisplayValue: QueryByBoundAttributeForElement
  queryAllByDisplayValue: AllByBoundAttributeForElement
  findByDisplayValue: FindByBoundAttributeForElement
  findAllByDisplayValue: FindAllByBoundAttributeForElement
  getByRole: typeof GetByRoleForElement
  getAllByRole: typeof AllByRoleForElement
  queryByRole: typeof QueryByRoleForElement
  queryAllByRole: typeof AllByRoleForElement
  findByRole: typeof FindByRoleForElement
  findAllByRole: typeof FindAllByRoleForElement
  getByTestId: GetByBoundAttributeForElement
  getAllByTestId: AllByBoundAttributeForElement
  queryByTestId: QueryByBoundAttributeForElement
  queryAllByTestId: AllByBoundAttributeForElement
  findByTestId: FindByBoundAttributeForElement
  findAllByTestId: FindAllByBoundAttributeForElement
}

export type Query = (
  container: HTMLElement,
  ...args: any[]
) =>
  | Error
  | Promise<HTMLElement[]>
  | Promise<HTMLElement>
  | HTMLElement[]
  | HTMLElement
  | null

export interface Queries {
  [T: string]: Query
}

export function getQueriesForElement(
  element: HTMLElement,
  queriesToBind?: typeof queries,
): BoundFunctions

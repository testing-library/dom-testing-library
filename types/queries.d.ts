import {Matcher, MatcherOptions} from './matches'
import {SelectorMatcherOptions} from './query-helpers'
import {waitForOptions} from './wait-for'
import {ARIARole} from 'aria-query'

export type QueryByBoundAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement | null

export type AllByBoundAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement[]

export type FindAllByBoundAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type GetByBoundAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement

export type FindByBoundAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

export type QueryByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement | null

export type AllByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement[]

export type FindAllByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type GetByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement

export type FindByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

export interface ByRoleOptions extends MatcherOptions {
  /**
   * If true includes elements in the query set that are usually excluded from
   * the accessibility tree. `role="none"` or `role="presentation"` are included
   * in either case.
   */
  hidden?: boolean
  /**
   * If true only includes elements in the query set that are marked as
   * selected in the accessibility tree, i.e., `aria-selected="true"`
   */
  selected?: boolean
  /**
   * Includes every role used in the `role` attribute
   * For example *ByRole('progressbar', {queryFallbacks: true})` will find <div role="meter progressbar">`.
   */
  queryFallbacks?: boolean
  /**
   * Only considers  elements with the specified accessible name.
   */
  name?:
    | string
    | RegExp
    | ((accessibleName: string, element: Element) => boolean)
}

// disable unified-signatures to have intellisense for aria roles
/* tslint:disable:unified-signatures */
export function AllByRole(
  container: HTMLElement,
  role: Matcher,
  options?: ByRoleOptions,
): HTMLElement[]
export function AllByRole(
  container: HTMLElement,
  role: ARIARole,
  options?: ByRoleOptions,
): HTMLElement[]

export function GetByRole(
  container: HTMLElement,
  role: Matcher,
  options?: ByRoleOptions,
): HTMLElement
export function GetByRole(
  container: HTMLElement,
  role: ARIARole,
  options?: ByRoleOptions,
): HTMLElement

export function QueryByRole(
  container: HTMLElement,
  role: Matcher | ByRoleOptions,
  options?: ByRoleOptions,
): HTMLElement | null
export function QueryByRole(
  container: HTMLElement,
  role: ARIARole,
  options?: ByRoleOptions,
): HTMLElement | null

export function FindByRole(
  container: HTMLElement,
  role: Matcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement>
export function FindByRole(
  container: HTMLElement,
  role: ARIARole,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement>

export function FindAllByRole(
  container: HTMLElement,
  role: Matcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement[]>
export function FindAllByRole(
  container: HTMLElement,
  role: Matcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
): Promise<HTMLElement[]>
/* tslint:enable */

export const getByLabelText: GetByText
export const getAllByLabelText: AllByText
export const queryByLabelText: QueryByText
export const queryAllByLabelText: AllByText
export const findByLabelText: FindByText
export const findAllByLabelText: FindAllByText
export const getByPlaceholderText: GetByBoundAttribute
export const getAllByPlaceholderText: AllByBoundAttribute
export const queryByPlaceholderText: QueryByBoundAttribute
export const queryAllByPlaceholderText: AllByBoundAttribute
export const findByPlaceholderText: FindByBoundAttribute
export const findAllByPlaceholderText: FindAllByBoundAttribute
export const getByText: GetByText
export const getAllByText: AllByText
export const queryByText: QueryByText
export const queryAllByText: AllByText
export const findByText: FindByText
export const findAllByText: FindAllByText
export const getByAltText: GetByBoundAttribute
export const getAllByAltText: AllByBoundAttribute
export const queryByAltText: QueryByBoundAttribute
export const queryAllByAltText: AllByBoundAttribute
export const findByAltText: FindByBoundAttribute
export const findAllByAltText: FindAllByBoundAttribute
export const getByTitle: GetByBoundAttribute
export const getAllByTitle: AllByBoundAttribute
export const queryByTitle: QueryByBoundAttribute
export const queryAllByTitle: AllByBoundAttribute
export const findByTitle: FindByBoundAttribute
export const findAllByTitle: FindAllByBoundAttribute
export const getByDisplayValue: GetByBoundAttribute
export const getAllByDisplayValue: AllByBoundAttribute
export const queryByDisplayValue: QueryByBoundAttribute
export const queryAllByDisplayValue: AllByBoundAttribute
export const findByDisplayValue: FindByBoundAttribute
export const findAllByDisplayValue: FindAllByBoundAttribute
export const getByRole: typeof GetByRole
export const getAllByRole: typeof AllByRole
export const queryByRole: typeof QueryByRole
export const queryAllByRole: typeof AllByRole
export const findByRole: typeof FindByRole
export const findAllByRole: typeof FindAllByRole
export const getByTestId: GetByBoundAttribute
export const getAllByTestId: AllByBoundAttribute
export const queryByTestId: QueryByBoundAttribute
export const queryAllByTestId: AllByBoundAttribute
export const findByTestId: FindByBoundAttribute
export const findAllByTestId: FindAllByBoundAttribute

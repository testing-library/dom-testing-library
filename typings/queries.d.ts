import {Matcher, MatcherOptions} from './matches'
import {SelectorMatcherOptions} from './query-helpers'

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

export type GetByBoundAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement

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

export type GetByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => HTMLElement

export const queryByPlaceholderText: QueryByBoundAttribute
export const queryAllByPlaceholderText: AllByBoundAttribute
export const getByPlaceholderText: GetByBoundAttribute
export const getAllByPlaceholderText: AllByBoundAttribute
export const queryBySelectText: QueryByBoundAttribute
export const queryAllBySelectText: AllByBoundAttribute
export const getBySelectText: GetByBoundAttribute
export const getAllBySelectText: AllByBoundAttribute
export const queryByText: QueryByText
export const queryAllByText: AllByText
export const getByText: GetByText
export const getAllByText: AllByText
export const queryByLabelText: QueryByText
export const queryAllByLabelText: AllByText
export const getByLabelText: GetByText
export const getAllByLabelText: AllByText
export const queryByAltText: QueryByBoundAttribute
export const queryAllByAltText: AllByBoundAttribute
export const getByAltText: GetByBoundAttribute
export const getAllByAltText: AllByBoundAttribute
export const queryByTestId: QueryByBoundAttribute
export const queryAllByTestId: AllByBoundAttribute
export const getByTestId: GetByBoundAttribute
export const getAllByTestId: AllByBoundAttribute
export const queryByTitle: QueryByBoundAttribute
export const queryAllByTitle: AllByBoundAttribute
export const getByTitle: GetByBoundAttribute
export const getAllByTitle: AllByBoundAttribute
export const queryByValue: QueryByBoundAttribute
export const queryAllByValue: AllByBoundAttribute
export const getByValue: GetByBoundAttribute
export const getAllByValue: AllByBoundAttribute
export const queryByDisplayValue: QueryByBoundAttribute
export const queryAllByDisplayValue: AllByBoundAttribute
export const getByDisplayValue: GetByBoundAttribute
export const getAllByDisplayValue: AllByBoundAttribute
export const queryByRole: QueryByBoundAttribute
export const queryAllByRole: AllByBoundAttribute
export const getByRole: GetByBoundAttribute
export const getAllByRole: AllByBoundAttribute

import {Matcher, MatcherOptions} from './matches'

export interface SelectorMatcherOptions extends MatcherOptions {
  selector?: string
}

export type QueryByAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement | null

export type AllByAttribute = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement[]

export type GetByAttribute = (
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

export const queryByPlaceholderText: QueryByAttribute
export const queryAllByPlaceholderText: AllByAttribute
export const getByPlaceholderText: GetByAttribute
export const getAllByPlaceholderText: AllByAttribute
export const queryByText: QueryByText
export const queryAllByText: AllByText
export const getByText: GetByText
export const getAllByText: AllByText
export const queryByLabelText: QueryByText
export const queryAllByLabelText: AllByText
export const getByLabelText: GetByText
export const getAllByLabelText: AllByText
export const queryByAltText: QueryByAttribute
export const queryAllByAltText: AllByAttribute
export const getByAltText: GetByAttribute
export const getAllByAltText: AllByAttribute
export const queryByTestId: QueryByAttribute
export const queryAllByTestId: AllByAttribute
export const getByTestId: GetByAttribute
export const getAllByTestId: AllByAttribute
export const queryByTitle: QueryByAttribute
export const queryAllByTitle: AllByAttribute
export const getByTitle: GetByAttribute
export const getAllByTitle: AllByAttribute

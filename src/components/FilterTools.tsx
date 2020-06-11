import React from 'react'
import styled from 'styled-components'
// Components
import FormMessage from './TradeWidget/FormMessage'
// Assets
import searchIcon from 'assets/img/search.svg'
// Misc
import { MEDIA } from 'const'

export const BalanceTools = styled.div<{ $css?: string | false }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  align-items: center;
  order: 0;

  ${FormMessage} {
    color: var(--color-text-primary);
    background: var(--color-background-validation-warning);
    font-size: x-small;
    margin: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: max-content;
    padding: 0.1rem 1.6rem 0.1rem 0.5rem;
    border-radius: 0 1.6rem 0rem 0rem;
  }

  // label + search input
  > .balances-searchTokens {
    display: flex;
    width: auto;
    max-width: 100%;
    position: relative;
    height: 5.6rem;
    margin: 1.6rem;

    > input {
      margin: 0;
      width: 35rem;
      max-width: 100%;
      background: var(--color-background-input) url(${searchIcon}) no-repeat left 1.6rem center/1.6rem;
      border-radius: 0.6rem 0.6rem 0 0;
      border: 0;
      font-size: 1.4rem;
      line-height: 1;
      box-sizing: border-box;
      border-bottom: 0.2rem solid transparent;
      font-weight: var(--font-weight-normal);
      padding: 0 1.6rem 0 4.8rem;
      outline: 0;

      @media ${MEDIA.mobile} {
        font-size: 1.3rem;
        width: 100%;
      }

      &::placeholder {
        font-size: inherit;
        color: inherit;
      }

      &:focus {
        color: var(--color-text-active);
      }

      &:focus {
        border-bottom: 0.2rem solid var(--color-text-active);
        border-color: var(--color-text-active);

        transition: all 0.2s ease-in-out;
      }

      &.error {
        border-color: var(--color-error);
      }

      &.warning {
        border-color: orange;
      }

      &:disabled {
        box-shadow: none;
      }
    }
    @media ${MEDIA.mobile} {
      width: 100%;
      height: 4.6rem;
      margin: 0 0 2.4rem;

      > ${FormMessage} {
        bottom: -1.2rem;
        border-radius: 0 0 1.6rem 0rem;
      }
    }
  }
  ${({ $css = '' }): string | false => $css}
`

interface Props {
  customStyles?: string | false
  dataLength: number
  searchValue: string
  showFilter: boolean
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterTools: React.FC<Props> = ({
  children,
  customStyles,
  dataLength,
  searchValue,
  showFilter,
  handleSearch,
}) => (
  <BalanceTools $css={customStyles}>
    <label className="balances-searchTokens">
      <input
        placeholder="Search token by Name, Symbol or Address"
        type="text"
        value={searchValue}
        onChange={handleSearch}
      />
      {showFilter && <FormMessage id="filterLabel">Filter: Showing {dataLength} tokens</FormMessage>}
    </label>
    <>{children}</>
  </BalanceTools>
)

export default FilterTools

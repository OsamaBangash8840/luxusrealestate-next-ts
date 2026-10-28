'use client'

import React from 'react'
import Select, {
  components,
  type ActionMeta,
  type MultiValue,
  type Props as SelectProps,
  type SingleValue,
} from 'react-select'
import { IoChevronDown } from 'react-icons/io5'

import { Typography } from '../../common'
import styles from './Select.module.css'

interface ISelectField<OptionType>
  extends Omit<SelectProps<OptionType>, 'onChange' | 'value'> {
  placeholder?: string
  value?: SingleValue<OptionType> | null
  className?: string
  label?: string
  onChange?: (
    value: SingleValue<OptionType> | null,
    actionMeta: ActionMeta<OptionType>
  ) => void
}

const customStyles = {
  control: () => ({}),
  valueContainer: (baseStyles: any) => ({
    ...baseStyles,
    paddingLeft: 20,
    paddingRight: 20,
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--text-body))',
  }),
  placeholder: (style: any) => ({
    ...style,
    color: 'hsl(var(--muted-foreground))',
    opacity: 0.8,
  }),
  menu: (style: any) => ({
    ...style,
    background: 'hsl(var(--surface-elevated))',
    paddingLeft: 10,
    paddingRight: 10,
    border: '1px solid hsl(var(--border))',
  }),
  option: (style: any, state: any) => ({
    ...style,
    background: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--surface-elevated))',
    color: 'hsl(var(--text-body))',
  }),
}

export const SelectField = <OptionType,>({
  placeholder,
  className,
  value,
  onChange,
  label,
  ...rest
}: ISelectField<OptionType>): React.ReactElement => {
  const handleChange = (
    newValue: SingleValue<OptionType> | MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ): void => {
    if (typeof onChange !== 'undefined') {
      onChange(newValue as SingleValue<OptionType>, actionMeta)
    }
  }

  return (
    <div className="flex-1">
      {typeof label !== 'undefined' && (
        <Typography className="mb-1.5 block font-medium text-body">{label}</Typography>
      )}
      <div
        className={`${className} relative flex h-[44px] flex-1 items-center rounded-full border border-boxOutline bg-boxColorDark text-sm text-body placeholder:text-muted-foreground sm:h-[56px] sm:text-base`}
      >
        <Select
          placeholder={placeholder}
          className="w-full"
          value={value}
          onChange={handleChange}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            Menu: (props: any) => <components.Menu {...props} className={styles.menu} />,
          }}
          styles={{
            ...customStyles,
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'hsl(var(--primary))',
            },
          })}
          {...rest}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-body"
          aria-label="Toggle options"
        >
          <IoChevronDown />
        </button>
      </div>
    </div>
  )
}
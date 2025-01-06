'use client';

import React from 'react';
import Select, {
    components,
    type Props as SelectProps,
    type ActionMeta,
    type SingleValue,
    type MultiValue,
} from 'react-select';
import { Typography } from '../../common';
import styles from './Select.module.css';
import { IoChevronDown } from 'react-icons/io5';
import { colors } from '@/app/base/config/colors';

interface ISelectField<OptionType>
    extends Omit<SelectProps<OptionType>, 'onChange' | 'value'> {
    placeholder?: string;
    value?: SingleValue<OptionType> | null;
    className?: string;
    label?: string;
    onChange?: (
        value: SingleValue<OptionType> | null,
        actionMeta: ActionMeta<OptionType>
    ) => void;
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
        color: colors.secondary,
    }),
    placeholder: (style: any) => ({
        ...style,
        color: colors.secondary,
        opacity: 0.3,
    }),
    menu: (style: any) => ({
        ...style,
        background: colors.newLinear,
        paddingLeft: 10,
        paddingRight: 10,
    }),
    option: (style: any) => ({
        ...style,
        background: colors.newLinear,
        color: colors.secondary,
    }),
};

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
            onChange(newValue as SingleValue<OptionType>, actionMeta);
        }
    };

    return (
        <div className="flex-1">
            {typeof label !== 'undefined' && (
                <Typography className="font-medium text-body block mb-1.5 text-secondary">
                    {label}
                </Typography>
            )}
            <div
                className={`${className} flex-1 h-[44px] sm:h-[56px] rounded-full bg-boxColorDark flex items-center text-sm sm:text-base relative text-secondary placeholder-secondary/30 border border-boxOutline`}
            >
                <Select
                    placeholder={placeholder}
                    className="w-full"
                    value={value}
                    onChange={handleChange}
                    components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                        Menu: (props: any) => (
                            <components.Menu
                                {...props}
                                className={styles.menu}
                            />
                        ),
                    }}
                    styles={{
                        ...customStyles,
                    }}
                    theme={theme => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: colors.primary,
                        },
                    })}
                    {...rest}
                />
                <button className="absolute top-1/2 -translate-y-1/2 right-4  text-secondary text-xl">
                    <IoChevronDown />
                </button>
            </div>
        </div>
    );
};

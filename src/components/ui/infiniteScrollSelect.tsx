
import { AsyncPaginate } from "react-select-async-paginate";

import { CSSObject } from 'styled-components';


const InfiniteScrollSelect = ({ loadOptions, value, onChange, placeHolder }) => {


    // ShadCN-like styles for react-select
    const customStyles = {
        container: (provided: CSSObject) => ({
            ...provided,
            width: '100%',
            borderRadius: '8px',
        }),
        control: (provided: CSSObject) => ({
            ...provided,
            backgroundColor: '#fff',
            borderColor: '#e0e0e0',
            borderRadius: '8px',
            padding: '8px',
            '&:hover': {
                borderColor: '#a0a0a0',
            },
        }),
        menu: (provided: CSSObject) => ({
            ...provided,
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }),
        menuList: (provided: CSSObject) => ({
            ...provided,
            padding: '8px 0',
        }),
        option: (provided: CSSObject, state: any) => ({
            ...provided,
            padding: '8px 16px',
            backgroundColor: state.isSelected ? '#f0f0f0' : state.isFocused ? '#f7f7f7' : '#fff',
            borderRadius: '8px',
            color: '#333',
            '&:hover': {
                backgroundColor: '#f7f7f7',
            },
        }),
        singleValue: (provided: CSSObject) => ({
            ...provided,
            color: '#333',
        }),
        input: (provided: CSSObject) => ({
            ...provided,
            color: '#333',
            padding: '0',
        }),
        placeholder: (provided: CSSObject) => ({
            ...provided,
            color: '#b0b0b0',
        }),
    };

    return (
        <AsyncPaginate
            value={value}
            loadOptions={loadOptions}
            onChange={onChange}
            additional={{
                page: 1,
            }}
            placeholder={placeHolder || "Search for options..."}
        />

    );
};

export default InfiniteScrollSelect;

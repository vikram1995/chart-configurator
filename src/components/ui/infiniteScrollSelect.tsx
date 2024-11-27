
import { AsyncPaginate } from "react-select-async-paginate";

const InfiniteScrollSelect = ({ loadOptions, value, onChange, placeHolder }) => {

    return (
        <AsyncPaginate
            value={value}
            loadOptions={loadOptions}
            debounceTimeout={300}
            onChange={onChange}
            additional={{
                page: 1,
            }}
            placeholder={placeHolder || "Search for options..."}
        />

    );
};

export default InfiniteScrollSelect;

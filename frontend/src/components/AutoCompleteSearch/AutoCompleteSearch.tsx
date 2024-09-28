import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import styles from "./AutoCompleteSearch.module.css";

interface data {
    id: number;
    name: string;
}

const AutoCompleteSearch = () => {
    return (
        <div>
            <ReactSearchAutocomplete
                items={[]}
                placeholder="Search your product here"
                showNoResultsText="Sorry, your product is empty"
            />
        </div>
    );
};

export default AutoCompleteSearch;

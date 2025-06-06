import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
const SearchTable = ({ searchQuery, handleSearch }) => {
    return (
        <>
            <TextField
                fullWidth
                placeholder="ค้นหาด้วยหมายเลขงาน ชื่องาน สถานะ หรือวันที่"
                value={searchQuery}
                onChange={handleSearch}
            />
        </>

    );
}
SearchTable.propTypes = {
    searchQuery: PropTypes.string.isRequired, 
    handleSearch: PropTypes.func.isRequired
};
export default SearchTable;
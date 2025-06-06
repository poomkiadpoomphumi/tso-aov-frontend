import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { getLogsUser } from '../../axios/handleSubmit';
import Loader from '../../component/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { getStatus } from '../status';

const getStatusColor = (status) => {
    switch (status) {
        case 'draft':
            return '#3498DB';
        case 'forwarded':
            return '#ff9800';
        case 'waiting':
            return '#ff9800';
        case 'waiting for approval':
            return '#ff9800';
        case 'forwarded, waiting for approval':
            return '#ff9800';
        case 'rejected':
            return '#f44336';
        case 'approved':
            return '#4caf50';
        default:
            return 'black';
    }
};
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const RequestDetail = ({ rows, loader, type, open, close }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => { setPage(newPage); };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [expandedRow, setExpandedRow] = React.useState(null); // Track the expanded row

    const navigate = useNavigate();

    const handleClose = () => { close(false); setRow([]); };

    const handleRowClick = (rowId, system) => {
        setExpandedRow(expandedRow === rowId ? null : rowId);
        if (system === 'Digital request') {
            navigate(`/DigitalRequestForm/${rowId}`);
        }
        if (system === 'Firewall request') {
            navigate(`/FireWallRequestForm/${rowId}`);
        }
    };

    if (loader) { return <Loader /> }

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} sx={{
            '& .MuiDialog-paper': {
                width: '1800px', // Set the width here
                maxWidth: '100%', // Ensure it doesn't overflow
            },
        }}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1, color: '#fff' }} variant="h3" component="div">
                        LIST REQUESTER SYSTEM {type.replace(/_/g, ' ')}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>CLOSE</Button>
                </Toolbar>
            </AppBar>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ width: '100px' }}>#ID</TableCell>
                            <TableCell align="center">COORDINATOR NAME</TableCell>
                            <TableCell align="center">DEPARTMENT</TableCell>
                            <TableCell align="center">PHONE NUMBER</TableCell>
                            <TableCell align="center">STATUS</TableCell>
                            <TableCell align="center">JOB NAME</TableCell>
                            <TableCell align="center">JOB DETAILS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ fontWeight: 'bold', color: 'gray' }}>
                                    No data available, please try again.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const item = row.tickets;
                                const { status } = getStatus(item, row.system, item.requesterCode);
                                return (
                                    <React.Fragment key={row._id}>
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#f0f0f0', // Change the hover background color
                                                },
                                                transition: 'background-color 0.3s ease',
                                            }}
                                            onClick={() => handleRowClick(row._id, row.system)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell component="th" scope="row">{row.tickets.ticketId}</TableCell>
                                            <TableCell align="center">{row.coordinatorName}</TableCell>
                                            <TableCell align="center">{row.department}</TableCell>
                                            <TableCell align="center">{row.contactNumber}</TableCell>
                                            <TableCell align="center" sx={{ color: getStatusColor(status), fontWeight: 'bold' }}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </TableCell>
                                            <TableCell align="left" sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: 290,
                                            }}>
                                                {row.jobName}
                                            </TableCell>
                                            <TableCell align="left" sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: 300,
                                            }}>
                                                {row.jobDetails || row.usageReason}
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>

                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 25, 30, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

        </Dialog>
    );
};

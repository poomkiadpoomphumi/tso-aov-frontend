import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TextField, Grid } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const columns = [
    { id: 'sourceip', label: 'Source IP', minWidth: 100 },
    { id: 'destinationip', label: 'Destination IP', minWidth: 170, align: 'center' },
    { id: 'port', label: 'Port', minWidth: 170, align: 'center' },
    { id: 'startdate', label: 'Start Date', minWidth: 170, align: 'center' },
    { id: 'enddate', label: 'End Date', minWidth: 170, align: 'center' },
    { id: 'usage', label: 'Usage', minWidth: 170, align: 'center' },
    { id: 'action', label: 'Action', minWidth: 170, align: 'right' },
];

const AlertDialogSlide = ({ openDialog, setOpenDialog, access, setAccess, editingIndex, setEditingIndex, editingData }) => {
    const [isTemporary, setIsTemporary] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [formData, setFormData] = React.useState({
        sourceip: '',
        destinationip: '',
        port: '',
        startdate: '',
        enddate: '',
    });

    React.useEffect(() => {
        if (editingData) {
            setFormData(editingData);
            setIsTemporary(editingData.startdate !== '' || editingData.enddate !== '');
        }
    }, [editingData]);

    const fields = [
        { xs: 6, label: 'Source IP', name: 'sourceip' },
        { xs: 6, label: 'Destination IP', name: 'destinationip' },
        { xs: 12, label: 'Port', name: 'port' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = () => {
        const newErrors = {};
        const requiredFields = ['sourceip', 'destinationip', 'port'];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = 'This field is required';
            }
        });

        if (isTemporary) {
            if (!formData.startdate) newErrors.startdate = 'Start date is required';
            if (!formData.enddate) newErrors.enddate = 'End date is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({});
            }, 2000);
            return;
        }

        const newEntry = {
            ...formData,
            startdate: isTemporary ? formData.startdate : '',
            enddate: isTemporary ? formData.enddate : '',
        };

        if (editingIndex !== null) {
            const updated = [...access];
            updated[editingIndex] = newEntry;
            setAccess(updated);
            setEditingIndex(null);
        } else {
            setAccess((prev) => [...prev, newEntry]);
        }

        setFormData({ sourceip: '', destinationip: '', port: '', startdate: '', enddate: '' });
        setIsTemporary(false);
        setErrors({});
        setOpenDialog(false);
    };

    const handleClose = () => {
        setEditingIndex(null);
        setOpenDialog(false);
    };

    return (
        <Dialog open={openDialog} keepMounted onClose={handleClose}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Add Firewall Access</Typography>
            </Toolbar>
            <DialogContent>
                <Grid container spacing={3}>
                    {fields.map((field, index) => (
                        <Grid item xs={field.xs} key={index}>
                            <TextField
                                type="text"
                                label={field.label}
                                fullWidth
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                                error={Boolean(errors[field.name])}
                                helperText={errors[field.name] || ''}
                            />
                        </Grid>
                    ))}
                </Grid><br />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!isTemporary}
                            onChange={() => setIsTemporary(false)}
                        />
                    }
                    label="ใช้งานแบบถาวร"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isTemporary}
                            onChange={() => setIsTemporary(true)}
                        />
                    }
                    label="ใช้งานแบบชั่วคราว"
                /><br />
                {isTemporary && (
                    <>
                        <Typography sx={{ mt: 2 }}>Start Date</Typography>
                        <TextField
                            type="date"
                            fullWidth
                            name="startdate"
                            value={formData.startdate}
                            onChange={handleChange}
                            error={Boolean(errors.startdate)}
                            helperText={errors.startdate || ''}
                        /><br /><br />
                        <Typography>End Date</Typography>
                        <TextField
                            type="date"
                            fullWidth
                            name="enddate"
                            value={formData.enddate}
                            onChange={handleChange}
                            error={Boolean(errors.enddate)}
                            helperText={errors.enddate || ''}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleAdd}>SAVE</Button>
            </DialogActions>
        </Dialog>
    );
};


const EnhancedTable = ({ access, setAccess,openDialog, setOpenDialog,readOnly }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [editingIndex, setEditingIndex] = React.useState(null);
    const [editingData, setEditingData] = React.useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = access;
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <AlertDialogSlide
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                access={access}
                setAccess={setAccess}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                editingData={editingData}
            />
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>Firewall Access</Typography>
                <Button variant="contained" color="primary" sx={{ mr: 1 }} size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => {
                    setEditingIndex(null);
                    setEditingData(null);
                    setOpenDialog(true);
                }} disabled={readOnly}>Add</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => setAccess([])} disabled={readOnly}>Remove All</Button>
            </Toolbar>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>{column.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">No data to display.</TableCell>
                            </TableRow>
                        ) : (
                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                <TableRow hover tabIndex={-1} key={rowIndex}>
                                    {columns.map((column) => {
                                        let value = row[column.id];
                                        if (column.id === 'usage') {
                                            const isPermanent = !row.startdate || !row.enddate;
                                            value = isPermanent ? 'Permanent' : 'Temporary';
                                        }
                                        if (column.id === 'action') {
                                            return (
                                                <TableCell key={column.id} align="center">
                                                    <Button variant="contained" color="warning" size="small" sx={{ mr: 1 }}
                                                        onClick={() => {
                                                            setEditingIndex(rowIndex);
                                                            setEditingData(row);
                                                            setOpenDialog(true);
                                                        }} disabled={readOnly}><EditNoteIcon sx={{ color: '#fff' }} /></Button>
                                                    <Button variant="contained" color="error" size="small" onClick={() => {
                                                        const updated = [...access];
                                                        updated.splice(rowIndex, 1);
                                                        setAccess(updated);
                                                    }} disabled={readOnly}><DeleteIcon /></Button>
                                                </TableCell>
                                            );
                                        }
                                        return (
                                            <TableCell key={column.id} align={column.align} sx={column.id === 'usage' ? {
                                                color: value === 'Temporary' ? 'warning.main' : 'success.main', fontWeight: 600
                                            } : {}}>
                                                {value || '--'}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default EnhancedTable;
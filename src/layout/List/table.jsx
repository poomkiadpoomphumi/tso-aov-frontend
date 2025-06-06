import React, { useEffect, useState, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getDataRequest } from '../../axios/handleSubmit.js';
import Loader from '../../component/Loader/Loader.jsx';
import { useNavigate } from 'react-router-dom';
import SearchTable from './SearchBox.jsx';
import { styled } from '@mui/material/styles'; // Use styled from @mui/material/styles
import { getCodeImg } from '../../axios/handleSubmit.js';
import { Grid, Box, Avatar, AvatarGroup, Typography, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList.js';
import { orange } from '@mui/material/colors';
import SaveAsIcon from '@mui/icons-material/SaveAs.js';
import FilterListOffIcon from '@mui/icons-material/FilterListOff.js';
import Tooltip from '@mui/material/Tooltip';
import { getStatus, getColorSystem } from '../../views/status.jsx';
import { useTheme } from '@material-ui/core/styles';
import ReplayIcon from '@mui/icons-material/Replay.js';
import Snackbar from '../../component/Sanckbar/index.jsx';

const ColorButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  backgroundColor: '#3366ff',
  '&:hover': {
    backgroundColor: '#3366ff',
  },
}));
const ColorButtonClear = styled(Button)(({ theme }) => ({
  color: '#fff',
  backgroundColor: orange[500],
  '&:hover': {
    backgroundColor: orange[700],
  },
}));
const CustomChipWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  borderRadius: theme.shape.borderRadius,
}));;
const StyledTypography = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const columns = [
  { id: 'id', label: '#ID', minWidth: 50, align: 'left' },
  { id: 'jobName', label: 'Project Name', minWidth: 50, align: 'left' },
  { id: 'status', label: 'Status', minWidth: 50, align: 'center' },
  { id: 'NameApprover', label: 'Approver', minWidth: 50, align: 'left' },
  { id: 'system', label: 'Service', minWidth: 50, align: 'center' },
  { id: 'updateAt', label: 'Date', minWidth: 50, align: 'center' }
];

const StickyHeadTable = ({ selectedButtons, formValues, filter, handleClickOpen, changeBtn, handleClear }) => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const getRequest = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('tokenUser');
      const getCode = await getCodeImg(token);
      const response = await getDataRequest(token);
      let filteredData = [];
      if (response && Array.isArray(response.data)) {

        filteredData = response.data.map(item => {
          //Status calculation
          const { status, isFirewall, islastActionLine } = getStatus(item, item.system, getCode.code);
          // Generate Avatar + Approver Name
          const renderApprover = () => {
            const avatarSize = { width: 33, height: 33 };

            if (item.sectionHeadStatus === 'draft' && item.departmentHeadStatus === 'wait') {
              // ดราฟต์ = แสดง icon อย่างเดียว
              return <Avatar sx={avatarSize}><SaveAsIcon /></Avatar>;
            }
            if (
              (
                isFirewall &&
                item.sectionHeadStatus === 'reject' &&
                item.departmentHeadStatus === 'wait' &&
                item.maxLevelApprover === 3
              ) ||
              (
                isFirewall &&
                item.sectionHeadStatus === 'approved' &&
                item.departmentHeadStatus === 'reject' &&
                item.maxLevelApprover === 3
              )
            ) {
              return (
                <>
                  <AvatarGroup max={2}>
                    <Avatar sx={avatarSize} src={`https://hq-web-s13.pttplc.com/directory/photo/${islastActionLine.action === 'rejected' ? islastActionLine.code : item.sectionHeadCode}.jpg?36JVBHXSPL`} />
                  </AvatarGroup>
                  <StyledTypography variant="body1">{item.NameApprover}</StyledTypography>
                </>
              );
            }
            if ((item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'approved' && item.maxLevelApprover === 3)) {
              return (
                <>
                  <AvatarGroup max={2}>
                    <Avatar sx={avatarSize} src={`https://hq-web-s13.pttplc.com/directory/photo/${item.departmentHeadCode}.jpg?36JVBHXSPL`} />
                  </AvatarGroup>
                  <StyledTypography variant="body1">{item.NameApprover}</StyledTypography>
                </>
              );
            }
            if (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'approved' && item.maxLevelApprover === 4) {
              return (
                <>
                  <AvatarGroup max={2}>
                    <Avatar sx={avatarSize} src={`https://hq-web-s13.pttplc.com/directory/photo/${item.sectionHeadCode}.jpg?36JVBHXSPL`} />
                    <Avatar sx={avatarSize} src={`https://hq-web-s13.pttplc.com/directory/photo/${item.departmentHeadCode}.jpg?36JVBHXSPL`} />
                  </AvatarGroup>
                  <StyledTypography variant="body1">{item.NameApprover}</StyledTypography>
                </>
              );
            }

            if (
              (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4) ||
              (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && isFirewall && item.maxLevelApprover === 3) ||
              (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'reject' && item.maxLevelApprover === 4)
            ) {
              return (
                <>
                  <Avatar sx={avatarSize} src={`https://hq-web-s13.pttplc.com/directory/photo/${item.departmentHeadCode}.jpg?36JVBHXSPL`} />
                  <StyledTypography variant="body1">{item.NameApprover}</StyledTypography>
                </>
              );
            }

            if (
              (item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait') ||
              (item.sectionHeadStatus === 'reject' && item.departmentHeadStatus === 'wait') ||
              (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait')
            ) {
              const approverCode = item.departmentHeadCode === getCode.code ? item.departmentHeadCode : item.sectionHeadCode;
              return (
                <>
                  <Avatar sx={avatarSize} src={`https://hq-web-s13.pttplc.com/directory/photo/${approverCode}.jpg?36JVBHXSPL`} />
                  <StyledTypography variant="body1">{item.NameApprover}</StyledTypography>
                </>
              );
            }

            return <Avatar sx={avatarSize}><SaveAsIcon /></Avatar>;
          };

          return {
            id: item.ticketId,
            formId: item.formId,
            jobName: item.jobName || 'Draft',
            NameApprover: renderApprover(),
            system: getColorSystem(item, theme),
            status,
            updateAt: item.updateAt || item.createAt
          };
        });
      }

      setRows(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [theme]);


  useEffect(() => {
    getRequest();
  }, [getRequest]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (id, system) => {
    if (system === 'Digital request') {
      navigate(`/DigitalRequestForm/${id}`);
    }
    if (system === 'Firewall request') {
      navigate(`/FireWallRequestForm/${id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return '#3498DB';
      case 'forwarded, waiting for approval':
        return '#ff9800';
      case 'waiting for approval':
        return '#ff9800';
      case 'rejected':
        return '#f44336';
      case 'approved':
        return '#4caf50';
      default:
        return 'black';
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const formatDate = (start, end) => {
    const [yearS, monthS, dayS] = start.split('-');
    const [yearE, monthE, dayE] = end.split('-');
    const startDate = `${yearS}-${monthS}-${dayS} 00:00:00`;
    const endDate = `${yearE}-${monthE}-${dayE} 23:59:59`;
    return { startDate, endDate };
  };

  useEffect(() => {
    if (filter) {
      setFilteredRows(rows.filter(row => {
        const matchesSelectedButtons = selectedButtons?.some(button =>
          row['system']?.toString().toLowerCase().includes(button.toLowerCase())
        );

        let isBetweenDates = true;

        if (formValues.startDate && formValues.endDate) {
          // Extract and parse the updateAt date from row
          const originalDate = row['updateAt']?.split(' ')[0];
          if (originalDate) {
            const parts = originalDate.split('-');
            const updatedAtString = `${parts[0]}-${parts[2]}-${parts[1]} 00:00:00`;
            const validDate = new Date(updatedAtString).getTime();
            const { startDate, endDate } = formatDate(formValues.startDate, formValues.endDate);
            if (new Date(formValues.startDate).getTime() === new Date(formValues.endDate).getTime()) {
              isBetweenDates = validDate === new Date(startDate).getTime();
            } else {
              isBetweenDates = new Date(startDate).getTime() <= validDate && validDate <= new Date(endDate).getTime();
            }
          } else {
            isBetweenDates = false; // If date extraction fails, assume out of range
          }
        }
        // Check status and project name matches
        const matchesStatus = formValues.status
          ? row['status'] === formValues.status
          : formValues.project
            ? row['jobName']?.toString().toLowerCase().includes(formValues.project?.toLowerCase())
            : true;

        return matchesSelectedButtons && matchesStatus && isBetweenDates;
      }));
    } else {
      setFilteredRows(rows.filter(row =>
        columns.some(column =>
          row[column.id]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
    }
  }, [rows, searchQuery, selectedButtons, formValues, filter]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  useEffect(() => {
    const shouldOpen = localStorage.getItem('openSnackbar') === 'true';
    if (shouldOpen) {
      setOpenSnackbar(true);
      localStorage.removeItem('openSnackbar');
    }
  }, []);


  return (
    <Box sx={{ width: '100%' }}>
      {openSnackbar && (<Snackbar variant='success' text='Submitted and saved successfully!' />)}
      {filteredRows.length <= 0 && !loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="65vh"
          textAlign="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h5" sx={{ color: '#9e9e9e' }}>
              No data available.
            </Typography>
            <Button variant="outlined" startIcon={<ReplayIcon />} color="secondary" size="small"
              onClick={() => {
                localStorage.setItem('reload', 'reload');
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </Box>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Loader />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: 2,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                  }}
                >
                  {changeBtn ? (
                    <Tooltip title="Clear filter" placement="bottom" arrow>
                      <ColorButtonClear variant="contained" sx={{ marginRight: 2 }} onClick={handleClear}>
                        <FilterListOffIcon />
                      </ColorButtonClear>
                    </Tooltip>
                  ) : (
                    <Tooltip title="filter data" placement="bottom" arrow>
                      <ColorButton variant="contained" sx={{ marginRight: 2 }} onClick={handleClickOpen}>
                        <FilterListIcon />
                      </ColorButton>
                    </Tooltip>
                  )}

                  <SearchTable searchQuery={searchQuery} handleSearch={handleSearch} />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align} sx={{ minWidth: 50 }}>
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow
                            hover
                            role="checkbox"
                            style={{ cursor: 'pointer' }}
                            tabIndex={-1}
                            key={row.formId}
                            onClick={() => handleRowClick(row.formId, row.system?.props?.children)}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  sx={{
                                    color: column.id === 'status' ? getStatusColor(value) : 'black',
                                    fontWeight: column.id === 'status' ? 'bold' : 'normal',
                                  }}
                                >
                                  {column.id === 'jobName' || column.id === 'NameApprover' || column.id === 'id' ? (
                                    <CustomChipWrapper sx={{ justifyContent: 'left', whiteSpace: 'nowrap' }}>
                                      {value.length > 40 ? `${value.substring(0, 40)}...` : value}
                                    </CustomChipWrapper>
                                  ) : (
                                    <CustomChipWrapper sx={{ justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                      {column.id === 'status' ? value.charAt(0).toUpperCase() + value.slice(1) : value}
                                    </CustomChipWrapper>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={filteredRows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Grid>
            </Grid>
          )}
        </Paper>
      )}
    </Box>
  );

}

export default StickyHeadTable;

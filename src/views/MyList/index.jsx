import React, { useState, useEffect, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TableList from '../../layout/List/table.jsx';
import { getDataFormdigital, updateStatusApprove, updateStatusReject, CheckApprover, getCodeImg } from '../../axios/handleSubmit.js';
import AlertDialog from '../../component/expired/index';
import ApprovalsForm from '../../layout/Approve/index.jsx';
import { Box, Stack, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList.js';
import { TextField, Grid, DialogContentText, Dialog, DialogTitle, FormControl, MenuItem, InputLabel, Select, DialogActions, DialogContent } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext.js';
import FilterListOffIcon from '@mui/icons-material/FilterListOff.js';
import Loader from '../../component/Loader/Loader.jsx';
import { useTheme } from '@mui/material/styles';

const Approvals = ({ location, switchApp }) => {
  const theme = useTheme();
  const [value, setValue] = useState('1');
  const [data, setData] = useState([]);
  const [render, setRender] = useState(true);
  const [loadingItemsApprove, setLoadingItemsApprove] = useState({});
  const [loadingItemsReject, setLoadingItemsReject] = useState({});
  const [commentValue, setCommentValue] = useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [CheckApproverValue, setCheckApprover] = useState(false);
  const searchTerm = '';
  const [loader, setLoader] = useState(true);
  const token = localStorage.getItem('tokenUser');
  const [countDigital, setCountDigital] = useState(0);
  const [countFirewall, setCountFirewall] = useState(0);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [arrayButtons, setArrayButtons] = useState([]);
  const [arrayForm, setArrayForm] = useState([]);
  const [filter, setFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [changeBtn, setChangeBtn] = useState(false);
  const [dataFirewall, setDataFirewall] = useState([]);
  const [dataDigital, setDataDigital] = useState([]);
  const [formValues, setFormValues] = useState({
    project: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  const handleApproved = async (id, params, userCode) => {
    const updatedComment = [...commentValue, { text: newComment, updateAt: '' }];
    setCommentValue(updatedComment);      // อัปเดต comment array
    setNewComment('');                    // เคลียร์ input
    setLoadingItemsApprove((prevState) => ({ ...prevState, [id]: true }));
    try {
      await updateStatusApprove(id, updatedComment, params, userCode);
      localStorage.setItem('showTab2', 'true');
      localStorage.setItem('approved', 'true');
      localStorage.setItem('lastVisitedRoute', location.pathname);
      setTimeout(() => {
        window.location.reload();
      }, 800)
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleReject = async (id, params, userCode) => {
    const updatedComment = [...commentValue, { text: newComment, updateAt: '' }];
    setCommentValue(updatedComment);      // อัปเดต comment array
    setNewComment('');                    // เคลียร์ input
    setLoadingItemsReject((prevState) => ({ ...prevState, [id]: true }));
    try {
      await updateStatusReject(id, updatedComment, params, userCode);
      localStorage.setItem('showTab2', 'true');
      localStorage.setItem('reject', 'true');
      localStorage.setItem('lastVisitedRoute', location.pathname);
      setTimeout(() => {
        window.location.reload();
      }, 800)
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };
  const [exp, setExp] = useState(false);
  const handleChange = useCallback(async (event, newValue) => {
    setValue(newValue);
    try {
      if (token) {
        const getCode = await getCodeImg(token);
        const responseData = await getDataFormdigital(token);
        const dataApprover = await CheckApprover(token);
        if (responseData.data.length === 0) {
          setLoader(false);
        } else {
          if (getCode.length === 0) setExp(true);
          if (responseData && Array.isArray(responseData.data)) {
            const digitalItems = responseData.data.filter(item =>
              item.system === 'Digital request' &&
              (
                (item.sectionHeadStatus === 'wait' && item.maxLevelApprover === 3) ||
                (item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.sectionHeadCode === getCode.code) ||
                (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.departmentHeadCode === getCode.code)
              )
            );

            const firewallItems = responseData.data.filter(item =>
              item.system === 'Firewall request' &&
              !(
                item.sectionHeadStatus === 'approved' &&
                item.departmentHeadStatus === 'approved' &&
                item.maxLevelApprover === 3
              ) &&
              !(
                item.sectionHeadStatus === 'approved' &&
                item.departmentHeadStatus === 'rejected' &&
                item.maxLevelApprover === 3
              ) &&
              (
                (item.sectionHeadStatus === 'wait' && item.maxLevelApprover === 3) ||
                (item.sectionHeadStatus === 'approved' && item.maxLevelApprover === 3) ||
                (item.sectionHeadStatus !== 'approved' && item.departmentHeadStatus !== 'approved' && item.maxLevelApprover === 3) ||
                (item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.sectionHeadCode === getCode.code) ||
                (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.departmentHeadCode === getCode.code)
              )
            );
            setCountDigital(digitalItems.length);
            setCountFirewall(firewallItems.length);
            setDataFirewall(firewallItems);
            setDataDigital(digitalItems);
          }
          if (dataApprover.length <= 0) {
            setCheckApprover(false);
            setLoader(false);
          } else {
            setCheckApprover(true);
            setLoader(false);
            setData(responseData.data);
          }
        }

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  }, [token]);

  // Filter data based on search term
  const filteredData = dataDigital.filter((item) => {
    // Convert each field to lowercase and check if it includes the searchTerm
    for (const key in item) {
      if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchTerm.toLowerCase())) {
        return true; // If any field matches, return true
      }
    }
    return false; // If no field matches, return false
  });


  useEffect(() => {
    const handleInitialLoad = async () => {
      if (switchApp === true) {
        handleChange(null, '1');
        localStorage.removeItem('tomylist');
        return; // skip rest if we switched apps
      }
      if (countDigital > 0 || countFirewall > 0 && render) {
        handleChange(null, '1');
        if (localStorage.getItem('approved') === 'true') {
          handleChange(null, '2');
          localStorage.removeItem('approved');
          setRender(false)
        }
        if (localStorage.getItem('reject') === 'true') {
          handleChange(null, '2');
          localStorage.removeItem('reject');
          setRender(false)
        }
      } else if (localStorage.getItem('showTab2') === 'true' || localStorage.getItem('sendForm') === 'sent') {
        handleChange(null, '2');
        localStorage.removeItem('showTab2');
        localStorage.removeItem('sendForm');
        setRender(false)

      } else if (localStorage.getItem('cancel') === 'cancel') {
        handleChange(null, '2');
        localStorage.removeItem('cancel');
        setRender(false)
      } else if (localStorage.getItem('delete') === 'delete') {
        localStorage.removeItem('delete');
        handleChange(null, '2');
      } else {
        handleChange(null, '2');
      }
    };
    handleInitialLoad();
  }, [handleChange, countDigital, countFirewall, render, switchApp]);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButtons((prevSelected) =>
      prevSelected.includes(buttonType)
        ? prevSelected.filter((type) => type !== buttonType)
        : [...prevSelected, buttonType]
    );
  };

  const handleFilterClick = () => {
    if (selectedButtons.length <= 0) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1500)
    } else {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
      }, 35)
      setChangeBtn(true);
      setError(false);
      setArrayButtons(selectedButtons);
      setArrayForm(formValues);
      setOpen(false);
      setFilter(true);
    }

  };
  const handleClear = () => {
    setChangeBtn(false);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 35)
    setSelectedButtons([]);
    setFormValues({
      project: '',
      startDate: '',
      endDate: '',
      status: ''
    });
    setFilter(false)
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };
  const isSelected = (buttonType) => selectedButtons.includes(buttonType);
  const currentDate = new Date().toISOString().split('T')[0];
  const convertDateFormat = (originalDate) => {
    const [datePart] = originalDate.split(' ');
    const [year, day, month] = datePart.split('-');
    const newDateFormat = `${year}-${month}-${day}`;

    return newDateFormat;
  };
  const statusColor =
    formValues.status === 'approved' ?
      theme.palette.success.main :
      formValues.status === 'waiting for approval' ?
        theme.palette.warning.main :
        formValues.status === 'rejected' ?
          theme.palette.error.main :
          theme.palette.primary.main;
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  if (loader) {
    return <Loader />
  }
  return (
    <>
      {exp && <AlertDialog />}
      <Box sx={{ width: '100%', borderColor: 'divider' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              {countDigital || countFirewall !== 0 ? (
                <Tab
                  label="Approvals Request"
                  value="1"
                  sx={{ minWidth: '190px', padding: '0 16px' }}
                />
              ) : (
                <Tab label="Approvals Request" value="1" sx={{ minWidth: '190px', padding: '0 16px' }} />
              )}
              <Tab label="Request History" value="2" sx={{ padding: '0 16px' }} />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ width: '100%', padding: 0 }}><br />
            <ApprovalsForm
              location={location}
              newComment={newComment}
              setNewComment={setNewComment}
              handleApproved={handleApproved}
              handleReject={handleReject}
              CheckApproverValue={CheckApproverValue}
              filteredData={filteredData}
              loadingItemsApprove={loadingItemsApprove}
              loadingItemsReject={loadingItemsReject}
              loader={loader}
              dataFirewall={dataFirewall}
              countDigital={countDigital}
              countFirewall={countFirewall}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ width: '100%', padding: 0 }}>
            <br />
            <Box sx={{ display: 'flex-start', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ width: '100%', alignItems: 'center' }}
              >
                <Breadcrumbs
                  sx={{ flexGrow: 1 }}
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="breadcrumb"
                >
                  {changeBtn ? (
                    <Typography key="0" color="text.primary">
                      <b>Filter data</b>
                    </Typography>
                  ) : null}
                  {formValues.project && changeBtn ? (
                    <Typography key="1" color="text.primary">
                      Project name : {capitalizeFirstLetter(formValues.project)}
                    </Typography>
                  ) : null}
                  {formValues.status && changeBtn ? (
                    <Typography key="2" color="text.primary">
                      Status : <span style={{ color: statusColor }}>{capitalizeFirstLetter(formValues.status)}</span>
                    </Typography>
                  ) : null}
                  {selectedButtons.length > 0 && changeBtn ? (
                    selectedButtons.map(item =>
                      <Typography key="3" color="text.primary">
                        Service : {capitalizeFirstLetter(item)}
                      </Typography>
                    )
                  ) : null}
                  {formValues.startDate && changeBtn ? (
                    <Typography key="4" color="text.primary">
                      Start date : {convertDateFormat(formValues.startDate)}
                    </Typography>
                  ) : null}
                  {formValues.endDate && changeBtn ? (
                    <Typography key="5" color="text.primary">
                      End date : {convertDateFormat(formValues.endDate)}
                    </Typography>
                  ) : null}
                </Breadcrumbs>
              </Stack>
            </Box>
            <br />
            <TableList
              selectedButtons={arrayButtons}
              formValues={arrayForm}
              filter={filter}
              handleClickOpen={handleClickOpen}
              changeBtn={changeBtn}
              handleClear={handleClear}
            />
          </TabPanel>
        </TabContext>
      </Box>

      {/* Dialog Filter */}
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Filter requests</DialogTitle>
          <DialogContent>
            <Grid container spacing={1} columns={16}>
              <Grid item xs={16} sm={8} md={8}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    margin="dense"
                    fullWidth
                    variant="standard"
                    id="project"
                    name="project"
                    label="Project name"
                    value={formValues.project}
                    onChange={handleInputChange}
                  /><br />
                  <label>Start-Date</label>
                  <TextField
                    type="date"
                    margin="dense"
                    fullWidth
                    variant="standard"
                    id="start"
                    name="startDate"
                    value={formValues.startDate}
                    onChange={handleInputChange}
                    inputProps={{ max: currentDate }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={16} sm={8} md={8}>
                <FormControl variant="standard" fullWidth sx={{ top: '4px' }}>
                  <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="status"
                    name="status"
                    value={formValues.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="waiting for approval">Waiting for approval</MenuItem>
                  </Select>
                  <br />
                  <label>End-Date</label>
                  <TextField
                    type="date"
                    margin="dense"
                    fullWidth
                    variant="standard"
                    id="end"
                    name="endDate"
                    value={formValues.endDate}
                    onChange={handleInputChange}
                    sx={{ top: '4px' }}
                    inputProps={{ max: currentDate }}
                  />
                </FormControl>
              </Grid>
            </Grid><br />
            <DialogContentText sx={{ color: error ? 'red' : 'primary' }}>
              Service list {error ? 'required*' : ''}
            </DialogContentText><br />
            <Stack spacing={2} direction="row">
              <Button variant={isSelected('digital request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('digital request')} color={error ? 'error' : 'primary'}>DIGITAL REQUEST</Button>
              <Button variant={isSelected('fileshare request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('fileshare request')} color={error ? 'error' : 'primary'}>FILE SHARE REQUEST</Button>
              <Button variant={isSelected('pmis smart tso request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('pmis smart tso request')} color={error ? 'error' : 'primary'}>PMIS SMART REQUEST</Button>
            </Stack><br />
            <Stack spacing={2} direction="row">
              <Button variant={isSelected('tso intranet request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('tso intranet request')} color={error ? 'error' : 'primary'}>TSO INTRANET REQUEST</Button>
              <Button variant={isSelected('api request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('api request')} color={error ? 'error' : 'primary'}>API REQUEST</Button>
              <Button variant={isSelected('firewall request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('firewall request')} color={error ? 'error' : 'primary'}>FIREWALL REQUEST</Button>
            </Stack><br />
            <Stack spacing={2} direction="row">
              <Button variant={isSelected('tso data center request') ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('tso data center request')} color={error ? 'error' : 'primary'}>TSO DATA CENTER REQUEST</Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              color="warning"
              sx={{ color: '#fff' }}
              variant="contained"
              startIcon={<FilterListOffIcon />}
              onClick={handleClear}>CLEAR</Button>
            <Button
              startIcon={<FilterListIcon />}
              variant="contained"
              onClick={handleFilterClick}>FILTER</Button>
          </DialogActions>
        </Dialog>
      </>
      {/* End Dialog filter */}
    </>


  );
};

export default Approvals;

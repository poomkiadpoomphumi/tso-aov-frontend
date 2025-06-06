import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button } from '@mui/material';

const DialogContentX = ({
    openSendForm,
    handleCloseSendForm,
    handleSendForm,
    _delete,
    setDelete,
    handleDelete,
    id,
    openDraft,
    OpenFileSzie,
    handleCloseFileSize,
    openAccept,
    setOpenAccept,
    setFormValues,
    OpenError,
    errorText,
    OpenAddSystem,
    systemData,
    handleInputChangeSystem,
    formValues,
    setOpenAddSystem,
    handleOkClick,
    showError,
    alertPpt,
    setFilePptAlert,
    alertXlsx, setFileXlsxAlert
}) => {
    return (
        <>
            {/* Dialog file power point*/}
            <Dialog open={alertPpt} keepMounted aria-describedby="alert-dialog-slide-description" >
                <DialogTitle sx={{ color: 'red' }}>{"Only PowerPoint files (.ppt, .pptx) are allowed!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" >
                        Only PowerPoint files (.ppt, .pptx) are allowed and maximum File Size is 10 MB.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFilePptAlert(false)}>Agree</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog file excel*/}
            <Dialog open={alertXlsx} keepMounted aria-describedby="alert-dialog-slide-description" >
                <DialogTitle sx={{ color: 'red' }}>{"Only Excel files (.xls, .xlsx) are allowed!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" >
                        Only Excel files (.xls, .xlsx) are allowed and maximum File Size is 10 MB.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFileXlsxAlert(false)}>Agree</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog send form */}
            <Dialog open={openSendForm} keepMounted onClose={handleCloseSendForm} aria-describedby="alert-dialog-slide-description" >
                <DialogTitle sx={{ color: 'red', fontSize: '25px' }}>{"Are you sure submit?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ fontSize: '20px' }}>
                        You won't be able to revert this! This form cannot be edited once you submit.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleCloseSendForm}>Disagree</Button>
                    <Button onClick={handleSendForm}>Agree</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog Delete */}
            <Dialog open={_delete} keepMounted onClose={handleCloseSendForm} aria-describedby="alert-dialog-slide-description" >
                <DialogTitle sx={{ color: 'red' }}>{"Are you sure delete?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You won't be able to revert this! This form cannot be edited once you deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => setDelete(false)}>Disagree</Button>
                    <Button onClick={() => handleDelete(id)}>Agree</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Draft */}
            <Dialog open={openDraft} keepMounted onClose={handleCloseSendForm} aria-describedby="alert-dialog-slide-description" >
                <DialogTitle >{"Are you sure draft?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You will still be able to edit and submit forms and can view drafts in the My list.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleCloseSendForm}>Disagree</Button>
                    <Button onClick={handleSendForm}>Agree</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog File size */}
            <Dialog open={OpenFileSzie} keepMounted onClose={handleCloseFileSize} aria-describedby="alert-dialog-slide-description" >
                <DialogTitle >{"File size exceeds the limit of 10MB."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        File size exceeds the limit of 10MB. Please upload new file.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFileSize}>Agree</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Accept */}
            <Dialog open={openAccept} keepMounted aria-describedby="alert-dialog-slide-description" >
                <DialogTitle >{"สำหรับการพัฒนา Application ผู้ขอรับทราบและดำเนินการตามข้อกำหนด บริษัท ปตท. จำกัด(มหาชน) ว่าด้วยการรักษาความมั่นคงปลอดภัยสารสนเทศ ดังต่อไปนี้"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        1. Source code Scan ประกอบด้วย Static Application Security Testing, dynamic Application Security Testing และ Software Composition Analytic
                        <br />
                        2. Venerability Assessment (VA) Scan
                        <br />
                        3. การเชื่อมต่อข้อมูลระหว่าง DB และ Application ต้องผ่าน WSO2
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => setOpenAccept(false)}>Disagree</Button>
                    <Button onClick={() => {
                        setFormValues({ ...formValues, checkboxChecked: true }); // Set checkbox to checked
                        setOpenAccept(false); // Close the dialog
                    }}
                    >Agree</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Upload error */}
            <Dialog open={OpenError} keepMounted aria-describedby="alert-dialog-slide-description"  >
                <DialogTitle color='error'>{"The process is not complete."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {errorText}. Please contact the administrator.<br /> (คป. คุณอธิเบศร์ โทร 35259 คุณปีติภัทร โทร 35266 คุณปกป้อง โทร 35395)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => window.location.reload()}>Agree</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog addd system */}
            <Dialog open={OpenAddSystem} keepMounted aria-describedby="alert-dialog-slide-description">
                <DialogTitle>ระบบที่ต้องการเชื่อมข้อมูล</DialogTitle>
                <DialogContent
                    sx={{
                        width: { xs: '100%', sm: '550px' }, // 100% width for phones (xs), fixed width 550px for larger screens (sm and up)
                        maxWidth: '100%', // Prevents overflow on small screens
                    }}
                >
                    <DialogContentText id="alert-dialog-slide-description">
                        <br />
                        <TextField
                            multiline
                            type="text"
                            variant='outlined'
                            color='primary'
                            label="ระบบ"
                            name="systemName" // Add name attribute to bind with state
                            fullWidth
                            required
                            value={systemData?.systemName}
                            onChange={handleInputChangeSystem} // Update state on change
                            error={!systemData?.systemName && showError} // Show error if value is empty and user has clicked ADD
                        /><br /><br />
                        <TextField
                            multiline
                            type="text"
                            variant='outlined'
                            color='primary'
                            label="ข้อมูลที่ใช้"
                            name="dataUsed" // Add name attribute to bind with state
                            fullWidth
                            required
                            value={systemData?.dataUsed}
                            onChange={handleInputChangeSystem} // Update state on change
                            error={!systemData?.dataUsed && showError} // Show error if value is empty and user has clicked ADD
                        /><br /><br />
                        <TextField
                            multiline
                            type="text"
                            variant='outlined'
                            color='primary'
                            label="หน่วยงานเจ้าของระบบ"
                            name="owner" // Add name attribute to bind with state
                            fullWidth
                            required
                            value={systemData?.owner}
                            onChange={handleInputChangeSystem} // Update state on change
                            error={!systemData?.owner && showError} // Show error if value is empty and user has clicked ADD
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => setOpenAddSystem(false)}>CANCEL</Button>
                    <Button onClick={handleOkClick}>ADD</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default DialogContentX;
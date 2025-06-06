import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderSharedIcon from '@mui/icons-material/FolderOpen';
import {
    Card,
    CardContent,
    Grid,
    Avatar,
    Typography,
    Pagination,
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    Box
} from '@mui/material';
import { gridSpacing } from 'config.jsx';
import LoadingButton from '@mui/lab/LoadingButton';

const FileshareReq = ({ CheckApproverValue, countApp, classes, loader }) => {
    return (
        <>
            {CheckApproverValue && countApp > 0 && (
                <>
                    <Typography variant="h6" className={`${classes.link} ${true ? classes.disabled : ''}`}>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                            <FolderSharedIcon sx={{ marginRight: 1 }} />
                            <b>FILE SHARE REQUEST</b>
                        </Box>
                    </Typography>
                    <br />
                    <br />
                </>
            )}
            <Grid container spacing={gridSpacing}>
                {CheckApproverValue &&
                    !loader &&
                    [1, 2].map((item) => (
                        <Grid item key={item} sx={{ width: '100%' }}>
                            <Card>
                                <CardContent>
                                    FILE SHARE REQUEST COMING SOON...
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
                                            <Avatar />
                                            <div style={{ marginLeft: '5px', marginTop: '2px' }}>
                                                <span style={{ fontSize: '14px' }}>
                                                    <Box sx={{ fontSize: '2rem', width: '150px', height: 15 }} className={classes.dis} />
                                                </span>
                                                <span style={{ display: 'block', marginTop: '10px', fontSize: '12px' }}>
                                                    <Box sx={{ fontSize: '2rem', width: '150px', height: 15, marginTop: '-4px' }} className={classes.dis} />
                                                </span>
                                                <br />
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {/* content */}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion defaultExpanded>
                                        <Box sx={{ width: '100%', height: 50, borderRadius: 3 }} className={classes.dis} />
                                        <AccordionDetails>
                                            <span><Box sx={{ fontSize: '2rem', width: '250px', height: 15 }} className={classes.dis} /></span>
                                        </AccordionDetails>
                                        <AccordionActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <LoadingButton
                                                disabled
                                                variant="contained"
                                            >
                                                Approve
                                            </LoadingButton>
                                            <LoadingButton
                                                disabled
                                                color="error"
                                                variant="contained"
                                            >
                                                Reject
                                            </LoadingButton>
                                        </AccordionActions>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            {4 > 1 && (
                <>
                    <Pagination
                        disabled
                        count={4}
                        page={1}
                        shape="rounded"
                        color="primary"
                        sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}
                    />
                    <br />
                    <hr />
                </>
            )}
        </>
    );
}
FileshareReq.propTypes = {}
export default FileshareReq;
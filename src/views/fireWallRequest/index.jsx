import React from "react";
import { gridSpacing } from '../../config.jsx';
import CardMedia from '@mui/material/CardMedia';
import useIsMobile from '../../layout/Mobile/isMobile.jsx'
import { Card, Grid, Typography } from '@mui/material';
import img from '../../img/Automation control and Operation application division.png';
import FireWallRequest from '../../layout/FireWallRequest/index.jsx';
import AzureData from '../../service/getApiData.js';
import BreadcrumbsContainer from '../StyledBreadcrumb/index.jsx';
import BoxContainer from '../BoxContainer/index.jsx';
import { useParams } from 'react-router-dom';
import CustomizedTimeline from "../../layout/Timeline/index.jsx";
import Loader from "../../component/Loader/Loader.jsx";
import Fade from '@mui/material/Fade';
import ButtonContainer from '../../component/HeaderTimeline/index.jsx';

const FireWallRequestComponent = () => {
    const { id } = useParams();
    const isMobile = useIsMobile();
    const profilePromise = AzureData();
    const [showTimeline, setShowTimeline] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [rawData, setRawData] = React.useState([]);
    const [settingData, setSettingData] = React.useState([]);
    if (loading) {
        return <Loader />
    }
    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item sx={{ width: '100%' }}>
                    <BreadcrumbsContainer />
                    {
                        !isMobile ? (
                            <CardMedia component="img" image={img} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                        ) : null
                    }
                    <BoxContainer>
                        <Typography component="div" variant="h3" sx={{ color: '#757575' }}>
                            {showTimeline ? (
                                <b>PMIS Firewall Policy Event timeline approvals tracking and timestamp</b>
                            ) : (
                                <b>แบบฟอร์มขออนุมัติแก้ไข PMIS Firewall Policy</b>
                            )}

                        </Typography>
                        <ButtonContainer setShowTimeline={setShowTimeline} showTimeline={showTimeline} setLoading={setLoading} isMobile={isMobile}/>
                    </BoxContainer>
                    <Card id="form-section" style={{ display: showTimeline ? 'none' : 'block' }}>
                        <FireWallRequest
                            profilePromise={profilePromise}
                            id={id}
                            rawData={rawData}
                            setRawData={setRawData}
                            setSettingData={setSettingData}
                        />
                    </Card>
                    <Fade in={showTimeline} timeout={300} unmountOnExit>
                        <div id="timeline-section" style={{ display: showTimeline ? 'block' : 'none' }}>
                            <CustomizedTimeline rawData={rawData} settingData={settingData} />
                        </div>
                    </Fade>
                </Grid>
            </Grid>
        </>
    );
}
export default FireWallRequestComponent;
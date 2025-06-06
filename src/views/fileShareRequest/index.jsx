import React from "react";
import { gridSpacing } from '../../config.jsx';
import useIsMobile from '../../layout/Mobile/isMobile.jsx'
import CardMedia from '@mui/material/CardMedia';
import { Card, Grid, Typography } from '@mui/material';
import img from '../../img/Automation control and Operation application division.png';
import Filesharerequest from '../../layout/FileshareRequest/index.jsx';
import BreadcrumbsContainer from '../StyledBreadcrumb/index.jsx';
import BoxContainer from '../BoxContainer/index.jsx';

const FileShareRequest = () => {
    const isMobile = useIsMobile();
    
    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item sx={{ width: '100%' }}>
                    <BreadcrumbsContainer />
                    {
                        !isMobile ? (
                            <CardMedia
                                component="img"
                                image={img}
                                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                            />
                        ) : null
                    }
                    <BoxContainer>
                        <Typography component="div" variant="h3" sx={{ color: '#757575' }}>
                            <b>แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน FILE SHARE REQUEST ของสายงานระบบท่อส่งก๊าซธรรมชาติ</b>
                        </Typography>
                    </BoxContainer>

                    <Card>
                        <Filesharerequest />
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
export default FileShareRequest;
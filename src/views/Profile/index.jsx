import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, CardMedia, Skeleton, Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import Poster from '../../img/S__7700483.jpg';
import AzureData from '../../service/getApiData.js';
import { getCodeImg } from '../../axios/handleSubmit.js';
import Loader from '../../component/Loader/Loader';
import useIsMobile from '../../layout/Mobile/isMobile.jsx';

const Profile = () => {
  const isMobile = useIsMobile();
  const sso = AzureData();
  const [dataUser, setDataUser] = useState(null);
  const [userExternal, setUserExternal] = useState('');
  const userLocalToken = localStorage.getItem('tokenUser');
  const [loading, setLoading] = useState(true);
  const [external, setExternal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCodeImg(userLocalToken);
        if (response === 'N' || response === 'No data available') {
          if (sso) {
            setUserExternal(sso.displayName);
            setExternal(true);
            setLoading(false);
          }
        } else {
          setDataUser(response);
          setExternal(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };
    fetchData();
  }, [userLocalToken, sso]);

  if (loading) {
    return <Loader />;
  }

  return (

      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ maxWidth: 'auto' }}>
          <CardMedia sx={{ height: !isMobile ? 350 : 200 }} image={Poster} />
          <CardContent>
              {external ? (
                <>
                  <Avatar
                    sx={{
                      bgcolor: external ? deepOrange[500] : '#ddd',
                      width: 120,
                      height: 50,
                      margin: '-60px auto 0',
                      marginLeft: 0,
                      fontSize: '50px'
                    }}
                  >
                    {userExternal.charAt(0)}
                  </Avatar><br/>
                  <Typography variant="h5">{userExternal}</Typography>
                  <Typography variant="body2" color="text.secondary">{`อีเมล : ${sso.mail}`}</Typography>
                </>
              ) : dataUser ? (
                <>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '-60px auto 0',
                      marginLeft: 0,
                      fontSize: '50px'
                    }}
                    src={`https://hq-web-s13.pttplc.com/directory/photo/${dataUser.code}.jpg?36JVBHXSPL`}
                  /><br/>
                  <Typography variant="h5">
                    {`${dataUser.iname_eng} ${dataUser.fname_eng} ${dataUser.lname_eng}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${dataUser.iname} ${dataUser.fname} ${dataUser.lname} (${dataUser.unitabbr})`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{`รหัสพนักงาน : ${dataUser.code}`}</Typography>
                  <Typography variant="body2" color="text.secondary">{`เบอร์ : ${dataUser.mobile}`}</Typography>
                  <Typography variant="body2" color="text.secondary">{`อีเมล : ${dataUser.emailaddr}`}</Typography>
                  <Typography variant="body2" color="text.secondary">{dataUser.longname}</Typography>
                  <Typography variant="body2" color="text.secondary">{dataUser.engname}</Typography>
                </>
              ) : (
                <Skeleton variant="rectangular" width="100%" height={300} />
              )}
          </CardContent>
        </Card>
      </Grid>
  );
};

export default Profile;

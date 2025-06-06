import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Grid, Typography, useMediaQuery } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// ==============================|| REVENUE CHART CARD ||============================== //

const RevenuChartCard = ({ systemReq }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Safely extract series data from systemReq
  const values = systemReq && Array.isArray(systemReq)
    ? systemReq.map(item => Object.values(item)[0])
    : [];

  // Ensure there are no issues if systemReq is empty or missing
  const chartData = {
    height: 328,
    type: 'donut',
    options: {
      dataLabels: {
        enabled: false
      },
      labels: ['Digital Request', 'Firewall Request', 'Fileshare Request', 'Pmis Smart Request', 'TSO Intranet Request', 'API Request', 'TSO Data Center Request'],
      legend: {
        show: true,
        position: 'left',
        fontFamily: 'inherit',
        labels: {
          colors: 'inherit'
        },
        markers: {
          width: 10,
          height: 10,
          radius: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 10
        },
        offsetX: -20
      },
      colors: ['#e91e63', '#f44336', '#ff7043', '#ffb300', '#03a9f4', '#80deea', '#9575cd']
    },
    series: values.length > 0 ? values : [0, 0, 0, 0, 0, 0, 0],  // Fallback if systemReq is empty
  };

  return (
    <Card>
      <CardHeader
        title={
          <Typography t="div" className="card-header">
            The number of requests per service.
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? 'row' : 'column'}>
          <Grid item xs={12} sm={7} md={12}>
            {/* Ensure options and series are passed separately */}
            <Chart options={chartData.options} series={chartData.series} height={chartData.height} type={chartData.type} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

RevenuChartCard.propTypes = {
  systemReq: PropTypes.array.isRequired
};

export default RevenuChartCard;

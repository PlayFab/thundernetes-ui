import { Typography } from '@mui/material';
import { Chart } from 'react-google-charts';

interface NodeMetrics {
    name: string;
    cpu?: number;
    memory?: number;
    allocation?: number;
}

const options1 = {
    width: 200,
    height: 150,
    redFrom: 90,
    redTo: 100,
    yellowFrom: 75,
    yellowTo: 90,
    minorTicks: 5,
  };

  const options2 = {
    width: 200,
    height: 150,
    redFrom: 0,
    redTo: 10,
    yellowFrom: 10,
    yellowTo: 25,
    minorTicks: 5,
  };

function NodeMetricsSummary(props: NodeMetrics) {
    return (
        <>
            <Typography style={{ marginTop: '20px' }} variant="h5" gutterBottom component="div">
              Metrics
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                { props.cpu && <Chart chartType='Gauge' data={[["Label", "Value"],["Memory", props.cpu]]} options={options1} />}
                { props.memory && <Chart chartType='Gauge' data={[["Label", "Value"],["Memory", props.memory]]} options={options1} />}
                { props.allocation !== undefined && <Chart chartType='Gauge' data={[["Label", "Value"],["Allocation", props.allocation]]} options={options2} />}
            </div>
        </>
    )
}

export default NodeMetricsSummary;
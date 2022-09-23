import { Typography } from '@mui/material';
import { Chart } from 'react-google-charts';

interface NodeMetrics {
    name: string;
    cpu?: number;
    memory?: number;
    allocation?: number;
}

const options = {
    width: 200,
    height: 150,
    redFrom: 90,
    redTo: 100,
    yellowFrom: 75,
    yellowTo: 90,
    minorTicks: 5,
  };


function NodeMetricsSummary(props: NodeMetrics) {
    return (
        <>
            <Typography style={{ marginTop: '20px' }} variant="h5" gutterBottom component="div">
              Metrics
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                { props.cpu && <Chart chartType='Gauge' data={[["Label", "Value"],["Memory", props.cpu]]} options={options} />}
                { props.memory && <Chart chartType='Gauge' data={[["Label", "Value"],["Memory", props.memory]]} options={options} />}
                { props.allocation !== undefined && <Chart chartType='Gauge' data={[["Label", "Value"],["Allocation", props.allocation]]} options={options} />}
            </div>
        </>
    )
}

export default NodeMetricsSummary;
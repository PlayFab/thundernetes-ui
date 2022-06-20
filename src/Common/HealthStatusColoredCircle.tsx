const colorMapping: Record<string, string> = {
  "Healthy": "#4caf50",
  "Unhealthy": "#f44336"
}

interface HealthStatusColoredCircleProps {
  health: string
}

function HealthStatusColoredCircle({ health }: HealthStatusColoredCircleProps) {
  const color = colorMapping[health];
  const coloredCircle = {
    height: "8px",
    width: "8px",
    backgroundColor: color,
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "4px"
  };

  return  color?<span style={coloredCircle} />: null;
};

export default HealthStatusColoredCircle;

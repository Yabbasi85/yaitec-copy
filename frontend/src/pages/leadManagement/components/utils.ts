export const getStatusColor = (status: string): string => {
    switch (status) {
      case "New":
        return "blue";
      case "Contacted":
        return "yellow";
      case "Qualified":
        return "green";
      case "Lost":
        return "red";
      default:
        return "gray";
    }
  };
  
  export const getScoreColor = (score: number): string => {
    if (score >= 90) return "green";
    if (score >= 70) return "yellow";
    return "red";
  };
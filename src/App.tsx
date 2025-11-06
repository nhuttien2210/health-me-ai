import React from "react";
import BaseLayout from "@/components/base-layout";
import HealthReport from "@/feature/health-report";

const App: React.FC = () => {
  return (
    <BaseLayout>
      <HealthReport />
    </BaseLayout>
  );
};

export default App;

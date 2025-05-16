import React, { useEffect } from "react";
import { useAdminStore } from "../stores/admin.store";

const ConnectBack = () => {
  const { getTotalReport, totalReport } = useAdminStore();

  useEffect(() => {
    async function fetchReport() {
      await getTotalReport();
    }
    fetchReport();
  }, []);
  console.log(totalReport);
  return <div>ConnectBack</div>;
};

export default ConnectBack;
